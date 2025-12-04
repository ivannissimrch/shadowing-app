"use client";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import styles from "./AddLesson.module.css";
import useAddLesson from "../../hooks/useAddLesson";

interface AddLessonProps {
  isAddLessonDialogOpen: boolean;
  closeAddLessonDialog: () => void;
}

export default function AddLesson({
  isAddLessonDialogOpen,
  closeAddLessonDialog,
}: AddLessonProps) {
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const {
    errorMessage,
    formData,
    selectedImage,
    isMutatingLesson,
    handleInputChange,
    handleImageUpload,
    handleSubmit,
  } = useAddLesson(closeAddLessonDialog);

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <StyledDialog
        aria-modal="true"
        open={isAddLessonDialogOpen}
        onClose={closeAddLessonDialog}
        aria-labelledby="add-lesson-dialog-title"
        disableScrollLock={true}
        keepMounted={false}
        autoFocus={true}
      >
        <DialogTitle
          id="add-lesson-dialog-title"
          className={styles["dialog-title"]}
        >
          Add New Lesson
        </DialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="lesson-title">Lesson Title</label>
              <input
                id="lesson-title"
                type="text"
                placeholder="Enter lesson title"
                required
                aria-required="true"
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "add-lesson-error" : undefined}
                value={formData.title}
                onChange={handleInputChange}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="video-id">YouTube Video URL </label>
              <input
                id="video-id"
                type="text"
                placeholder="Enter YouTube video url "
                required
                aria-required="true"
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "add-lesson-error" : undefined}
                value={formData.videoId}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="image-upload">Upload Image </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                required
                aria-required="true"
                onChange={handleImageUpload}
                className={styles["visually-hidden"]}
              />
              <label
                htmlFor="image-upload"
                className={`${styles["file-upload-button"]} ${
                  selectedImage
                    ? styles["file-upload-button--selected"]
                    : styles["file-upload-button--empty"]
                }`}
              >
                {selectedImage ? selectedImage.name : "Choose an image file..."}
              </label>
            </div>
            {errorMessage && (
              <div
                id="add-lesson-error"
                role="alert"
                aria-live="assertive"
                className={styles["error-message"]}
              >
                {errorMessage}
              </div>
            )}
          </form>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="outlined" onClick={closeAddLessonDialog}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            onClick={handleSubmit}
            disabled={isMutatingLesson}
          >
            {isMutatingLesson ? "Adding..." : "Add Lesson"}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}
