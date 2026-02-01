import { Router, Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import {
  evaluatePronunciation,
  synthesizeSpeech,
} from "../services/speechEvaluation.js";
import { getCoachFeedback } from "../services/eslCoach.js";

const router = Router();

// Text-to-Speech endpoint
router.post(
  "/synthesize",
  asyncHandler(async (req: Request, res: Response) => {
    const { text, rate = 1.0 } = req.body;

    if (!text) {
      throw createError(400, "text is required");
    }

    const audioBuffer = await synthesizeSpeech(text, rate);

    // Return audio as base64
    res.json({
      success: true,
      data: {
        audio: `data:audio/wav;base64,${audioBuffer.toString("base64")}`,
      },
    });
  })
);

router.post(
  "/evaluate",
  asyncHandler(async (req: Request, res: Response) => {
    const { audioData, referenceText } = req.body;

    if (!audioData || !referenceText) {
      throw createError(400, "audioData and referenceText are required");
    }

    // Remove base64 prefix if present and decode to buffer
    const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, "");
    const audioBuffer = Buffer.from(base64Data, "base64");

    const result = await evaluatePronunciation(audioBuffer, referenceText);

    res.json({
      success: true,
      data: result,
    });
  })
);

// ESL Coach - get feedback on pronunciation
router.post(
  "/coach",
  asyncHandler(async (req: Request, res: Response) => {
    const { referenceText, evaluation, nativeLanguage } = req.body;

    if (!referenceText || !evaluation) {
      throw createError(400, "referenceText and evaluation are required");
    }

    const feedback = await getCoachFeedback(referenceText, evaluation, nativeLanguage);

    res.json({
      success: true,
      data: { feedback },
    });
  })
);

export default router;
