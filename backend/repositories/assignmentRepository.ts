import { QueryResult } from "pg";
import { db } from "../server.js";
import {
  Assignment,
  CreateAssignmentBody,
  AssignmentWithLesson,
  StudentProgressWithLessons,
  StudentLessonSummary,
} from "../types.js";

export const assignmentRepository = {
  create: async (assignment: CreateAssignmentBody) => {
    const { studentId, lessonId, assignedBy } = assignment;
    const result: QueryResult<Assignment> = await db.query(
      `INSERT INTO assignments (student_id, lesson_id, assigned_by, status)
       VALUES ($1, $2, $3, 'new')
       RETURNING *`,
      [studentId, lessonId, assignedBy]
    );
    return result.rows[0];
  },

  updateAudioFile: async (
    studentId: string,
    lessonId: string,
    audioFile: string
  ) => {
    await db.query(
      `UPDATE assignments
       SET audio_file = $1, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $2 AND lesson_id = $3`,
      [audioFile, studentId, lessonId]
    );
  },

  // Called when student submits recording - goes to teacher review
  markSubmitted: async (studentId: string, lessonId: string) => {
    const result: QueryResult<Assignment> = await db.query(
      `UPDATE assignments
       SET status = 'submitted', updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $1 AND lesson_id = $2
       RETURNING *`,
      [studentId, lessonId]
    );
    return result.rows[0];
  },

  resetSubmission: async (studentId: string, lessonId: string) => {
    const result: QueryResult<Assignment> = await db.query(
      `UPDATE assignments
       SET status = 'new', audio_file = NULL, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $1 AND lesson_id = $2 AND status = 'submitted'
       RETURNING *`,
      [studentId, lessonId]
    );
    return result.rows[0];
  },

  // Called when teacher marks lesson as completed after review
  markCompleted: async (studentId: string, lessonId: string) => {
    const result: QueryResult<Assignment> = await db.query(
      `UPDATE assignments
       SET status = 'completed', completed = true, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $1 AND lesson_id = $2
       RETURNING *`,
      [studentId, lessonId]
    );
    return result.rows[0];
  },

  exists: async (studentId: string, lessonId: string) => {
    const result = await db.query(
      `SELECT id FROM assignments WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
    return result.rows.length > 0;
  },

  findByStudentAndLesson: async (studentId: string, lessonId: string) => {
    const result: QueryResult<Assignment> = await db.query(
      `SELECT * FROM assignments WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
    return result.rows[0];
  },

  delete: async (studentId: string, lessonId: string) => {
    await db.query(
      `DELETE FROM assignments WHERE student_id = $1 AND lesson_id = $2`,
      [studentId, lessonId]
    );
  },

  addFeedback: async (
    studentId: string,
    lessonId: string,
    feedback: string
  ) => {
    const result: QueryResult<Assignment> = await db.query(
      `UPDATE assignments
       SET feedback = $1, updated_at = CURRENT_TIMESTAMP
       WHERE student_id = $2 AND lesson_id = $3
       RETURNING *`,
      [feedback, studentId, lessonId]
    );
    return result.rows[0];
  },

  findByStudentId: async (studentId: string) => {
    const result: QueryResult<AssignmentWithLesson> = await db.query(
      `SELECT a.*, l.title as lesson_title, l.image as lesson_image
       FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       WHERE a.student_id = $1
       ORDER BY a.assigned_at DESC`,
      [studentId]
    );
    return result.rows;
  },

  findOne: async (studentId: string, lessonId: string) => {
    const result: QueryResult<AssignmentWithLesson> = await db.query(
      `SELECT a.*, l.title as lesson_title, l.image as lesson_image, l.video_id, l.lesson_start_time, l.lesson_end_time
       FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       WHERE a.student_id = $1 AND a.lesson_id = $2`,
      [studentId, lessonId]
    );
    return result.rows[0] || null;
  },

  // Dashboard stats methods
  countPendingReview: async () => {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM assignments
       WHERE status = 'submitted'`
    );
    return parseInt(result.rows[0].count, 10);
  },

  countCompletedThisWeek: async () => {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM assignments
       WHERE completed = true
       AND completed_at >= NOW() - INTERVAL '7 days'`
    );
    return parseInt(result.rows[0].count, 10);
  },

  // Get all assignments pending teacher review
  getPendingReviews: async () => {
    const result = await db.query(
      `SELECT
         a.id as assignment_id,
         a.student_id,
         a.lesson_id,
         a.audio_file,
         a.updated_at as submitted_at,
         u.username as student_name,
         u.email as student_email,
         l.title as lesson_title,
         l.category as lesson_category
       FROM assignments a
       JOIN users u ON a.student_id = u.id
       JOIN lessons l ON a.lesson_id = l.id
       WHERE a.status = 'submitted'
       ORDER BY a.updated_at DESC`
    );
    return result.rows;
  },

  getStudentProgress: async () => {
    const result = await db.query(
      `SELECT
         u.id,
         u.username,
         COUNT(a.id) as total_lessons,
         COUNT(CASE WHEN a.completed = true THEN 1 END) as completed_lessons
       FROM users u
       LEFT JOIN assignments a ON u.id = a.student_id
       WHERE u.role = 'student'
       GROUP BY u.id, u.username
       ORDER BY
         CASE WHEN COUNT(a.id) > 0
           THEN COUNT(CASE WHEN a.completed = true THEN 1 END)::float / COUNT(a.id)::float
           ELSE 0
         END DESC,
         u.username ASC
       LIMIT 10`
    );
    return result.rows.map((row) => ({
      id: row.id,
      username: row.username,
      totalLessons: parseInt(row.total_lessons, 10),
      completedLessons: parseInt(row.completed_lessons, 10),
    }));
  },

  getStudentsWithLessons: async (): Promise<StudentProgressWithLessons[]> => {
    // Query 1: students with counts
    const progressResult = await db.query(
      `SELECT
         u.id,
         u.username,
         COUNT(a.id) as total_lessons,
         COUNT(CASE WHEN a.completed = true THEN 1 END) as completed_lessons
       FROM users u
       LEFT JOIN assignments a ON u.id = a.student_id
       WHERE u.role = 'student'
       GROUP BY u.id, u.username
       ORDER BY u.username ASC`
    );

    // Query 2: all assignments with lesson info
    const lessonsResult = await db.query(
      `SELECT
         a.student_id,
         a.lesson_id,
         l.title as lesson_title,
         a.status
       FROM assignments a
       JOIN lessons l ON a.lesson_id = l.id
       ORDER BY a.assigned_at DESC`
    );

    // Group lessons by student_id
    const lessonsByStudent = new Map<string, StudentLessonSummary[]>();
    for (const row of lessonsResult.rows) {
      const lessons = lessonsByStudent.get(row.student_id) || [];
      lessons.push({
        lesson_id: row.lesson_id,
        lesson_title: row.lesson_title,
        status: row.status,
      });
      lessonsByStudent.set(row.student_id, lessons);
    }

    return progressResult.rows.map((row) => ({
      id: row.id,
      username: row.username,
      totalLessons: parseInt(row.total_lessons, 10),
      completedLessons: parseInt(row.completed_lessons, 10),
      lessons: lessonsByStudent.get(row.id) || [],
    }));
  },

  bulkAssignFromList: async (
    studentId: string,
    listId: string,
    assignedBy: string
  ) => {
    const result = await db.query(
      `INSERT INTO assignments (student_id, lesson_id, assigned_by, status, list_id)
       SELECT $1, ll.lesson_id, $2, 'new', $3
       FROM list_lessons ll WHERE ll.list_id = $3
       ON CONFLICT (student_id, lesson_id) DO NOTHING`,
      [studentId, assignedBy, listId]
    );
    return result.rowCount || 0;
  },
};
