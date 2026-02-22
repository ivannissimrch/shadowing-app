import { Router, Request, Response } from "express";
import createError from "http-errors";
import asyncHandler from "../handlers/asyncHandler.js";
import { segmentRepository } from "../repositories/segmentRepository.js";
import { lessonRepository } from "../repositories/lessonRepository.js";
import { CreateSegmentInput } from "../types.js";

const router = Router();

// GET /api/lessons/:lessonId/segments - Get all segments for a lesson
// Available to both students and teachers
router.get(
  "/lessons/:lessonId/segments",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;

    const segments = await segmentRepository.findByLessonId(lessonId);

    res.json({
      success: true,
      data: segments,
    });
  })
);

// POST /api/teacher/lessons/:lessonId/segments - Batch create segments
// Teacher only
router.post(
  "/teacher/lessons/:lessonId/segments",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId } = req.params;
    const { segments } = req.body;
    const role = req?.user?.role;

    if (role !== "teacher") {
      throw createError(403, "Only teachers can create segments");
    }

    // Verify lesson exists
    const lessonExists = await lessonRepository.exists(lessonId);
    if (!lessonExists) {
      throw createError(404, "Lesson not found");
    }

    // Validate segments array
    if (!Array.isArray(segments) || segments.length === 0) {
      throw createError(400, "segments array is required and must not be empty");
    }

    // Validate each segment
    for (const seg of segments) {
      if (!seg.label || typeof seg.label !== "string" || seg.label.trim().length === 0) {
        throw createError(400, "Each segment must have a non-empty label");
      }
      if (typeof seg.start_time !== "number" || typeof seg.end_time !== "number") {
        throw createError(400, "Each segment must have numeric start_time and end_time");
      }
      if (seg.start_time < 0 || seg.end_time <= seg.start_time) {
        throw createError(400, "end_time must be greater than start_time");
      }
      if (typeof seg.position !== "number" || seg.position < 1) {
        throw createError(400, "Each segment must have a positive position");
      }
    }

    const validSegments: CreateSegmentInput[] = segments.map((seg: CreateSegmentInput) => ({
      label: seg.label.trim(),
      start_time: seg.start_time,
      end_time: seg.end_time,
      position: seg.position,
    }));

    const created = await segmentRepository.batchCreate(lessonId, validSegments);

    res.status(201).json({
      success: true,
      data: created,
    });
  })
);

// PATCH /api/teacher/lessons/:lessonId/segments/:id - Update a segment
// Teacher only
router.patch(
  "/teacher/lessons/:lessonId/segments/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId, id } = req.params;
    const role = req?.user?.role;

    if (role !== "teacher") {
      throw createError(403, "Only teachers can update segments");
    }

    const { label, start_time, end_time, position } = req.body;

    if (start_time !== undefined && end_time !== undefined && end_time <= start_time) {
      throw createError(400, "end_time must be greater than start_time");
    }

    const updated = await segmentRepository.update(id, lessonId, {
      label,
      start_time,
      end_time,
      position,
    });

    if (!updated) {
      throw createError(404, "Segment not found");
    }

    res.json({
      success: true,
      data: updated,
    });
  })
);

// DELETE /api/teacher/lessons/:lessonId/segments/:id - Delete a segment
// Teacher only
router.delete(
  "/teacher/lessons/:lessonId/segments/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { lessonId, id } = req.params;
    const role = req?.user?.role;

    if (role !== "teacher") {
      throw createError(403, "Only teachers can delete segments");
    }

    const deleted = await segmentRepository.delete(id, lessonId);

    if (!deleted) {
      throw createError(404, "Segment not found");
    }

    res.json({
      success: true,
      message: "Segment deleted",
    });
  })
);

export default router;
