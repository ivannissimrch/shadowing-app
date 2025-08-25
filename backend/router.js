import { Router } from "express";
import { db } from "./server.js";

const router = Router();

// Get all lessons for a user
router.get("/lessons", (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.data.users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user.lessons,
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//Get specific user lesson
router.get("/lessons/:lessonId", (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.id;
    const user = db.data.users.find((user) => user.id === userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const lesson = user.lessons.find((lesson) => lesson.lessonId === lessonId);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("Error fetching lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//Update specific user lesson
router.patch("/lessons/:lessonId", async (req, res) => {
  try {
    const { audioFile } = req.body;
    const { lessonId } = req.params;
    const userId = req.user.id;

    const user = db.data.users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const lesson = user.lessons.find((lesson) => lesson.lessonId === lessonId);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Update the lesson
    lesson.audioFile = audioFile;
    lesson.status = "completed";
    await db.write();

    res.json({
      success: true,
      data: lesson,
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

//Add new lesson to user
router.post("/lessons", async (req, res) => {
  try {
    const userId = req.user.id;
    const { lessonId, audioFile, title, image, videoId } = req.body;

    const user = db.data.users.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the lesson already exists
    const existingLesson = user.lessons.find(
      (lesson) => lesson.lessonId === lessonId
    );

    if (existingLesson) {
      return res.status(400).json({
        success: false,
        message: "Lesson already exists",
      });
    }

    // Add new lesson
    const newLesson = {
      lessonId,
      title,
      image,
      videoId,
      audioFile: audioFile || "",
      status: "new",
    };

    user.lessons.push(newLesson);
    await db.write();

    res.status(201).json({
      success: true,
      data: newLesson,
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
