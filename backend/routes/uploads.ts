import { Router, Request, Response } from "express";
import createError from "http-errors";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import asyncHandler from "../handlers/asyncHandler";
import { uploadImage, uploadAudio } from "../services/azureBlobStorage";

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

export default router;
