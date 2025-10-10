"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import extractVideoId from "../../helpers/extractVideoId";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import api from "../../helpers/axiosFetch";
import { API_PATHS, API_KEYS } from "../../constants/apiKeys";

interface AddLessonProps {
  isAddLessonDialogOpen: boolean;
  closeAddLessonDialog: () => void;
}

export default function AddLesson({
  isAddLessonDialogOpen,
  closeAddLessonDialog,
}: AddLessonProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    videoId: "",
    imageName: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let fieldName = "";

    if (id === "lesson-title") fieldName = "title";
    else if (id === "video-id") fieldName = "videoId";
    else if (id === "image-name") fieldName = "imageName";

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const fileName = file.name.split(".")[0]; // Get name without extension
      setFormData((prev) => ({
        ...prev,
        imageName: fileName,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate BEFORE setting loading state
    if (!formData.title || !formData.videoId || !selectedImage) {
      setErrorMessage("Please fill in all required fields");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // First, upload the image
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage);
      imageFormData.append("imageName", formData.imageName);

      // Pass FormData directly as 2nd argument (not wrapped in object!)
      const imageResponse = await api.post(
        API_PATHS.UPLOAD_IMAGE,
        imageFormData
      );

      const videoId = extractVideoId(formData.videoId);

      const response = await api.post(API_PATHS.LESSONS, {
        title: formData.title,
        image: imageResponse.data.imageUrl,
        videoId: videoId,
      });

      if (response.data.success) {
        setFormData({
          title: "",
          videoId: "",
          imageName: "",
        });
        setSelectedImage(null);
        closeAddLessonDialog();
        await mutate(API_PATHS.ALL_LESSONS);
      }
    } catch (error: unknown) {
      setErrorMessage((error as Error).message || "Error adding lesson");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <StyledDialog
        open={isAddLessonDialogOpen}
        onClose={closeAddLessonDialog}
        aria-labelledby="add-lesson-dialog-title"
        disableScrollLock={true}
        keepMounted={false}
        disableRestoreFocus={true}
        disableEnforceFocus={true}
      >
        <DialogTitle
          id="add-lesson-dialog-title"
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            color: "#1f2937",
            paddingBottom: "8px",
          }}
        >
          Add New Lesson
        </DialogTitle>
        {/* create separate component for form ? */}
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="lesson-title">Lesson Title *</label>
              <input
                id="lesson-title"
                type="text"
                placeholder="Enter lesson title"
                required
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="video-id">YouTube Video URL *</label>
              <input
                id="video-id"
                type="text"
                placeholder="Enter YouTube video url "
                required
                value={formData.videoId}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="image-upload">Upload Image *</label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                required
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <label
                htmlFor="image-upload"
                style={{
                  display: "inline-block",
                  padding: "12px 16px",
                  border: "2px solid #bae6fd",
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "#ffffff",
                  color: selectedImage ? "#374151" : "#9ca3af",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  width: "100%",
                  textAlign: "center" as const,
                }}
              >
                {selectedImage ? selectedImage.name : "Choose an image file..."}
              </label>
              {selectedImage && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "14px",
                    color: "#6b7280",
                  }}
                >
                  Image name will be: {formData.imageName}
                </div>
              )}
            </div>
            {errorMessage && <div>{errorMessage}</div>}
          </form>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="outlined" onClick={closeAddLessonDialog}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Lesson"}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}
