import { Router } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { lessonRepository } from "../repositories/lessonRepository.js";
import { assignmentRepository } from "../repositories/assignmentRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { emailService } from "../services/emailService.js";
import { Request, Response } from "express";

const router = Router();

// Get all lessons assigned to a student (with JOIN)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }
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
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }
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
  asyncHandler(async (req: Request, res: Response) => {
    const { audio_file } = req.body;
    const { lessonId } = req.params;
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }
    // Update the lesson's audio file (if provided)
    if (audio_file) {
      await assignmentRepository.updateAudioFile(userId, lessonId, audio_file);
    }

    // Update assignment status to submitted (pending teacher review)
    const assignment = await assignmentRepository.markSubmitted(
      userId,
      lessonId
    );

    if (!assignment) {
      throw createError(404, "Assignment not found");
    }

    // Send email notification to teacher who assigned this lesson
    if (assignment.assigned_by) {
      const [student, lesson, teacher] = await Promise.all([
        userRepository.findById(userId),
        lessonRepository.findById(lessonId),
        userRepository.findById(assignment.assigned_by),
      ]);

      if (student && lesson && teacher?.email) {
        emailService.notifyTeacherNewSubmission(
          teacher.email,
          teacher.username,
          student.username,
          lesson.title
        ).catch((err) => console.error("[Email] Failed to notify teacher:", err));
      }
    }

    res.json({
      success: true,
      data: assignment,
    });
  })
);

router.delete(
  "/:lessonId",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const assignment = await assignmentRepository.resetSubmission(
      userId,
      lessonId
    );

    if (!assignment) {
      throw createError(404, "Assignment not found or cannot be deleted");
    }

    res.json({
      success: true,
      data: assignment,
    });
  })
);

export default router;
