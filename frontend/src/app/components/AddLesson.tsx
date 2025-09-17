"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useAppContext } from "../AppContext";
import extractVideoId from "../helpers/extractVideoId";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AddLessonProps {
  isAddLessonDialogOpen: boolean;
  closeAddLessonDialog: () => void;
}

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fefefe",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(224, 242, 254, 0.8)",
    backdropFilter: "blur(4px)",
  },
}));

const StyledDialogContent = styled(DialogContent)({
  padding: "24px",
  "& form": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  "& > form > div": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  "& label": {
    fontWeight: 600,
    color: "#374151",
    fontSize: "14px",
  },
  "& input": {
    padding: "12px 16px",
    border: "2px solid #bae6fd",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#374151",
    transition: "all 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#0ea5e9",
      boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
    },
    "&::placeholder": {
      color: "#9ca3af",
    },
  },
});

const StyledDialogActions = styled(DialogActions)({
  padding: "16px 24px",
  gap: "12px",
  justifyContent: "flex-end",
});

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "10px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "14px",
  ...(variant === "contained" && {
    backgroundColor: "#0ea5e9",
    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)",
    "&:hover": {
      backgroundColor: "#0284c7",
      boxShadow: "0 6px 16px rgba(14, 165, 233, 0.5)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#bae6fd",
    color: "#6b7280",
    "&:hover": {
      borderColor: "#7dd3fc",
      backgroundColor: "#f0f9ff",
    },
  }),
}));

export default function AddLesson({
  isAddLessonDialogOpen,
  closeAddLessonDialog,
}: AddLessonProps) {
  const { token } = useAppContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    videoId: "",
    imageName: "",
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

    if (!token) {
      alert("Please log in first");
      return;
    }

    if (!formData.title || !formData.videoId || !selectedImage) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // First, upload the image
      const imageFormData = new FormData();
      imageFormData.append("image", selectedImage);
      imageFormData.append("imageName", formData.imageName);

      const imageResponse = await fetch(`${API_URL}/api/upload-image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: imageFormData,
      });

      if (!imageResponse.ok) {
        const imageError = await imageResponse.json();
        throw new Error(`Image upload failed: ${imageError.message}`);
      }

      const imageResult = await imageResponse.json();

      // Then create the lesson with the uploaded image name
      const videoId = extractVideoId(formData.videoId);

      const response = await fetch(`${API_URL}/api/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          image: imageResult.imageName,
          videoId: videoId,
          audioFile: "",
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          title: "",

          videoId: "",
          imageName: "",
        });
        setSelectedImage(null);
        closeAddLessonDialog();
        alert("Lesson added successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to add lesson"}`);
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
                style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}
              >
                Image name will be: {formData.imageName}
              </div>
            )}
          </div>
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
  );
}
