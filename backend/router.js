import { Router } from "express";
import multer from "multer";
import path from "path";
import { db } from "./server.js";
import asyncHandler from "./handlers/asyncHandler.js";
import { uploadImage, uploadAudio } from "./services/azureBlobStorage.js";

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store files in memory temporarily

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Image upload route
router.post(
  "/upload-image",
  upload.single("image"),
  asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded",
      });
    }

    const ext = path.extname(req.file.originalname);
    const imageName =
      req.body.imageName || path.basename(req.file.originalname, ext);
    const fileName = imageName + ext;

    // Upload to Azure instead of saving locally
    const imageUrl = await uploadImage(req.file.buffer, fileName);

    res.json({
      success: true,
      data: {
        imageName: fileName,
        imageUrl: imageUrl, // Return the Azure blob URL
      },
      message: "Image uploaded successfully",
    });
  })
);

//Audio upload route
router.post(
  "/upload-audio",
  asyncHandler(async (req, res, next) => {
    const { audioData, lessonId } = req.body;
    const userId = req.user.id;

    // Convert base64 to buffer
    const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, "");
    const audioBuffer = Buffer.from(base64Data, "base64");

    // Generate unique filename
    const fileName = `${userId}_${lessonId}_${Date.now()}.webm`;

    // Upload to Azure
    const audioUrl = await uploadAudio(audioBuffer, fileName);

    res.json({
      success: true,
      data: {
        audioUrl: audioUrl,
      },
    });
  })
);

// Get all lessons assigned to a student (with JOIN)
router.get(
  "/lessons",
  asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at, a.audio_file
     FROM lessons l
       JOIN assignments a ON l.id = a.lesson_id
       WHERE a.student_id = $1
       ORDER BY a.assigned_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
    });
  })
);

// Get specific lesson for a student (with JOIN)
router.get(
  "/lessons/:lessonId",
  asyncHandler(async (req, res, next) => {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at, a.audio_file, a.feedback
       FROM lessons l
       JOIN assignments a ON l.id = a.lesson_id
       WHERE a.student_id = $1 AND l.id = $2`,
      [userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found or not assigned",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  })
);

// Update student's lesson progress (audio file and completion)
router.patch(
  "/lessons/:lessonId",
  asyncHandler(async (req, res, next) => {
    const { audio_file } = req.body;
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Update the lesson's audio file (if provided)
    if (audio_file) {
      await db.query(
        `UPDATE assignments SET audio_file = $1, updated_at = CURRENT_TIMESTAMP
     WHERE student_id = $2 AND lesson_id = $3`,
        [audio_file, userId, lessonId]
      );
    }

    // Update assignment status to completed
    const result = await db.query(
      `UPDATE assignments
       SET status = 'completed', completed = true, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $1 AND lesson_id = $2
       RETURNING *`,
      [userId, lessonId]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  })
);

// Create new lesson content (teacher only)
router.post(
  "/lessons",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }
    const { title, image, videoId, lessonStartTime, lessonEndTime, audioFile } =
      req.body;
    // Create new lesson content
    const result = await db.query(
      `INSERT INTO lessons (title, image, video_id, lesson_start_time, lesson_end_time)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [title, image, videoId, lessonStartTime, lessonEndTime]
    );
    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  })
);

// Assign lesson to student (teacher only)
router.post(
  "/lessons/:lessonId/assign",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }

    const { lessonId } = req.params;
    const { studentId } = req.body; // Single student ID
    const teacherId = req.user.id;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // Check if lesson exists
    const lesson = await db.query("SELECT id FROM lessons WHERE id = $1", [
      lessonId,
    ]);

    if (lesson.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }
    const lessonDbId = lesson.rows[0].id;
    // Create assignment for the student
    const result = await db.query(
      `INSERT INTO assignments (student_id, lesson_id, assigned_by)
         VALUES ($1, $2, $3)
         RETURNING *`,
      [studentId, lessonDbId, teacherId]
    );
    res.status(201).json({
      success: true,
      message: "Lesson assigned successfully",
      data: result.rows[0],
    });
  })
);

// Unassign lesson from student (teacher only)
router.delete(
  "/lessons/:lessonId/unassign/:studentId",
  asyncHandler(async (req, res, next) => {
    // 1. Check if user is a teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }

    const { lessonId, studentId } = req.params;

    //Delete the assignment from database (any teacher can remove)
    const result = await db.query(
      `DELETE FROM assignments
       WHERE lesson_id = $1
       AND student_id = $2
       RETURNING *`,
      [lessonId, studentId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "Assignment not found or you don't have permission to unassign it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Lesson unassigned successfully",
      data: result.rows[0],
    });
  })
);

//Get all users
router.get(
  "/users",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admins only",
      });
    }
    const result = await db.query(
      "SELECT id, username, role FROM users WHERE role = 'student'"
    );
    res.json({
      success: true,
      data: result.rows,
    });
  })
);

// Create new student (teacher only)
router.post(
  "/users",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }
    const { createNewUser } = await import("./handlers/user.js");
    req.body.role = "student";
    await createNewUser(req, res);
  })
);

// Delete student (teacher only)
router.delete(
  "/users/:userId",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }

    const { userId } = req.params;

    // Check if user exists and is a student
    const userCheck = await db.query(
      "SELECT id, role FROM users WHERE id = $1",
      [userId]
    );

    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (userCheck.rows[0].role !== "student") {
      return res.status(403).json({
        success: false,
        message: "Cannot delete non-student users",
      });
    }

    // Delete the user (CASCADE will delete related assignments)
    await db.query("DELETE FROM users WHERE id = $1", [userId]);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  })
);

//get all lessons (for teacher dashboard)
router.get(
  "/all-lessons",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }
    const result = await db.query(
      `SELECT l.*, COUNT(a.id) AS assigned_count,
              SUM(CASE WHEN a.completed THEN 1 ELSE 0 END) AS completed_count
       FROM lessons l
       LEFT JOIN assignments a ON l.id = a.lesson_id
       GROUP BY l.id
       ORDER BY l.created_at DESC`
    );
    res.json({
      success: true,
      data: result.rows,
    });
  })
);

//get student data (for teacher to view student progress)
router.get(
  "/teacher/student/:studentId",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }
    const { studentId } = req.params;
    const result = await db.query(
      `SELECT id, username, role, created_at
       FROM users
       WHERE id = $1 AND role = 'student'`,
      [studentId]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  })
);
//get student lessons (for teacher to view student progress)
router.get(
  "/teacher/student/:studentId/lessons",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }
    const { studentId } = req.params;
    const result = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at, a.audio_file
       FROM lessons l
       JOIN assignments a ON l.id = a.lesson_id
       WHERE a.student_id = $1
       ORDER BY a.assigned_at DESC`,
      [studentId]
    );
    res.json({
      success: true,
      data: result.rows,
    });
  })
);

//get specific student lesson (for teacher to view student progress)
router.get(
  "/teacher/student/:studentId/lesson/:lessonId",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }
    const { studentId, lessonId } = req.params;
    const result = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at, a.audio_file, a.feedback
       FROM lessons l
       JOIN assignments a ON l.id = a.lesson_id
       WHERE a.student_id = $1 AND l.id = $2`,
      [studentId, lessonId]
    );

    res.json({
      success: true,
      data: result.rows[0],
    });
  })
);

// Update feedback for student assignment (teacher only)
router.patch(
  "/teacher/student/:studentId/lesson/:lessonId/feedback",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }

    const { studentId, lessonId } = req.params;
    const { feedback } = req.body;

    const result = await db.query(
      `UPDATE assignments
       SET feedback = $1, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $2 AND lesson_id = $3
       RETURNING *`,
      [feedback, studentId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  })
);

// Delete lesson (teacher only)
router.delete(
  "/lessons/:lessonId",
  asyncHandler(async (req, res, next) => {
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Teachers only",
      });
    }

    const { lessonId } = req.params;

    // Check if lesson exists
    const lessonCheck = await db.query("SELECT id FROM lessons WHERE id = $1", [
      lessonId,
    ]);

    if (lessonCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Delete the lesson (CASCADE will delete related assignments)
    await db.query("DELETE FROM lessons WHERE id = $1", [lessonId]);

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  })
);

export default router;
