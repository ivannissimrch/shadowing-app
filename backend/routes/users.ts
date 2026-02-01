import { NextFunction, Router, Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { comparePasswords, hashPassword } from "../auth.js";
import { requireTeacher } from "../middleware/auth.js";
import { userRepository } from "../repositories/userRepository.js";

const router = Router();

//Get all users
router.get(
  "/",
  requireTeacher,
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const students = await userRepository.findAllStudents();
    res.json({
      success: true,
      data: students,
    });
  })
);

// Get own user profile
router.get(
  "/:userId",
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;
    const requestingUserId = req.user?.id;

    // Security: Users can only get their OWN profile
    if (requestingUserId !== userId) {
      throw createError(403, "Forbidden: You can only view your own profile");
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      data: user,
    });
  })
);

// Create new student (teacher only)
router.post(
  "/",
  requireTeacher,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { createNewUser } = await import("../handlers/user.js");
    req.body.role = "student";
    await createNewUser(req, res);
  })
);

// Delete student (teacher only)
router.delete(
  "/:userId",
  requireTeacher,
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;

    // Check if user exists and is a student
    const user = await userRepository.checkExists(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    if (user.role !== "student") {
      throw createError(403, "Cannot delete non-student users");
    }

    // Delete the user (CASCADE will delete related assignments)
    await userRepository.delete(userId);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  })
);

// Change own password (students and teachers)
router.patch(
  "/:userId/password",
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;
    const { currentPassword, newPassword } = req.body;
    const requestingUserId = req.user?.id;

    // 1. Security: Users can only change their OWN password
    if (requestingUserId !== userId) {
      throw createError(
        403,
        "Forbidden: You can only change your own password"
      );
    }

    // 2. Validation: Check required fields
    if (!currentPassword || !newPassword) {
      throw createError(400, "Current password and new password are required");
    }

    // 3. Validation: Check password length
    if (newPassword.length < 8) {
      throw createError(400, "New password must be at least 8 characters");
    }

    // 4. Validation: New password must be different
    if (currentPassword === newPassword) {
      throw createError(
        400,
        "New password must be different from current password"
      );
    }

    // 5. Get user from database
    const user = await userRepository.findByIdWithPassword(userId);

    if (!user) {
      throw createError(404, "User not found");
    }

    // 6. Verify current password is correct
    const isValid = await comparePasswords(currentPassword, user.password);

    if (!isValid) {
      throw createError(401, "Current password is incorrect");
    }

    // 7. Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // 8. Update password in database
    await userRepository.updatePassword(userId, hashedPassword);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  })
);

// Update own email (for notifications)
router.patch(
  "/:userId/email",
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;
    const { email } = req.body;
    const requestingUserId = req.user?.id;

    // Security: Users can only update their OWN email
    if (requestingUserId !== userId) {
      throw createError(403, "Forbidden: You can only update your own email");
    }

    if (!email) {
      throw createError(400, "Email is required");
    }

    const user = await userRepository.updateEmail(userId, email);

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      message: "Email updated successfully",
      data: user,
    });
  })
);

// Update own native language (for ESL Coach personalization)
router.patch(
  "/:userId/native-language",
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { userId } = req.params;
    const { nativeLanguage } = req.body;
    const requestingUserId = req.user?.id;

    // Security: Users can only update their OWN native language
    if (requestingUserId !== userId) {
      throw createError(403, "Forbidden: You can only update your own profile");
    }

    const user = await userRepository.updateNativeLanguage(
      userId,
      nativeLanguage || null
    );

    if (!user) {
      throw createError(404, "User not found");
    }

    res.json({
      success: true,
      message: "Native language updated successfully",
      data: user,
    });
  })
);

export default router;
