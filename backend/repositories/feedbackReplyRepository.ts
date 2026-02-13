import { QueryResult } from "pg";
import { db } from "../server.js";
import { FeedbackReply } from "../types.js";

export const feedbackReplyRepository = {
  create: async (assignmentId: string, userId: string, content: string) => {
    const result: QueryResult<FeedbackReply> = await db.query(
      `INSERT INTO feedback_replies (assignment_id, user_id, content)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [assignmentId, userId, content]
    );
    return result.rows[0];
  },

  findByAssignment: async (assignmentId: string) => {
    const result: QueryResult<FeedbackReply> = await db.query(
      `SELECT fr.*, u.username, u.role
       FROM feedback_replies fr
       JOIN users u ON fr.user_id = u.id
       WHERE fr.assignment_id = $1
       ORDER BY fr.created_at ASC`,
      [assignmentId]
    );
    return result.rows;
  },

  findById: async (replyId: string) => {
    const result: QueryResult<FeedbackReply> = await db.query(
      `SELECT fr.*, u.username, u.role
       FROM feedback_replies fr
       JOIN users u ON fr.user_id = u.id
       WHERE fr.id = $1`,
      [replyId]
    );
    return result.rows[0] || null;
  },

  update: async (replyId: string, content: string) => {
    const result: QueryResult<FeedbackReply> = await db.query(
      `UPDATE feedback_replies SET content = $1
       WHERE id = $2
       RETURNING *`,
      [content, replyId]
    );
    return result.rows[0];
  },

  delete: async (replyId: string) => {
    await db.query(`DELETE FROM feedback_replies WHERE id = $1`, [replyId]);
  },
};
