"use client";
import { useState } from "react";
import DOMPurify from "dompurify";
import extractVideoId from "./../helpers/extractVideoId";
import { mutate } from "swr";
import { API_PATHS } from "./../constants/apiKeys";
import { LessonResponse, ImageResponse, VideoUploadResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";

export type VideoType = 'youtube' | 'cloudinary';
export type ScriptType = 'image' | 'text';

export default function useAddLesson(closeAddLessonDialog: () => void) {
  const [errorMessage, setErrorMessage] = useState("");
  const [videoType, setVideoType] = useState<VideoType>('youtube');
  const [formData, setFormData] = useState({
    title: "",
    videoId: "",
    imageName: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scriptType, setScriptType] = useState<ScriptType>('image');
  const [scriptText, setScriptText] = useState("");

  const { trigger: triggerLesson, isMutating: isMutatingLesson } =
    useSWRMutationHook<
      LessonResponse,
      {
        title: string;
        image?: string;
        scriptText?: string;
        scriptType: ScriptType;
        videoId?: string;
        videoType: VideoType;
        cloudinaryPublicId?: string;
        cloudinaryUrl?: string;
      }
    >(
      API_PATHS.CREATE_LESSON,
      {
        method: "POST",
      },
      {
        onSuccess: () => {
          mutate(API_PATHS.ALL_LESSONS);
        },
      }
    );

  const { trigger: triggerImageUpload } = useSWRMutationHook<
    ImageResponse,
    FormData
  >(API_PATHS.UPLOAD_IMAGE, {
    method: "POST",
  });

  const { trigger: triggerVideoUpload } = useSWRMutationHook<
    VideoUploadResponse,
    FormData
  >(API_PATHS.UPLOAD_VIDEO, {
    method: "POST",
  });

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    let fieldName = "";

    if (id === "lesson-title") fieldName = "title";
    else if (id === "video-id") fieldName = "videoId";
    else if (id === "image-name") fieldName = "imageName";

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please select an image file (PNG, JPG, GIF, etc.)");
      return;
    }

    setErrorMessage("");
    setSelectedImage(file);
    const fileName = file.name.split(".")[0];
    setFormData((prev) => ({
      ...prev,
      imageName: fileName,
    }));
  }

  function handleVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Please select a video file (MP4, WebM, MOV, AVI, MKV)");
      return;
    }

    // Check file size (100MB limit)
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage("Video file must be less than 100MB");
      return;
    }

    setErrorMessage("");
    setSelectedVideo(file);
  }

  function handleVideoTypeChange(newType: VideoType) {
    setVideoType(newType);
    setSelectedVideo(null);
    setFormData((prev) => ({
      ...prev,
      videoId: "",
    }));
    setErrorMessage("");
  }

  function handleScriptTypeChange(newType: ScriptType) {
    setScriptType(newType);
    if (newType === 'text') {
      setSelectedImage(null);
      setFormData((prev) => ({
        ...prev,
        imageName: "",
      }));
    } else {
      setScriptText("");
    }
    setErrorMessage("");
  }

  function handleScriptTextChange(html: string) {
    // Sanitize HTML to prevent XSS
    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
      ALLOWED_ATTR: ['style'],
    });
    setScriptText(cleanHtml);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate title
    if (!formData.title) {
      setErrorMessage("Please enter a lesson title");
      return;
    }

    // Validate based on script type
    if (scriptType === 'image' && !selectedImage) {
      setErrorMessage("Please select an image file");
      return;
    }

    if (scriptType === 'text' && !scriptText.trim()) {
      setErrorMessage("Please enter lesson script text");
      return;
    }

    // Validate based on video type
    if (videoType === 'youtube' && !formData.videoId) {
      setErrorMessage("Please enter a YouTube URL");
      return;
    }

    if (videoType === 'cloudinary' && !selectedVideo) {
      setErrorMessage("Please select a video file to upload");
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      // Prepare lesson data
      const lessonData: {
        title: string;
        image?: string;
        scriptText?: string;
        scriptType: ScriptType;
        videoType: VideoType;
        videoId?: string;
        cloudinaryPublicId?: string;
        cloudinaryUrl?: string;
      } = {
        title: formData.title,
        scriptType: scriptType,
        videoType: videoType,
      };

      // Handle script content based on type
      if (scriptType === 'image') {
        // Upload image
        const imageFormData = new FormData();
        imageFormData.append("image", selectedImage!);
        imageFormData.append("imageName", formData.imageName);
        const imageUrl = await triggerImageUpload(imageFormData);
        lessonData.image = imageUrl.imageUrl;
      } else {
        // Use formatted text
        lessonData.scriptText = scriptText;
      }

      if (videoType === 'youtube') {
        // Extract YouTube video ID
        const extractedVideoId = extractVideoId(formData.videoId);
        lessonData.videoId = extractedVideoId || "";
      } else {
        // Upload video to Cloudinary
        const videoFormData = new FormData();
        videoFormData.append("video", selectedVideo!);
        videoFormData.append("fileName", formData.title);

        const videoResult = await triggerVideoUpload(videoFormData);
        lessonData.cloudinaryPublicId = videoResult.publicId;
        lessonData.cloudinaryUrl = videoResult.url;
      }

      // Create the lesson
      await triggerLesson(lessonData);

      // Reset form
      setFormData({
        title: "",
        videoId: "",
        imageName: "",
      });
      setSelectedImage(null);
      setSelectedVideo(null);
      setVideoType('youtube');
      setScriptType('image');
      setScriptText("");
      closeAddLessonDialog();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error adding lesson"
      );
    } finally {
      setIsUploading(false);
    }
  }

  return {
    errorMessage,
    formData,
    selectedImage,
    selectedVideo,
    videoType,
    scriptType,
    scriptText,
    isMutatingLesson: isMutatingLesson || isUploading,
    handleInputChange,
    handleImageUpload,
    handleVideoUpload,
    handleVideoTypeChange,
    handleScriptTypeChange,
    handleScriptTextChange,
    handleSubmit,
  };
}
