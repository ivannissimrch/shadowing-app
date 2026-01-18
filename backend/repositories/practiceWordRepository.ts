import { QueryResult } from "pg";
import { db } from "../server.js";
import { PracticeWord } from "../types.js";

export const practiceWordRepository = {
  // Get all practice words for a student
  findByStudentId: async (studentId: string) => {
    const result: QueryResult<PracticeWord> = await db.query(
      `SELECT * FROM practice_words WHERE student_id = $1 ORDER BY created_at DESC`,
      [studentId]
    );
    return result.rows;
  },

  // Add a new word
  create: async (studentId: string, word: string) => {
    const result: QueryResult<PracticeWord> = await db.query(
      `INSERT INTO practice_words (student_id, word)
       VALUES ($1, $2)
       RETURNING *`,
      [studentId, word]
    );
    return result.rows[0];
  },

  // Delete a word (only if it belongs to that student)
  delete: async (studentId: string, wordId: string) => {
    const result = await db.query(
      `DELETE FROM practice_words WHERE id = $1 AND student_id = $2 RETURNING id`,
      [wordId, studentId]
    );
    return result.rowCount && result.rowCount > 0;
  },

  // Check if word already exists for this student (case-insensitive)
  exists: async (studentId: string, word: string) => {
    const result = await db.query(
      `SELECT id FROM practice_words WHERE student_id = $1 AND LOWER(word) = LOWER($2)`,
      [studentId, word]
    );
    return result.rows.length > 0;
  },
};
