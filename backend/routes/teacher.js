import { Router } from "express";
import { db } from "../server.js";
import asyncHandler from "../handlers/asyncHandler.js";
import { requireTeacher } from "../middleware/auth.js";

const router = Router();

// All routes in this file require teacher role
router.use(requireTeacher);

// Create new lesson content
router.post(
  "/lessons",
  asyncHandler(async (req, res, next) => {
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

// Assign lesson to student
router.post(
  "/lessons/:lessonId/assign",
  asyncHandler(async (req, res, next) => {
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

// Unassign lesson from student
router.delete(
  "/lessons/:lessonId/unassign/:studentId",
  asyncHandler(async (req, res, next) => {
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

// Delete lesson
router.delete(
  "/lessons/:lessonId",
  asyncHandler(async (req, res, next) => {
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

//get all lessons (for teacher dashboard)
router.get(
  "/all-lessons",
  asyncHandler(async (req, res, next) => {
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
  "/student/:studentId",
  asyncHandler(async (req, res, next) => {
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
  "/student/:studentId/lessons",
  asyncHandler(async (req, res, next) => {
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
  "/student/:studentId/lesson/:lessonId",
  asyncHandler(async (req, res, next) => {
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

// Update feedback for student assignment
router.patch(
  "/student/:studentId/lesson/:lessonId/feedback",
  asyncHandler(async (req, res, next) => {
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

export default router;