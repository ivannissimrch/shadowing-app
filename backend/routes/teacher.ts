import { Router } from "express";
import createError from "http-errors";
import sanitizeHtml from "sanitize-html";
import asyncHandler from "../handlers/asyncHandler.js";
import { requireTeacher } from "../middleware/auth.js";
import { lessonRepository } from "../repositories/lessonRepository.js";
import { assignmentRepository } from "../repositories/assignmentRepository.js";
import { userRepository } from "../repositories/userRepository.js";
import { feedbackReplyRepository } from "../repositories/feedbackReplyRepository.js";
import { practiceWordRepository } from "../repositories/practiceWordRepository.js";
import { practiceResultRepository } from "../repositories/practiceResultRepository.js";
import { segmentRepository } from "../repositories/segmentRepository.js";
import { emailService } from "../services/emailService.js";
import { evaluatePronunciation, transcribeAudio } from "../services/speechEvaluation.js";
import {
  generateFeedbackDraft,
  PronunciationStats,
} from "../services/aiFeedback.js";
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

// All routes in this file require teacher role
router.use(requireTeacher);

// Get pending reviews (lessons submitted but not yet completed)
router.get(
  "/pending-reviews",
  asyncHandler(async (_req: Request, res: Response) => {
    const pendingReviews = await assignmentRepository.getPendingReviews();

    res.json({
      success: true,
      data: pendingReviews,
    });
  })
);

// Students with their assigned lessons (for dashboard accordion)
router.get(
  "/students-with-lessons",
  asyncHandler(async (_req: Request, res: Response) => {
    const data = await assignmentRepository.getStudentsWithLessons();

    res.json({
      success: true,
      data,
    });
  })
);

// Dashboard stats endpoint
router.get(
  "/dashboard-stats",
  asyncHandler(async (_req: Request, res: Response) => {
    const [
      pendingReviewCount,
      completedThisWeek,
      recentLessons,
      studentProgress,
    ] = await Promise.all([
      assignmentRepository.countPendingReview(),
      assignmentRepository.countCompletedThisWeek(),
      lessonRepository.findRecent(5),
      assignmentRepository.getStudentProgress(),
    ]);

    res.json({
      success: true,
      data: {
        pendingReviewCount,
        completedThisWeek,
        recentLessons,
        studentProgress,
      },
    });
  })
);

// Create new lesson content
router.post(
  "/lessons",
  asyncHandler(async (req: Request, res: Response) => {
    const {
      title,
      image,
      scriptText,
      scriptType,
      videoId,
      videoType,
      cloudinaryPublicId,
      cloudinaryUrl,
      lessonStartTime,
      lessonEndTime,
      audioUrl,
    } = req.body;
    // Create new lesson content
    const lesson = await lessonRepository.create({
      title,
      image,
      scriptText,
      scriptType,
      videoId,
      videoType,
      cloudinaryPublicId,
      cloudinaryUrl,
      lessonStartTime,
      lessonEndTime,
      audioUrl,
    });
    res.status(201).json({
      success: true,
      data: lesson,
    });
  })
);

// Assign lesson to student
router.post(
  "/lessons/:lessonId/assign",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { studentId } = req.body; // Single student ID
    const teacherId = req?.user?.id;

    if (!studentId) {
      return res.status(400).json({
        success: false,
        message: "Student ID is required",
      });
    }

    // Check if lesson exists
    const lessonExists = await lessonRepository.exists(lessonId);

    if (!lessonExists) {
      throw createError(404, "Lesson not found");
    }

    // Check if assignment already exists
    const assignmentExists = await assignmentRepository.exists(
      studentId,
      lessonId
    );

    if (assignmentExists) {
      throw createError(409, "This lesson is already assigned to this student");
    }

    // Create assignment for the student
    const assignment = await assignmentRepository.create({
      studentId,
      lessonId,
      assignedBy: teacherId,
    });
    res.status(201).json({
      success: true,
      message: "Lesson assigned successfully",
      data: assignment,
    });
  })
);

// Unassign lesson from student
router.delete(
  "/lessons/:lessonId/unassign/:studentId",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId, studentId } = req.params;

    // Check if assignment exists first
    const assignmentExists = await assignmentRepository.exists(
      studentId,
      lessonId
    );

    if (!assignmentExists) {
      throw createError(
        404,
        "Assignment not found or you don't have permission to unassign it"
      );
    }

    // Delete the assignment from database (any teacher can remove)
    await assignmentRepository.delete(studentId, lessonId);

    res.status(200).json({
      success: true,
      message: "Lesson unassigned successfully",
    });
  })
);

// Update/Edit lesson
router.patch(
  "/lessons/:lessonId",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const {
      title,
      image,
      scriptText,
      scriptType,
      videoId,
      videoType,
      cloudinaryPublicId,
      cloudinaryUrl,
      lessonStartTime,
      lessonEndTime,
      category,
      audioUrl,
    } = req.body;

    // Check if lesson exists
    const lessonExists = await lessonRepository.exists(lessonId);

    if (!lessonExists) {
      throw createError(404, "Lesson not found");
    }

    // Update the lesson
    const lesson = await lessonRepository.update(lessonId, {
      title,
      image,
      scriptText,
      scriptType,
      videoId,
      videoType,
      cloudinaryPublicId,
      cloudinaryUrl,
      lessonStartTime,
      lessonEndTime,
      category,
      audioUrl,
    });

    res.json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
    });
  })
);

// Delete lesson
router.delete(
  "/lessons/:lessonId",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;

    // Check if lesson exists
    const lessonExists = await lessonRepository.exists(lessonId);

    if (!lessonExists) {
      throw createError(404, "Lesson not found");
    }

    // Delete the lesson (CASCADE will delete related assignments)
    await lessonRepository.delete(lessonId);

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  })
);

//get all lessons (for teacher dashboard)
router.get(
  "/all-lessons",
  asyncHandler(async (_req: Request, res: Response) => {
    const lessons = await lessonRepository.findAll();
    res.json({
      success: true,
      data: lessons,
    });
  })
);

// Get single lesson (for teacher preview)
router.get(
  "/lessons/:lessonId",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const lesson = await lessonRepository.findById(lessonId);

    if (!lesson) {
      throw createError(404, "Lesson not found");
    }

    res.json({
      success: true,
      data: lesson,
    });
  })
);

//get student data (for teacher to view student progress)
router.get(
  "/student/:studentId",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const student = await userRepository.findStudentById(studentId);

    if (!student) {
      throw createError(404, "Student not found");
    }

    res.json({
      success: true,
      data: student,
    });
  })
);

//get student lessons (for teacher to view student progress)
router.get(
  "/student/:studentId/lessons",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const lessons = await lessonRepository.findByStudentId(studentId);
    res.json({
      success: true,
      data: lessons,
    });
  })
);

//get specific student lesson (for teacher to view student progress)
router.get(
  "/student/:studentId/lesson/:lessonId",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId, lessonId } = req.params;
    const lesson = await lessonRepository.findOneForStudent(
      studentId,
      lessonId
    );

    if (!lesson) {
      throw createError(404, "Lesson not found or not assigned to student");
    }

    res.json({
      success: true,
      data: lesson,
    });
  })
);

// Update feedback for student assignment
router.patch(
  "/student/:studentId/lesson/:lessonId/feedback",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId, lessonId } = req.params;
    const { feedback } = req.body;

    const sanitizedFeedback = sanitizeHtml(feedback, SANITIZE_OPTIONS);

    const assignment = await assignmentRepository.addFeedback(
      studentId,
      lessonId,
      sanitizedFeedback
    );

    if (!assignment) {
      throw createError(404, "Assignment not found");
    }

    // Send email notification to student (async, don't block response)
    const [student, lesson] = await Promise.all([
      userRepository.findById(studentId),
      lessonRepository.findById(lessonId),
    ]);

    if (student?.email && lesson) {
      emailService.notifyStudentFeedback(
        student.email,
        student.username,
        lesson.title,
        false // not completed yet
      ).catch((err) => console.error("[Email] Failed to notify student:", err));
    }

    res.json({
      success: true,
      data: assignment,
    });
  })
);

// Generate an AI-drafted feedback message from the student's recording.
// Runs Azure pronunciation assessment on the submission, then Gemini turns the
// scores into a warm draft the teacher can edit before sending. Nothing is saved.
router.post(
  "/student/:studentId/lesson/:lessonId/ai-feedback",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId, lessonId } = req.params;
    // Optional free-text steer from the teacher (e.g. "focus on the r sound").
    const teacherInstruction =
      typeof req.body?.instruction === "string"
        ? req.body.instruction.slice(0, 500)
        : undefined;

    const lesson = await lessonRepository.findOneForStudent(studentId, lessonId);

    if (!lesson) {
      throw createError(404, "Lesson not found or not assigned to student");
    }
    if (!lesson.audio_file) {
      throw createError(400, "This lesson has no recording to analyze");
    }

    let referenceText: string;

    if (lesson.verified_transcript) {
      // Already transcribed from the lesson's own audio on a prior request —
      // reuse it instead of spending Azure quota re-transcribing every time.
      referenceText = lesson.verified_transcript;
    } else if (lesson.audio_url) {
      // First feedback request for this lesson: transcribe the lesson's own
      // narration audio once, then cache it so every student after this one
      // hits the cached branch above. Grounds the reference text in what's
      // actually spoken, not what the teacher typed into script_text.
      const lessonAudioResponse = await fetch(lesson.audio_url);
      if (!lessonAudioResponse.ok) {
        throw createError(502, "Failed to fetch the lesson's audio");
      }
      const lessonAudioBuffer = Buffer.from(
        await lessonAudioResponse.arrayBuffer()
      );
      const transcript = await transcribeAudio(lessonAudioBuffer);

      if (!transcript.trim()) {
        throw createError(502, "Could not transcribe this lesson's audio");
      }

      await lessonRepository.updateVerifiedTranscript(lessonId, transcript);
      referenceText = transcript;
    } else {
      // No extracted lesson audio (e.g. youtube-type lessons) — fall back to
      // the teacher-curated text.
      if (!lesson.script_text) {
        throw createError(400, "This lesson has no script to compare against");
      }

      // Prefer the lesson's segments as the reference text: segment.label is
      // the same clean, curated spoken-line text the practice feature already
      // scores against successfully (see LessonPhrasesList.tsx), free of the
      // teacher's own notes and speaker-attribution labels that live in the
      // freeform script_text field.
      const segments = await segmentRepository.findByLessonId(lessonId);
      const segmentText = segments
        .map((segment) => segment.label?.trim())
        .filter(Boolean)
        .join(" ");

      // Fallback for lessons that haven't been segmented yet: script_text is
      // rich HTML from the editor (tags, inline colors, "/" shadowing pause
      // marks, and speaker labels like "Harvey:" at the start of a line).
      // Strip each speaker label per-paragraph (the student reads the line,
      // never the attribution), then strip markup and pause marks.
      const paragraphs = lesson.script_text.match(/<p[^>]*>.*?<\/p>/gs) ?? [
        lesson.script_text,
      ];
      const scriptTextFallback = paragraphs
        .map((paragraph) =>
          sanitizeHtml(paragraph, { allowedTags: [], allowedAttributes: {} })
            .replace(/^\s*[A-Za-z][A-Za-z .'-]*:\s*/, "")
            .trim()
        )
        .filter(Boolean)
        .join(" ")
        .replace(/\/+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      referenceText = segmentText || scriptTextFallback;

      if (!referenceText) {
        throw createError(400, "This lesson's script is empty after cleanup");
      }
    }

    // Fetch the student's raw recording so Azure can score it.
    const audioResponse = await fetch(lesson.audio_file);
    if (!audioResponse.ok) {
      throw createError(502, "Failed to fetch the student's recording");
    }
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

    const stats = (await evaluatePronunciation(
      audioBuffer,
      referenceText
    )) as Omit<PronunciationStats, "referenceText">;

    const draft = await generateFeedbackDraft(
      {
        ...stats,
        referenceText,
      },
      teacherInstruction
    );

    res.json({
      success: true,
      // `stats.words` lets the teacher see the actual per-word/phoneme scores
      // the draft was grounded in, instead of just trusting the AI's summary.
      data: { draft, stats: { ...stats, referenceText } },
    });
  })
);

// Mark lesson as completed (after teacher review)
router.patch(
  "/student/:studentId/lesson/:lessonId/complete",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId, lessonId } = req.params;

    const assignment = await assignmentRepository.markCompleted(
      studentId,
      lessonId
    );

    if (!assignment) {
      throw createError(404, "Assignment not found");
    }

    // Send email notification to student (async, don't block response)
    const [student, lesson] = await Promise.all([
      userRepository.findById(studentId),
      lessonRepository.findById(lessonId),
    ]);

    if (student?.email && lesson) {
      emailService.notifyStudentFeedback(
        student.email,
        student.username,
        lesson.title,
        true // completed
      ).catch((err) => console.error("[Email] Failed to notify student:", err));
    }

    res.json({
      success: true,
      message: "Lesson marked as completed",
      data: assignment,
    });
  })
);

// Get feedback replies for a student assignment
router.get(
  "/student/:studentId/lesson/:lessonId/feedback/replies",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId, lessonId } = req.params;

    const assignment = await assignmentRepository.findByStudentAndLesson(
      studentId,
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

// Post a feedback reply as teacher
router.post(
  "/student/:studentId/lesson/:lessonId/feedback/replies",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId, lessonId } = req.params;
    const { content } = req.body;
    const userId = req?.user?.id;

    if (!userId) {
      throw createError(401, "Unauthorized");
    }

    if (!content?.trim()) {
      throw createError(400, "Reply content is required");
    }

    const assignment = await assignmentRepository.findByStudentAndLesson(
      studentId,
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

    // Send email notification to student (async, don't block response)
    const [student, lesson] = await Promise.all([
      userRepository.findById(studentId),
      lessonRepository.findById(lessonId),
    ]);

    if (student?.email && lesson) {
      emailService
        .notifyFeedbackReply(
          student.email,
          student.username,
          lesson.title,
          "teacher",
          lessonId,
          studentId
        )
        .catch((err) =>
          console.error("[Email] Failed to notify student of reply:", err)
        );
    }

    res.status(201).json({
      success: true,
      data: reply,
    });
  })
);

// Edit a feedback reply as teacher (own replies only)
router.patch(
  "/student/:studentId/lesson/:lessonId/feedback/replies/:replyId",
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

// Delete a feedback reply as teacher (own replies only)
router.delete(
  "/student/:studentId/lesson/:lessonId/feedback/replies/:replyId",
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

// Get practice words for a student (with latest results)
router.get(
  "/student/:studentId/practice-words",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;

    const [words, latestResults] = await Promise.all([
      practiceWordRepository.findByStudentId(studentId),
      practiceResultRepository.findLatestByStudentId(studentId),
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

// Add a practice word for a student
router.post(
  "/student/:studentId/practice-words",
  asyncHandler(async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { word } = req.body;

    if (!word || typeof word !== "string" || word.trim().length === 0) {
      throw createError(400, "Word is required");
    }

    const trimmedWord = word.trim();

    const exists = await practiceWordRepository.exists(studentId, trimmedWord);
    if (exists) {
      throw createError(409, "Word already exists in student's practice list");
    }

    const newWord = await practiceWordRepository.create(studentId, trimmedWord);

    res.status(201).json({
      success: true,
      data: newWord,
    });
  })
);

export default router;
