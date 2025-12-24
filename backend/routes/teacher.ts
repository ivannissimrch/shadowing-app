import { Router } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler";
import { requireTeacher } from "../middleware/auth";
import { lessonRepository } from "../repositories/lessonRepository";
import { assignmentRepository } from "../repositories/assignmentRepository";
import { userRepository } from "../repositories/userRepository";
import { Request, Response } from "express";

const router = Router();

// All routes in this file require teacher role
router.use(requireTeacher);

// Create new lesson content
router.post(
  "/lessons",
  asyncHandler(async (req: Request, res: Response) => {
    const { title, image, videoId, lessonStartTime, lessonEndTime } = req.body;
    // Create new lesson content
    const lesson = await lessonRepository.create({
      title,
      image,
      videoId,
      lessonStartTime,
      lessonEndTime,
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

    const assignment = await assignmentRepository.addFeedback(
      studentId,
      lessonId,
      feedback
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
