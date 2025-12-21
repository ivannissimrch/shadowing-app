import { Router } from "express";
import { db } from "../server.js";
import asyncHandler from "../handlers/asyncHandler.js";

const router = Router();

// Get all lessons assigned to a student (with JOIN)
router.get(
  "/",
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
  "/:lessonId",
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
  "/:lessonId",
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

export default router;