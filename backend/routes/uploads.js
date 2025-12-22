import { Router } from "express";
import createError from "http-errors";
import multer from "multer";
import path from "path";
import asyncHandler from "../handlers/asyncHandler.js";
import { uploadImage, uploadAudio } from "../services/azureBlobStorage.js";

const router = Router();

// Configure multer for image uploads
const storage = multer.memoryStorage(); // Store files in memory temporarily

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
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
  asyncHandler(async (req, res, next) => {
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
  asyncHandler(async (req, res, next) => {
    const { audioData, lessonId } = req.body;
    const userId = req.user.id;

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