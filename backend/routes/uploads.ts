import { Router, Request, Response } from "express";
import createError from "http-errors";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import asyncHandler from "../handlers/asyncHandler.js";
import {
  uploadImage,
  uploadAudio,
  uploadLessonAudio,
} from "../services/azureBlobStorage.js";
import { uploadVideo } from "../services/cloudinaryStorage.js";
import { extractAudioFromVideo } from "../services/audioExtraction.js";

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store files in memory temporarily

const upload = multer({
  storage: storage,
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Image upload route
router.post(
  "/upload-image",
  upload.single("image"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw createError(400, "No image file uploaded");
    }

    const ext = path.extname(req.file.originalname);
    const imageName =
      req.body.imageName || path.basename(req.file.originalname, ext);
    const fileName = imageName + ext;

    // Upload to Azure instead of saving locally
    const imageUrl = await uploadImage(req.file.buffer, fileName);

    res.json({
      success: true,
      data: {
        imageName: fileName,
        imageUrl: imageUrl, // Return the Azure blob URL
      },
      message: "Image uploaded successfully",
    });
  })
);

//Audio upload route
router.post(
  "/upload-audio",
  asyncHandler(async (req: Request, res: Response) => {
    const { audioData, lessonId } = req.body;
    const userId = req?.user?.id;

    // Convert base64 to buffer
    const base64Data = audioData.replace(/^data:audio\/\w+;base64,/, "");
    const audioBuffer = Buffer.from(base64Data, "base64");

    // Generate unique filename
    const fileName = `${userId}_${lessonId}_${Date.now()}.webm`;

    // Upload to Azure
    const audioUrl = await uploadAudio(audioBuffer, fileName);

    res.json({
      success: true,
      data: {
        audioUrl: audioUrl,
      },
    });
  })
);

// Configure multer for video uploads
const videoUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    // Accept common video formats
    const allowedMimeTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime", // .mov files
      "video/x-msvideo", // .avi files
      "video/x-matroska", // .mkv files
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only video files are allowed (mp4, webm, mov, avi, mkv)"));
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit for videos
  },
});

// Video upload route - uploads to Cloudinary
router.post(
  "/upload-video",
  videoUpload.single("video"),
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      throw createError(400, "No video file uploaded");
    }

    // Generate unique filename: lessonTitle_timestamp (no extension needed)
    const baseName = req.body.fileName
      ? req.body.fileName.replace(/[^a-zA-Z0-9]/g, "_") // Sanitize filename
      : "lesson_video";
    const fileName = `${baseName}_${Date.now()}`;

    // Upload to Cloudinary AND extract audio in parallel
    const cloudinaryPromise = uploadVideo(req.file.buffer, fileName);
    const audioPromise = extractAudioFromVideo(req.file.buffer).catch(
      (err) => {
        console.error("Audio extraction failed (non-blocking):", err);
        return null;
      }
    );

    const [result, audioBuffer] = await Promise.all([
      cloudinaryPromise,
      audioPromise,
    ]);

    // Upload extracted audio to Azure if extraction succeeded
    let audioUrl: string | null = null;
    if (audioBuffer) {
      try {
        audioUrl = await uploadLessonAudio(audioBuffer, `${fileName}.mp3`);
      } catch (err) {
        console.error("Audio upload to Azure failed (non-blocking):", err);
      }
    }

    res.json({
      success: true,
      data: {
        publicId: result.publicId,
        url: result.url,
        duration: result.duration,
        format: result.format,
        audioUrl,
      },
      message: "Video uploaded successfully",
    });
  }),
);

export default router;
