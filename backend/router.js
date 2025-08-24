import { Router } from "express";
import { db } from "./server.js";

const router = Router();

// API Routes
//get all users
router.get("/users", (req, res) => {
  res.json({
    success: true,
    data: db.data.users,
  });
});

// Get specific user
router.get("/users/:name", (req, res) => {
  console.log(req);
  const { name } = req.params;
  const user = db.data.users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

//Get specific user lesson
router.get("/users/:name/lessons/:lessonId", (req, res) => {
  const { name, lessonId } = req.params;
  const user = db.data.users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );

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
});

//patch specific user lesson
router.patch("/users/:name/lessons/:lessonId", async (req, res) => {
  const { name, lessonId } = req.params;
  const { audioFile } = req.body;
  const user = db.data.users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );

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
});

//Add new lesson to user
router.post("/users/:name/lessons", async (req, res) => {
  const { name } = req.params;
  const { lessonId, audioFile } = req.body;
  const user = db.data.users.find(
    (user) => user.name.toLowerCase() === name.toLowerCase()
  );

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
    audioFile,
    status: "new",
  };
  user.lessons.push(newLesson);
  await db.write();

  res.status(201).json({
    success: true,
    data: newLesson,
  });
});

export default router;
