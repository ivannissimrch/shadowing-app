import { db } from "../server.js";

export const assignmentRepository = {
  create: async (assignment) => {
    const { studentId, lessonId, assignedBy } = assignment;
    const result = await db.query(
      `INSERT INTO assignments (student_id, lesson_id, assigned_by, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [studentId, lessonId, assignedBy]
    );
    return result.rows[0];
  },

  updateAudioFile: async (studentId, lessonId, audioFile) => {
    await db.query(
      `UPDATE assignments
       SET audio_file = $1, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $2 AND lesson_id = $3`,
      [audioFile, studentId, lessonId]
    );
  },

  markCompleted: async (studentId, lessonId) => {
    const result = await db.query(
      `UPDATE assignments
       SET status = 'completed', completed = true, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $1 AND lesson_id = $2
       RETURNING *`,
      [studentId, lessonId]
    );
    return result.rows[0];
  },

  exists: async (studentId, lessonId) => {
    const result = await db.query(
      `SELECT id FROM assignments WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
    return result.rows.length > 0;
  },

  delete: async (studentId, lessonId) => {
    await db.query(
      `DELETE FROM assignments WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
  },

  addFeedback: async (studentId, lessonId, feedback) => {
    const result = await db.query(
      `UPDATE assignments
       SET feedback = $1, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $2 AND lesson_id = $3
       RETURNING *`,
      [feedback, studentId, lessonId]
    );
    return result.rows[0];
  },

  findByStudentId: async (studentId) => {
    const result = await db.query(
      `SELECT a.*, l.title as lesson_title, l.image as lesson_image
       FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       WHERE a.student_id = $1
       ORDER BY a.assigned_at DESC`,
      [studentId]
    );
    return result.rows;
  },

  findOne: async (studentId, lessonId) => {
    const result = await db.query(
      `SELECT a.*, l.title as lesson_title, l.image as lesson_image, l.video_id, l.lesson_start_time, l.lesson_end_time
       FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       WHERE a.student_id = $1 AND a.lesson_id = $2`,
      [studentId, lessonId]
    );
    return result.rows[0] || null;
  },
};
