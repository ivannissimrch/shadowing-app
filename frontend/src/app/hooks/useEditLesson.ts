"use client";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import extractVideoId from "./../helpers/extractVideoId";
import { mutate } from "swr";
import { API_PATHS } from "./../constants/apiKeys";
import { Lesson, LessonResponse, ImageResponse, VideoUploadResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";

export type VideoType = 'youtube' | 'cloudinary';
export type ScriptType = 'image' | 'text';

export default function useEditLesson(
  lesson: Lesson | null,
  closeEditLessonDialog: () => void
) {
  const [errorMessage, setErrorMessage] = useState("");
  const [videoType, setVideoType] = useState<VideoType>('youtube');
  const [formData, setFormData] = useState({
    title: "",
    videoId: "",
    imageName: "",
    category: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [scriptType, setScriptType] = useState<ScriptType>('image');
  const [scriptText, setScriptText] = useState("");
  // Track if media has changed (to know if we need to re-upload)
  const [hasVideoChanged, setHasVideoChanged] = useState(false);
  const [hasImageChanged, setHasImageChanged] = useState(false);

  // Initialize form with lesson data when lesson changes
  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || "",
        videoId: lesson.video_id || "",
        imageName: "",
        category: lesson.category || "",
      });
      setVideoType(lesson.video_type || 'youtube');
      setScriptType(lesson.script_type || 'image');
      setScriptText(lesson.script_text || "");
      setSelectedImage(null);
      setSelectedVideo(null);
      setHasVideoChanged(false);
      setHasImageChanged(false);
      setErrorMessage("");
    }
  }, [lesson]);

  const { trigger: triggerUpdateLesson, isMutating: isMutatingLesson } =
    useSWRMutationHook<
      LessonResponse,
      {
        title?: string;
        image?: string;
        scriptText?: string;
        scriptType?: ScriptType;
        videoId?: string;
        videoType?: VideoType;
        cloudinaryPublicId?: string;
        cloudinaryUrl?: string;
        category?: string;
        audioUrl?: string;
      }
    >(
      lesson ? `${API_PATHS.CREATE_LESSON}/${lesson.id}` : null,
      {
        method: "PATCH",
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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    let fieldName = "";

    if (id === "edit-lesson-title") fieldName = "title";
    else if (id === "edit-video-id") fieldName = "videoId";
    else if (id === "edit-image-name") fieldName = "imageName";
    else if (id === "edit-lesson-category") fieldName = "category";

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  }

  function handleCategoryChange(value: string) {
    setFormData((prev) => ({
      ...prev,
      category: value,
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
    setHasImageChanged(true);
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

    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage("Video file must be less than 100MB");
      return;
    }

    setErrorMessage("");
    setSelectedVideo(file);
    setHasVideoChanged(true);
  }

  function handleVideoTypeChange(newType: VideoType) {
    setVideoType(newType);
    setSelectedVideo(null);
    setHasVideoChanged(true);
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
      setHasImageChanged(true);
      setFormData((prev) => ({
        ...prev,
        imageName: "",
      }));
    } else {
      setScriptText("");
      setHasImageChanged(true);
    }
    setErrorMessage("");
  }

  function handleScriptTextChange(html: string) {
    const cleanHtml = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'span', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'mark'],
      ALLOWED_ATTR: ['style', 'data-color'],
    });
    setScriptText(cleanHtml);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!lesson) {
      setErrorMessage("No lesson selected");
      return;
    }

    // Validate title
    if (!formData.title) {
      setErrorMessage("Please enter a lesson title");
      return;
    }

    // Validate based on script type (only if changed or new)
    if (scriptType === 'image' && hasImageChanged && !selectedImage && !lesson.image) {
      setErrorMessage("Please select an image file");
      return;
    }

    if (scriptType === 'text' && !scriptText.trim()) {
      setErrorMessage("Please enter lesson script text");
      return;
    }

    // Validate based on video type (only if changed)
    if (videoType === 'youtube' && !formData.videoId) {
      setErrorMessage("Please enter a YouTube URL");
      return;
    }

    if (videoType === 'cloudinary' && hasVideoChanged && !selectedVideo && !lesson.cloudinary_public_id) {
      setErrorMessage("Please select a video file to upload");
      return;
    }

    setErrorMessage("");
    setIsUploading(true);

    try {
      const updateData: {
        title?: string;
        image?: string;
        scriptText?: string;
        scriptType?: ScriptType;
        videoType?: VideoType;
        videoId?: string;
        cloudinaryPublicId?: string;
        cloudinaryUrl?: string;
        category?: string;
        audioUrl?: string;
      } = {
        title: formData.title,
        scriptType: scriptType,
        videoType: videoType,
        category: formData.category || undefined,
      };

      // Handle script content based on type
      if (scriptType === 'image') {
        if (hasImageChanged && selectedImage) {
          // Upload new image
          const imageFormData = new FormData();
          imageFormData.append("image", selectedImage);
          imageFormData.append("imageName", formData.imageName);
          const imageUrl = await triggerImageUpload(imageFormData);
          updateData.image = imageUrl.imageUrl;
        }
        // Clear script text if switching from text to image
        updateData.scriptText = "";
      } else {
        // Use formatted text
        updateData.scriptText = scriptText;
      }

      if (videoType === 'youtube') {
        // Extract YouTube video ID
        const extractedVideoId = extractVideoId(formData.videoId);
        updateData.videoId = extractedVideoId || formData.videoId;
      } else if (hasVideoChanged && selectedVideo) {
        // Upload video to Cloudinary only if changed
        const videoFormData = new FormData();
        videoFormData.append("video", selectedVideo);
        videoFormData.append("fileName", formData.title);

        const videoResult = await triggerVideoUpload(videoFormData);
        updateData.cloudinaryPublicId = videoResult.publicId;
        updateData.cloudinaryUrl = videoResult.url;
        if (videoResult.audioUrl) {
          updateData.audioUrl = videoResult.audioUrl;
        }
      }

      // Update the lesson
      await triggerUpdateLesson(updateData);

      closeEditLessonDialog();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error updating lesson"
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
    hasVideoChanged,
    hasImageChanged,
    isMutatingLesson: isMutatingLesson || isUploading,
    handleInputChange,
    handleCategoryChange,
    handleImageUpload,
    handleVideoUpload,
    handleVideoTypeChange,
    handleScriptTypeChange,
    handleScriptTextChange,
    handleSubmit,
  };
}
