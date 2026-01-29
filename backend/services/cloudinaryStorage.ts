import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate configuration on startup
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn(
    "Warning: Cloudinary credentials not fully configured. Video uploads will fail.",
  );
}

export interface CloudinaryUploadResult {
  publicId: string;
  url: string;
  duration: number; // Video duration in seconds
  format: string;
}

/**
 * Upload a video buffer to Cloudinary
 * Uses upload_stream since we're working with buffers from multer
 */
export async function uploadVideo(
  videoBuffer: Buffer,
  fileName: string,
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    // Create upload stream
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "video",
        folder: "lessons", // Organize videos in a folder
        public_id: fileName, // Custom filename without extension
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("No result from Cloudinary upload"));
          return;
        }

        resolve({
          publicId: result.public_id,
          url: result.secure_url,
          duration: result.duration || 0,
          format: result.format,
        });
      },
    );

    // Pipe the buffer to the upload stream
    uploadStream.end(videoBuffer);
  });
}

/**
 * Delete a video from Cloudinary
 */
export async function deleteVideo(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
}

/**
 * Get info about a video (useful for getting duration if needed later)
 */
export async function getVideoInfo(publicId: string) {
  return cloudinary.api.resource(publicId, { resource_type: "video" });
}

export default cloudinary;
