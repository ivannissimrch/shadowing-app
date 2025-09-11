import { Router } from "express";
import { db } from "./server.js";

const router = Router();

// Get all lessons for a user
router.get("/lessons", async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await db.query(
      "SELECT * FROM lessons WHERE user_id = $1 ORDER BY created_at DESC",
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

// Get specific user lesson
router.get("/lessons/:lessonId", async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      "SELECT * FROM lessons WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
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

// Update specific user lesson
router.patch("/lessons/:lessonId", async (req, res) => {
  try {
    const { audio_file } = req.body;
    const { lessonId } = req.params;
    const userId = req.user.id;

    const result = await db.query(
      `UPDATE lessons 
       SET audio_file = $1, status = 'completed', updated_at = CURRENT_TIMESTAMP 
       WHERE user_id = $2 AND lesson_id = $3 
       RETURNING *`,
      [audio_file, userId, lessonId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
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

// Add new lesson to user
router.post("/lessons", async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, audioFile, title, image, videoId } = req.body;

    // Check if the lesson already exists
    const existingLesson = await db.query(
      "SELECT id FROM lessons WHERE user_id = $1 AND lesson_id = $2",
      [userId, lessonId]
    );

    if (existingLesson.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Lesson already exists",
      });
    }

    // Add new lesson
    const result = await db.query(
      `INSERT INTO lessons (user_id, lesson_id, title, image, video_id, audio_file, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'new')
       RETURNING *`,
      [userId, lessonId, title, image, videoId, audioFile || ""]
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error adding lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;
