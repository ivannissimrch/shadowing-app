import { Router } from "express";
import createError from "http-errors";
import sanitizeHtml from "sanitize-html";
import asyncHandler from "../handlers/asyncHandler.js";
import { lessonRepository } from "../repositories/lessonRepository.js";
import { assignmentRepository } from "../repositories/assignmentRepository.js";
import { feedbackReplyRepository } from "../repositories/feedbackReplyRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { emailService } from "../services/emailService.js";
import { Request, Response } from "express";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: ["p", "br", "strong", "b", "em", "i", "u", "s", "span", "ul", "ol", "li", "h1", "h2", "h3", "mark"],
  allowedAttributes: {
    span: ["style", "data-color"],
    mark: ["style", "data-color"],
  },
  allowedStyles: {
    "*": {
      color: [/.*/],
      "background-color": [/.*/],
      "font-family": [/.*/],
      "font-size": [/.*/],
    },
  },
};

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

// Get feedback replies for a lesson (student view)
router.get(
  "/:lessonId/feedback/replies",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const userId = req?.user?.id;
    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const assignment = await assignmentRepository.findByStudentAndLesson(
      userId,
      lessonId
    );

    if (!assignment) {
      throw createError(404, "Assignment not found");
    }

    const replies = await feedbackReplyRepository.findByAssignment(
      assignment.id
    );

    res.json({
      success: true,
      data: replies,
    });
  })
);

// Post a feedback reply as student
router.post(
  "/:lessonId/feedback/replies",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { content } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    if (!content?.trim()) {
      throw createError(400, "Reply content is required");
    }

    const assignment = await assignmentRepository.findByStudentAndLesson(
      userId,
      lessonId
    );

    if (!assignment) {
      throw createError(404, "Assignment not found");
    }

    const sanitizedContent = sanitizeHtml(content, SANITIZE_OPTIONS);

    const reply = await feedbackReplyRepository.create(
      assignment.id,
      userId,
      sanitizedContent
    );

    // Send email notification to teacher who assigned the lesson (async)
    if (assignment.assigned_by) {
      const [student, lesson, teacher] = await Promise.all([
        userRepository.findById(userId),
        lessonRepository.findById(lessonId),
        userRepository.findById(assignment.assigned_by),
      ]);

      if (student && lesson && teacher?.email) {
        emailService
          .notifyFeedbackReply(
            teacher.email,
            teacher.username,
            lesson.title,
            "student"
          )
          .catch((err) =>
            console.error("[Email] Failed to notify teacher of reply:", err)
          );
      }
    }

    res.status(201).json({
      success: true,
      data: reply,
    });
  })
);

// Edit a feedback reply as student (own replies only)
router.patch(
  "/:lessonId/feedback/replies/:replyId",
  asyncHandler(async (req: Request, res: Response) => {
    const { replyId } = req.params;
    const { content } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    if (!content?.trim()) {
      throw createError(400, "Reply content is required");
    }

    const reply = await feedbackReplyRepository.findById(replyId);

    if (!reply) {
      throw createError(404, "Reply not found");
    }

    if (reply.user_id !== userId) {
      throw createError(403, "You can only edit your own replies");
    }

    const sanitizedContent = sanitizeHtml(content, SANITIZE_OPTIONS);
    const updated = await feedbackReplyRepository.update(
      replyId,
      sanitizedContent
    );

    res.json({
      success: true,
      data: updated,
    });
  })
);

// Delete a feedback reply as student (own replies only)
router.delete(
  "/:lessonId/feedback/replies/:replyId",
  asyncHandler(async (req: Request, res: Response) => {
    const { replyId } = req.params;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    const reply = await feedbackReplyRepository.findById(replyId);

    if (!reply) {
      throw createError(404, "Reply not found");
    }

    if (reply.user_id !== userId) {
      throw createError(403, "You can only delete your own replies");
    }

    await feedbackReplyRepository.delete(replyId);

    res.json({
      success: true,
      message: "Reply deleted",
    });
  })
);

export default router;
