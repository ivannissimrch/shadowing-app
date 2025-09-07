import { db } from "../server.js"; // Import the database connection from server.js
import { comparePasswords, createJWT, hashPassword } from "../auth.js";

export const createNewUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUserResult = await db.query(
      "SELECT id FROM users WHERE username = $1",
      [req.body.username]
    );

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(req.body.password);

    // Create new user
    const result = await db.query(
      `INSERT INTO users (username, password, name, email)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, name, email, created_at`,
      [
        req.body.username,
        hashedPassword,
        req.body.name || req.body.username,
        req.body.email || "",
      ]
    );

    const newUser = result.rows[0];

    // Create token (exclude password from user object)
    const userForToken = {
      id: newUser.id,
      username: newUser.username,
      name: newUser.name,
    };
    const token = createJWT(userForToken);

    res.json({
      success: true,
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        name: newUser.name,
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const signin = async (req, res) => {
  try {
    // Find user by username
    const result = await db.query(
      "SELECT id, username, name, password FROM users WHERE username = $1",
      [req.body.username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = result.rows[0];

    // Compare passwords
    const isValid = await comparePasswords(req.body.password, user.password);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token (exclude password from user object)
    const userForToken = {
      id: user.id,
      username: user.username,
      name: user.name,
    };
    const token = createJWT(userForToken);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error during signin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
