import { QueryResult } from "pg";
import { db } from "../server.js";
import {
  List,
  ListWithLessonCount,
  ListWithLessons,
  Lesson,
  CreateListBody,
  UpdateListBody,
} from "../types.js";

export const listRepository = {
  findByTeacherId: async (teacherId: string) => {
    const result: QueryResult<ListWithLessonCount> = await db.query(
      `SELECT l.*, COUNT(ll.lesson_id)::int as lesson_count
       FROM lists l
       LEFT JOIN list_lessons ll ON l.id = ll.list_id
       WHERE l.teacher_id = $1
       GROUP BY l.id
       ORDER BY l.created_at DESC`,
      [teacherId]
    );
    return result.rows;
  },

  findById: async (listId: string) => {
    const result: QueryResult<List> = await db.query(
      "SELECT * FROM lists WHERE id = $1",
      [listId]
    );
    return result.rows[0] || null;
  },

  findByIdWithLessons: async (listId: string) => {
    // First get the list
    const listResult: QueryResult<List> = await db.query(
      "SELECT * FROM lists WHERE id = $1",
      [listId]
    );

    if (listResult.rows.length === 0) {
      return null;
    }

    const list = listResult.rows[0];

    // Then get the lessons in this list
    const lessonsResult: QueryResult<Lesson> = await db.query(
      `SELECT l.*
       FROM lessons l
       JOIN list_lessons ll ON l.id = ll.lesson_id
       WHERE ll.list_id = $1
       ORDER BY ll.position ASC, ll.added_at DESC`,
      [listId]
    );

    const listWithLessons: ListWithLessons = {
      ...list,
      lessons: lessonsResult.rows,
    };

    return listWithLessons;
  },

  create: async (teacherId: string, data: CreateListBody) => {
    const { name, description } = data;
    const result: QueryResult<List> = await db.query(
      `INSERT INTO lists (teacher_id, name, description)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [teacherId, name, description || null]
    );
    return result.rows[0];
  },

  update: async (listId: string, data: UpdateListBody) => {
    const { name, description } = data;
    const result: QueryResult<List> = await db.query(
      `UPDATE lists
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [name, description, listId]
    );
    return result.rows[0] || null;
  },

  delete: async (listId: string) => {
    await db.query("DELETE FROM lists WHERE id = $1", [listId]);
  },

  addLessons: async (listId: string, lessonIds: string[]) => {
    if (lessonIds.length === 0) return;

    // Get current max position
    const maxResult = await db.query(
      `SELECT COALESCE(MAX(position), -1) as max_pos FROM list_lessons WHERE list_id = $1`,
      [listId]
    );
    let nextPos = parseInt(maxResult.rows[0].max_pos, 10) + 1;

    // Build a query to insert multiple rows with incrementing positions
    const values = lessonIds
      .map((_, i) => `($1, $${i + 2}, ${nextPos + i})`)
      .join(", ");

    await db.query(
      `INSERT INTO list_lessons (list_id, lesson_id, position)
       VALUES ${values}
       ON CONFLICT (list_id, lesson_id) DO NOTHING`,
      [listId, ...lessonIds]
    );
  },

  removeLesson: async (listId: string, lessonId: string) => {
    await db.query(
      "DELETE FROM list_lessons WHERE list_id = $1 AND lesson_id = $2",
      [listId, lessonId]
    );
  },

  exists: async (listId: string) => {
    const result = await db.query(
      "SELECT id FROM lists WHERE id = $1",
      [listId]
    );
    return result.rows.length > 0;
  },

  isOwnedByTeacher: async (listId: string, teacherId: string) => {
    const result = await db.query(
      "SELECT id FROM lists WHERE id = $1 AND teacher_id = $2",
      [listId, teacherId]
    );
    return result.rows.length > 0;
  },
};
