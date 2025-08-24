import { db } from "../server.js";
import { comparePasswords, createJWT, hashPassword } from "../auth.js";
import { v4 as uuidv4 } from "uuid";

export const createNewUser = async (req, res) => {
  try {
    // Check if user already exists
    const existingUser = db.data.users.find(
      (u) => u.username === req.body.username
    );
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user
    const newUser = {
      id: uuidv4(), // Generate unique ID
      username: req.body.username,
      password: await hashPassword(req.body.password),
      name: req.body.name || req.body.username,
      lessons: [],
      createdAt: new Date().toISOString(),
    };

    // Add user to database
    db.data.users.push(newUser);

    // Save to file
    await db.write();

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
    const user = db.data.users.find((u) => u.username === req.body.username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

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
