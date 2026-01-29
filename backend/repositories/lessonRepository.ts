import { QueryResult } from "pg";
import { db } from "../server.js";
import {
  Lesson,
  CreateLessonBody,
  LessonWithAssignment,
  LessonWithStats,
} from "../types.js";

export const lessonRepository = {
  findByStudentId: async (studentId: string) => {
    const result: QueryResult<LessonWithAssignment> = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at, a.audio_file
       FROM lessons l
       JOIN assignments a ON l.id = a.lesson_id
       WHERE a.student_id = $1
       ORDER BY a.assigned_at DESC`,
      [studentId]
    );
    return result.rows;
  },

  findOneForStudent: async (studentId: string, lessonId: string) => {
    const result: QueryResult<LessonWithAssignment> = await db.query(
      `SELECT l.*, a.status, a.completed, a.assigned_at, a.completed_at, a.audio_file, a.feedback
       FROM lessons l
       JOIN assignments a ON l.id = a.lesson_id
       WHERE a.student_id = $1 AND l.id = $2`,
      [studentId, lessonId]
    );
    return result.rows[0] || null;
  },

  create: async (lesson: CreateLessonBody) => {
    const {
      title,
      image,
      scriptText,
      scriptType = 'image',
      videoId,
      videoType = 'youtube',
      cloudinaryPublicId,
      cloudinaryUrl,
      lessonStartTime,
      lessonEndTime,
    } = lesson;
    const result: QueryResult<Lesson> = await db.query(
      `INSERT INTO lessons (title, image, script_text, script_type, video_id, video_type, cloudinary_public_id, cloudinary_url, lesson_start_time, lesson_end_time)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [title, image, scriptText, scriptType, videoId, videoType, cloudinaryPublicId, cloudinaryUrl, lessonStartTime, lessonEndTime]
    );
    return result.rows[0];
  },

  exists: async (lessonId: string) => {
    const result: QueryResult<Lesson> = await db.query(
      "SELECT id FROM lessons WHERE id = $1",
      [lessonId]
    );
    return result.rows.length > 0;
  },

  delete: async (lessonId: string) => {
    await db.query("DELETE FROM lessons WHERE id = $1", [lessonId]);
  },

  findAll: async () => {
    const result: QueryResult<LessonWithStats> = await db.query(`
      SELECT
        l.*,
        COUNT(a.id) as assignment_count,
        COUNT(CASE WHEN a.completed = true THEN 1 END) as completed_count
      FROM lessons l
      LEFT JOIN assignments a ON l.id = a.lesson_id
      GROUP BY l.id, l.title, l.image, l.script_text, l.script_type, l.video_id, l.video_type, l.cloudinary_public_id, l.cloudinary_url, l.lesson_start_time, l.lesson_end_time, l.created_at, l.updated_at
      ORDER BY l.created_at DESC
    `);
    return result.rows;
  },

  findById: async (lessonId: string) => {
    const result: QueryResult<Lesson> = await db.query(
      "SELECT * FROM lessons WHERE id = $1",
      [lessonId]
    );
    return result.rows[0] || null;
  },
};
