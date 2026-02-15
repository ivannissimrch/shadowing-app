import { Router } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { practiceWordRepository } from "../repositories/practiceWordRepository.js";
import { practiceResultRepository } from "../repositories/practiceResultRepository.js";
import { Request, Response } from "express";

const router = Router();

// GET /api/practice-words - Get all practice words for the logged-in student (with latest results)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const [words, latestResults] = await Promise.all([
      practiceWordRepository.findByStudentId(userId),
      practiceResultRepository.findLatestByStudentId(userId),
    ]);

    const resultsByWordId = new Map(
      latestResults.map((r) => [r.practice_word_id, r])
    );

    const wordsWithResults = words.map((word) => ({
      ...word,
      latest_result: resultsByWordId.get(word.id) || null,
    }));

    res.json({
      success: true,
      data: wordsWithResults,
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

// POST /api/practice-words/:wordId/results - Save an evaluation result
router.post(
  "/:wordId/results",
  asyncHandler(async (req: Request, res: Response) => {
    const { wordId } = req.params;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const { accuracyScore, fluencyScore, completenessScore, pronunciationScore, words } = req.body;

    if (accuracyScore == null || fluencyScore == null || completenessScore == null || pronunciationScore == null) {
      throw createError(400, "All score fields are required");
    }

    // Verify the word belongs to this student
    const allWords = await practiceWordRepository.findByStudentId(userId);
    const word = allWords.find((w) => w.id === Number(wordId));
    if (!word) {
      throw createError(404, "Practice word not found");
    }

    const result = await practiceResultRepository.create(
      Number(wordId),
      { accuracyScore, fluencyScore, completenessScore, pronunciationScore },
      words || null
    );

    res.status(201).json({
      success: true,
      data: result,
    });
  })
);

export default router;
