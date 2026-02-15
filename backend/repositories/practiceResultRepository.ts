import { QueryResult } from "pg";
import { db } from "../server.js";
import { PracticeResult } from "../types.js";

export const practiceResultRepository = {
  // Save an evaluation result for a practice word
  create: async (
    practiceWordId: number,
    scores: {
      accuracyScore: number;
      fluencyScore: number;
      completenessScore: number;
      pronunciationScore: number;
    },
    wordsBreakdown: unknown
  ) => {
    const result: QueryResult<PracticeResult> = await db.query(
      `INSERT INTO practice_results
         (practice_word_id, accuracy_score, fluency_score, completeness_score, pronunciation_score, words_breakdown)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        practiceWordId,
        scores.accuracyScore,
        scores.fluencyScore,
        scores.completenessScore,
        scores.pronunciationScore,
        JSON.stringify(wordsBreakdown),
      ]
    );
    return result.rows[0];
  },

  // Get the latest result for a single practice word
  findLatestByWordId: async (practiceWordId: number) => {
    const result: QueryResult<PracticeResult> = await db.query(
      `SELECT * FROM practice_results
       WHERE practice_word_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [practiceWordId]
    );
    return result.rows[0] || null;
  },

  // Get the latest result per word for a student (one query using DISTINCT ON)
  findLatestByStudentId: async (studentId: string) => {
    const result: QueryResult<PracticeResult> = await db.query(
      `SELECT DISTINCT ON (pr.practice_word_id)
         pr.*
       FROM practice_results pr
       JOIN practice_words pw ON pw.id = pr.practice_word_id
       WHERE pw.student_id = $1
       ORDER BY pr.practice_word_id, pr.created_at DESC`,
      [studentId]
    );
    return result.rows;
  },
};
