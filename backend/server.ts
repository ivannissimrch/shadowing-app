import express, { Request, Response } from "express";
import cors from "cors";
import router from "./router.js";
import {
  apiLimiter,
  authLimiter,
  uploadLimiter,
} from "./middleware/rateLimiter.js";
import { protect } from "./auth.js";
import { signin } from "./handlers/user.js";
import pool from "./db.js";
import handleError from "./handlers/handleError.js";
import logger from "./helpers/logger.js";
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
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),   
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255),
        video_id VARCHAR(255),
        lesson_start_time INTEGER,
        lesson_end_time INTEGER,        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        student_id UUID REFERENCES users(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
        completed BOOLEAN DEFAULT FALSE,
        status VARCHAR(50) DEFAULT 'new',
        assigned_by UUID REFERENCES users(id) ON DELETE SET NULL,
        assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        completed_at TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, lesson_id),
        audio_file TEXT,
        feedback TEXT
      );
    `);

    // Migration: Add Cloudinary video support columns to lessons table
    // These run safely - if column exists, it just skips
    const addColumnIfNotExists = async (
      table: string,
      column: string,
      definition: string,
    ) => {
      const checkColumn = await pool.query(
        `SELECT column_name FROM information_schema.columns
         WHERE table_name = $1 AND column_name = $2`,
        [table, column],
      );
      if (checkColumn.rows.length === 0) {
        await pool.query(
          `ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`,
        );
        logger.info(`Added column ${column} to ${table}`);
      }
    };

    // Add Cloudinary support columns
    await addColumnIfNotExists(
      "lessons",
      "video_type",
      "VARCHAR(20) DEFAULT 'youtube'",
    );
    await addColumnIfNotExists(
      "lessons",
      "cloudinary_public_id",
      "VARCHAR(255)",
    );
    await addColumnIfNotExists("lessons", "cloudinary_url", "TEXT");

    // Add script text support columns
    await addColumnIfNotExists("lessons", "script_text", "TEXT");
    await addColumnIfNotExists(
      "lessons",
      "script_type",
      "VARCHAR(10) DEFAULT 'image'",
    );

    // Add category column for lesson organization
    await addColumnIfNotExists("lessons", "category", "VARCHAR(100)");

    // Add native_language column for ESL Coach personalization
    await addColumnIfNotExists("users", "native_language", "VARCHAR(100)");

    // Lists table for organizing lessons
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lists (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        teacher_id UUID REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Junction table for list-lesson many-to-many relationship
    await pool.query(`
      CREATE TABLE IF NOT EXISTS list_lessons (
        list_id UUID REFERENCES lists(id) ON DELETE CASCADE,
        lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (list_id, lesson_id)
      );
    `);

    // Add position column to list_lessons for ordering lessons within a course
    await addColumnIfNotExists("list_lessons", "position", "INTEGER DEFAULT 0");

    // Add list_id to assignments to track which course an assignment came from
    await addColumnIfNotExists(
      "assignments",
      "list_id",
      "UUID REFERENCES lists(id) ON DELETE SET NULL"
    );

    // Feedback replies table for conversation threads on assignments
    await pool.query(`
      CREATE TABLE IF NOT EXISTS feedback_replies (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    logger.info("Database tables initialized");
  } catch (error) {
    logger.error("Error initializing database:", error);
  }
};

initDatabase();

// Middleware
app.use(
  cors({
    origin: [
      "https://shadowing-app-spec.vercel.app",
      "https://shadowspeak.net",
      "https://www.shadowspeak.net",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "ESL Shadowing API server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/upload-image", uploadLimiter);
app.use("/api/upload-audio", uploadLimiter);
app.use("/api/upload-video", uploadLimiter);
app.use("/api", apiLimiter, protect, router);
app.post("/signin", authLimiter, signin);

app.use(handleError);

export default app;
export { pool as db };
