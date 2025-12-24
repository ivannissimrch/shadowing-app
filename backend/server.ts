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

app.get("/", (_req: Request, res: Response) => {
  res.json({
    status: "OK",
    message: "ESL Shadowing API server is running",
    timestamp: new Date().toISOString(),
  });
});
app.use("/api/upload-image", uploadLimiter);
app.use("/api/upload-audio", uploadLimiter);
app.use("/api", apiLimiter, protect, router);
app.post("/signin", authLimiter, signin);

app.use(handleError);

export default app;
export { pool as db };
