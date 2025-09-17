import { Router } from "express";
import multer from "multer";
import path from "path";
import { db } from "./server.js";

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/images/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const desiredName = req.body.imageName || path.basename(file.originalname, ext);
    cb(null, desiredName + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Image upload route
router.post("/upload-image", upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file uploaded"
      });
    }

    const ext = path.extname(req.file.originalname);
    const imageName = req.body.imageName || path.basename(req.file.originalname, ext);

    res.json({
      success: true,
      imageName: imageName,
      filename: req.file.filename,
      message: "Image uploaded successfully"
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({
      success: false,
      message: "Failed to upload image"
    });
  }
});

// Get all lessons assigned to a student (with JOIN)
router.get("/lessons", async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at
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
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Get specific lesson for a student (with JOIN)
router.get("/lessons/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at
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
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Update student's lesson progress (audio file and completion)
router.patch("/lessons/:lessonId", async (req, res) => {
  try {
    const { audio_file } = req.body;
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Update the lesson's audio file (if provided)
    if (audio_file) {
      await db.query(
        `UPDATE lessons SET audio_file = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [audio_file, lessonId]
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
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create new lesson content (teacher only)
router.post("/lessons", async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teachers only",
    });
  }

  try {
    const {
      title,
      image,
      videoId,
      lessonStartTime,
      lessonEndTime,
      audioFile,
    } = req.body;

    // Create new lesson content
    const result = await db.query(
      `INSERT INTO lessons (title, image, video_id, lesson_start_time, lesson_end_time, audio_file)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        title,
        image,
        videoId,
        lessonStartTime,
        lessonEndTime,
        audioFile || "",
      ]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Assign lesson to students (teacher only)
router.post("/lessons/:lessonId/assign", async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teachers only",
    });
  }

  try {
    const { lessonId } = req.params;
    const { studentIds } = req.body; // Array of student IDs
    const teacherId = req.user.id;

    // Check if lesson exists
    const lesson = await db.query(
      "SELECT id FROM lessons WHERE id = $1",
      [lessonId]
    );

    if (lesson.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const lessonDbId = lesson.rows[0].id;
    const assignments = [];

    // Create assignments for each student
    for (const studentId of studentIds) {
      try {
        const result = await db.query(
          `INSERT INTO assignments (student_id, lesson_id, assigned_by)
           VALUES ($1, $2, $3)
           RETURNING *`,
          [studentId, lessonDbId, teacherId]
        );
        assignments.push(result.rows[0]);
      } catch (error) {
        // Skip if assignment already exists (unique constraint)
        if (error.code !== "23505") {
          throw error;
        }
      }
    }

    res.status(201).json({
      success: true,
      message: `Lesson assigned to ${assignments.length} students`,
      data: assignments,
    });
  } catch (error) {
    console.error("Error assigning lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//Get all users
router.get("/users", async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admins only",
    });
  }
  try {
    const result = await db.query(
      "SELECT id, username, role FROM users WHERE role = 'student'"
    );

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

// Create new student (teacher only)
router.post("/users", async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teachers only",
    });
  }

  try {
    const { createNewUser } = await import("./handlers/user.js");

    req.body.role = "student";
    await createNewUser(req, res);
  } catch (error) {
    console.error("Error creating student:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//get all lessons (for teacher dashboard)
router.get("/all-lessons", async (req, res) => {
  if (req.user.role !== "teacher") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Teachers only",
    });
  }
  try {
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
  } catch (error) {
    console.error("Error fetching all lessons:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
