import { Router } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { practiceWordRepository } from "../repositories/practiceWordRepository.js";
import { Request, Response } from "express";

const router = Router();

// GET /api/practice-words - Get all practice words for the logged-in student
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const words = await practiceWordRepository.findByStudentId(userId);

    res.json({
      success: true,
      data: words,
    });
  })
);

// POST /api/practice-words - Add a new practice word
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { word } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    // Validate input
    if (!word || typeof word !== "string" || word.trim().length === 0) {
      throw createError(400, "Word is required");
    }

    const trimmedWord = word.trim();

    // Check if word already exists for this student
    const exists = await practiceWordRepository.exists(userId, trimmedWord);
    if (exists) {
      throw createError(409, "Word already exists in your practice list");
    }

    const newWord = await practiceWordRepository.create(userId, trimmedWord);

    res.status(201).json({
      success: true,
      data: newWord,
    });
  })
);

// DELETE /api/practice-words/:wordId - Delete a practice word
router.delete(
  "/:wordId",
  asyncHandler(async (req: Request, res: Response) => {
    const { wordId } = req.params;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const deleted = await practiceWordRepository.delete(userId, wordId);

    if (!deleted) {
      throw createError(404, "Word not found");
    }

    res.json({
      success: true,
      message: "Word deleted",
    });
  })
);

export default router;
