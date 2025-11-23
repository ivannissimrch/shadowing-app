"use client";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { useModalState } from "@/app/hooks/useModalState";

interface DeleteLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
}

export default function DeleteLessonModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}: DeleteLessonModalProps) {
  const modalState = useModalState();

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const { trigger, isMutating, error } = useSWRMutationHook(
    API_PATHS.LESSON(lessonId),
    { method: "DELETE" },
    {
      onSuccess: () => {
        mutate(API_PATHS.ALL_LESSONS);
      },
    }
  );

  const handleDelete = async () => {
    modalState.clearError();
    await trigger(undefined);

    if (error) {
      modalState.setError(
        error instanceof Error ? error.message : "Error deleting lesson"
      );
      return;
    }
    onClose();
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-lesson-dialog-title"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
      aria-modal="true"
    >
      <DialogTitle
        id="delete-lesson-dialog-title"
        sx={{
          fontWeight: 700,
          fontSize: "20px",
          color: "#1f2937",
          paddingBottom: "8px",
        }}
      >
        Delete Lesson
      </DialogTitle>
      <StyledDialogContent>
        <p>
          Are you sure you want to delete the lesson{" "}
          <strong>{lessonTitle}</strong>? This action cannot be undone and will
          remove all student assignments.
        </p>
        {modalState.state.errorMessage && (
          <div
            style={{ color: "red", marginTop: "8px" }}
            role="alert"
            aria-live="assertive"
          >
            {modalState.state.errorMessage}
          </div>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleDelete}
          disabled={isMutating}
          aria-label={`Delete lesson ${lessonTitle}. This action cannot be undone.`}
          sx={{
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
        >
          {isMutating ? "Deleting..." : "Delete Lesson"}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
