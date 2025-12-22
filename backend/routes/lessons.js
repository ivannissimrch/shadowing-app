import { Router } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { lessonRepository } from "../repositories/lessonRepository.js";
import { assignmentRepository } from "../repositories/assignmentRepository.js";

const router = Router();

// Get all lessons assigned to a student (with JOIN)
router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const lessons = await lessonRepository.findByStudentId(userId);

    res.json({
      success: true,
      data: lessons,
    });
  })
);

// Get specific lesson for a student (with JOIN)
router.get(
  "/:lessonId",
  asyncHandler(async (req, res, next) => {
    const { lessonId } = req.params;
    const userId = req.user.id;

    const lesson = await lessonRepository.findOneForStudent(userId, lessonId);

    if (!lesson) {
      throw createError(404, "Lesson not found or not assigned");
    }

    res.json({
      success: true,
      data: lesson,
    });
  })
);

// Update student's lesson progress (audio file and completion)
router.patch(
  "/:lessonId",
  asyncHandler(async (req, res, next) => {
    const { audio_file } = req.body;
    const { lessonId } = req.params;
    const userId = req.user.id;

    // Update the lesson's audio file (if provided)
    if (audio_file) {
      await assignmentRepository.updateAudioFile(userId, lessonId, audio_file);
    }

    // Update assignment status to completed
    const assignment = await assignmentRepository.markCompleted(
      userId,
      lessonId
    );

    if (!assignment) {
      throw createError(404, "Assignment not found");
    }

    res.json({
      success: true,
      data: assignment,
    });
  })
);

export default router;
