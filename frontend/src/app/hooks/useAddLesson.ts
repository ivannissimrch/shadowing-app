"use client";
import { useState } from "react";
import extractVideoId from "./../helpers/extractVideoId";
import { mutate } from "swr";
import { API_PATHS } from "./../constants/apiKeys";
import { LessonResponse, ImageResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";

export default function useAddLesson(closeAddLessonDialog: () => void) {
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    videoId: "",
    imageName: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const { trigger: triggerLesson, isMutating: isMutatingLesson } =
    useSWRMutationHook<
      LessonResponse,
      {
        title: string;
        image: string;
        videoId: string;
      }
    >(
      API_PATHS.LESSONS,
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formData.title || !formData.videoId || !selectedImage) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setErrorMessage("");

    try {
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage);
      imageFormData.append("imageName", formData.imageName);
      const imageUrl = await triggerImageUpload(imageFormData);

      const videoId = extractVideoId(formData.videoId);
      await triggerLesson({
        title: formData.title,
        image: imageUrl.imageUrl,
        videoId: videoId || "",
      });

      setFormData({
        title: "",
        videoId: "",
        imageName: "",
      });
      setSelectedImage(null);
      closeAddLessonDialog();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Error adding lesson"
      );
    }
  }

  return {
    errorMessage,
    formData,
    selectedImage,
    isMutatingLesson,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  };
}
