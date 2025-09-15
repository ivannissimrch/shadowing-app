"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useAppContext } from "../AppContext";

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
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "all 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
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
    backgroundColor: "#2563eb",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
    "&:hover": {
      backgroundColor: "#1d4ed8",
      boxShadow: "0 6px 16px rgba(37, 99, 235, 0.5)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#d1d5db",
    color: "#6b7280",
    "&:hover": {
      borderColor: "#9ca3af",
      backgroundColor: "#f9fafb",
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
    lessonId: "",
    videoId: "",
    imageName: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    let fieldName = "";

    if (id === "lesson-title") fieldName = "title";
    else if (id === "lesson-id") fieldName = "lessonId";
    else if (id === "video-id") fieldName = "videoId";
    else if (id === "image-name") fieldName = "imageName";

    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in first");
      return;
    }

    if (
      !formData.title ||
      !formData.lessonId ||
      !formData.videoId ||
      !formData.imageName
    ) {
      alert("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/lessons`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          lessonId: formData.lessonId,
          title: formData.title,
          image: formData.imageName,
          videoId: formData.videoId,
          audioFile: "", // Empty as per backend expectation
        }),
      });

      if (response.ok) {
        // Reset form
        setFormData({
          title: "",
          lessonId: "",
          videoId: "",
          imageName: "",
        });
        closeAddLessonDialog();
        alert("Lesson added successfully!");
        // Optionally refresh the page or update the lessons list
        window.location.reload();
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
            <label htmlFor="lesson-id">Lesson ID *</label>
            <input
              id="lesson-id"
              type="text"
              placeholder="Enter unique lesson ID (e.g., 118)"
              required
              value={formData.lessonId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="video-id">YouTube Video ID *</label>
            <input
              id="video-id"
              type="text"
              placeholder="Enter YouTube video ID (e.g., dQw4w9WgXcQ)"
              required
              value={formData.videoId}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="image-name">Image Name *</label>
            <input
              id="image-name"
              type="text"
              placeholder="Enter image name (e.g., 118)"
              required
              value={formData.imageName}
              onChange={handleInputChange}
            />
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
