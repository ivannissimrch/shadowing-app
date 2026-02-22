import { QueryResult } from "pg";
import { db } from "../server.js";
import { AudioSegment, CreateSegmentInput } from "../types.js";

export const segmentRepository = {
  // Get all segments for a lesson, ordered by position
  findByLessonId: async (lessonId: string) => {
    const result: QueryResult<AudioSegment> = await db.query(
      `SELECT * FROM audio_segments
       WHERE lesson_id = $1
       ORDER BY position ASC`,
      [lessonId]
    );
    return result.rows;
  },

  // Batch create segments for a lesson (replaces all existing)
  batchCreate: async (lessonId: string, segments: CreateSegmentInput[]) => {
    // Delete existing segments for this lesson first
    await db.query(
      `DELETE FROM audio_segments WHERE lesson_id = $1`,
      [lessonId]
    );

    if (segments.length === 0) return [];

    // Build a single INSERT with multiple value rows
    // Each row needs 5 params: label, start_time, end_time, position, lesson_id
    const values: unknown[] = [];
    const placeholders: string[] = [];

    segments.forEach((seg, i) => {
      const offset = i * 5;
      placeholders.push(
        `($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`
      );
      values.push(seg.label, seg.start_time, seg.end_time, seg.position, lessonId);
    });

    const result: QueryResult<AudioSegment> = await db.query(
      `INSERT INTO audio_segments (label, start_time, end_time, position, lesson_id)
       VALUES ${placeholders.join(", ")}
       RETURNING *`,
      values
    );

    return result.rows;
  },

  // Update a single segment
  update: async (
    segmentId: string,
    lessonId: string,
    updates: Partial<CreateSegmentInput>
  ) => {
    const result: QueryResult<AudioSegment> = await db.query(
      `UPDATE audio_segments
       SET label = COALESCE($1, label),
           start_time = COALESCE($2, start_time),
           end_time = COALESCE($3, end_time),
           position = COALESCE($4, position)
       WHERE id = $5 AND lesson_id = $6
       RETURNING *`,
      [
        updates.label,
        updates.start_time,
        updates.end_time,
        updates.position,
        segmentId,
        lessonId,
      ]
    );
    return result.rows[0] || null;
  },

  // Delete a single segment
  delete: async (segmentId: string, lessonId: string) => {
    const result = await db.query(
      `DELETE FROM audio_segments WHERE id = $1 AND lesson_id = $2 RETURNING id`,
      [segmentId, lessonId]
    );
    return result.rowCount && result.rowCount > 0;
  },
};
