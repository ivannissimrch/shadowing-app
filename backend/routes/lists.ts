import { Router, Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { requireTeacher } from "../middleware/auth.js";
import { listRepository } from "../repositories/listRepository.js";

const router = Router();

// All routes in this file require teacher role
router.use(requireTeacher);

// List all lists for the teacher (with lesson count)
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const lists = await listRepository.findByTeacherId(teacherId);

    res.json({
      success: true,
      data: lists,
    });
  })
);

// Create a new list
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const { name, description } = req.body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw createError(400, "List name is required");
    }

    const list = await listRepository.create(teacherId, {
      name: name.trim(),
      description: description?.trim() || undefined,
    });

    res.status(201).json({
      success: true,
      data: list,
    });
  })
);

// Get a single list with its lessons
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const { id } = req.params;

    // Check ownership
    const isOwner = await listRepository.isOwnedByTeacher(id, teacherId);
    if (!isOwner) {
      throw createError(404, "List not found");
    }

    const list = await listRepository.findByIdWithLessons(id);
    if (!list) {
      throw createError(404, "List not found");
    }

    res.json({
      success: true,
      data: list,
    });
  })
);

// Update a list
router.patch(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const { id } = req.params;
    const { name, description } = req.body;

    // Check ownership
    const isOwner = await listRepository.isOwnedByTeacher(id, teacherId);
    if (!isOwner) {
      throw createError(404, "List not found");
    }

    const list = await listRepository.update(id, {
      name: name?.trim(),
      description: description?.trim(),
    });

    if (!list) {
      throw createError(404, "List not found");
    }

    res.json({
      success: true,
      data: list,
    });
  })
);

// Delete a list
router.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const { id } = req.params;

    // Check ownership
    const isOwner = await listRepository.isOwnedByTeacher(id, teacherId);
    if (!isOwner) {
      throw createError(404, "List not found");
    }

    await listRepository.delete(id);

    res.json({
      success: true,
      message: "List deleted successfully",
    });
  })
);

// Add lessons to a list
router.post(
  "/:id/lessons",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const { id } = req.params;
    const { lessonIds } = req.body;

    // Check ownership
    const isOwner = await listRepository.isOwnedByTeacher(id, teacherId);
    if (!isOwner) {
      throw createError(404, "List not found");
    }

    if (!Array.isArray(lessonIds) || lessonIds.length === 0) {
      throw createError(400, "lessonIds array is required");
    }

    await listRepository.addLessons(id, lessonIds);

    // Return updated list with lessons
    const list = await listRepository.findByIdWithLessons(id);

    res.json({
      success: true,
      message: "Lessons added to list",
      data: list,
    });
  })
);

// Remove a lesson from a list
router.delete(
  "/:id/lessons/:lessonId",
  asyncHandler(async (req: Request, res: Response) => {
    const teacherId = req?.user?.id;
    if (!teacherId) {
      throw createError(401, "Unauthorized");
    }

    const { id, lessonId } = req.params;

    // Check ownership
    const isOwner = await listRepository.isOwnedByTeacher(id, teacherId);
    if (!isOwner) {
      throw createError(404, "List not found");
    }

    await listRepository.removeLesson(id, lessonId);

    res.json({
      success: true,
      message: "Lesson removed from list",
    });
  })
);

export default router;
