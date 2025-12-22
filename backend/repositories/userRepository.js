import { db } from "../server.js";

export const userRepository = {
  findAllStudents: async () => {
    const result = await db.query(
      "SELECT id, username, role FROM users WHERE role = 'student'"
    );
    return result.rows;
  },

  findById: async (userId) => {
    const result = await db.query(
      "SELECT id, username, role FROM users WHERE id = $1",
      [userId]
    );
    return result.rows[0] || null;
  },

  findByIdWithPassword: async (userId) => {
    const result = await db.query(
      "SELECT id, password FROM users WHERE id = $1",
      [userId]
    );
    return result.rows[0] || null;
  },

  findByUsername: async (username) => {
    const result = await db.query(
      "SELECT id, username, password, role FROM users WHERE username = $1",
      [username]
    );
    return result.rows[0] || null;
  },

  create: async (user) => {
    const { username, password, role } = user;
    const result = await db.query(
      "INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, username, role",
      [username, password, role]
    );
    return result.rows[0];
  },

  checkExists: async (userId) => {
    const result = await db.query("SELECT id, role FROM users WHERE id = $1", [
      userId,
    ]);
    return result.rows[0] || null;
  },

  delete: async (userId) => {
    await db.query("DELETE FROM users WHERE id = $1", [userId]);
  },

  updatePassword: async (userId, hashedPassword) => {
    await db.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      userId,
    ]);
  },

  usernameExists: async (username) => {
    const result = await db.query("SELECT id FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows.length > 0;
  },

  findStudentById: async (studentId) => {
    const result = await db.query(
      "SELECT id, username, role, created_at FROM users WHERE id = $1 AND role = 'student'",
      [studentId]
    );
    return result.rows[0] || null;
  },
};
