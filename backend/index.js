import { JSONFilePreset } from "lowdb/node";
import express from "express";
import cors from "cors";

// Read or create db.json
const db = await JSONFilePreset("db.json", { users: [] });

const app = express();
const PORT = process.env.PORT || 3001; // Different port from Next.js (3000)

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//User lessons data
const lessonsIvan = [
  {
    title: "Suits week 110",
    image: "110",
    videoId: "ImEnWAVRLU0",
    lessonId: "110",
    status: "completed",
    audioFile: "",
  },
  {
    title: "Suits week 111",
    image: "111",
    videoId: "jjeLzr1JR4o",
    lessonId: "111",
    status: "completed",
    audioFile: "",
  },
  {
    title: "Suits week 112",
    image: "112",
    videoId: "jjeLzr1JR4o",
    lessonId: "112",
    status: "new",
    audioFile: "",
  },
];

const lessonsLeo = [
  {
    title: "Suits week 110",
    image: "110",
    videoId: "ImEnWAVRLU0",
    lessonId: "110",
    status: "new",
    audioFile: "",
  },
];

const lessonsPapo = [
  {
    title: "Suits week 110",
    image: "110",
    videoId: "ImEnWAVRLU0",
    lessonId: "110",
    status: "new",
    audioFile: "",
  },
];

const users = [
  { name: "Ivan", email: "", lessons: lessonsIvan },
  { name: "Leo", email: "", lessons: lessonsLeo },
  { name: "Papo", email: "", lessons: lessonsPapo },
];

if (!db.data.users) {
  db.data.users = [];
}

if (db.data.users.length === 0) {
  db.data.users = users;
  await db.write();
}

// API Routes
//get all users
app.get("/api/users", (req, res) => {
  res.json({
    success: true,
    data: db.data.users,
  });
});

// Get specific user
app.get("/api/users/:name", (req, res) => {
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
app.get("/api/users/:name/lessons/:lessonId", (req, res) => {
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
app.patch("/api/users/:name/lessons/:lessonId", async (req, res) => {
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

// Start
app.listen(PORT, () => {
  console.log(`ESL Shadowing API server running on port ${PORT}`);
});
