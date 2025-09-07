import express from "express";
import cors from "cors";
import router from "./router.js";
import { protect } from "./auth.js";
import { signin } from "./handlers/user.js";
import pool from "./db.js";
const app = express();

// Initialize database tables if they do not already exist
const initDatabase = async () => {
  try {
    // Check if tables exist, if not create them
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        lesson_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        video_id VARCHAR(255),
        audio_file TEXT,
        status VARCHAR(50) DEFAULT 'new',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, lesson_id)
      );
    `);

    console.log("Database tables initialized");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

// Initialize database on startup
initDatabase();

// Middleware
app.use(
  cors({
    origin: [
      "https://shadowing-app-spec.vercel.app",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "ESL Shadowing API server is running",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api", protect, router);
app.post("/signin", signin);

export default app;
export { pool as db };
