"use client";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { useModalState } from "@/app/hooks/useModalState";

interface UnassignLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
  studentId: string;
  studentName: string;
}

export default function UnassignLessonModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
  studentId,
  studentName,
}: UnassignLessonModalProps) {
  // const [errorMessage, setErrorMessage] = useState("");
  const modalState = useModalState();
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const { trigger, isMutating, error } = useSWRMutationHook(
    API_PATHS.UNASSIGN_LESSON(lessonId, studentId),
    { method: "DELETE" },
    {
      onSuccess: () => {
        mutate(API_PATHS.TEACHER_STUDENT_LESSONS(studentId));
      },
    }
  );

  async function handleUnassign() {
    modalState.clearError();

    const response = await trigger({});

    if (!response || error) {
      modalState.setError(
        error instanceof Error ? error.message : "Error removing lesson"
      );
      return;
    }

    onClose();
  }

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="unassign-lesson-dialog-title"
      aria-modal="true"
      autoFocus={true}
      disableScrollLock={true}
      keepMounted={false}
    >
      <DialogTitle
        id="unassign-lesson-dialog-title"
        sx={{
          fontWeight: 700,
          fontSize: "20px",
          color: "#1f2937",
          paddingBottom: "8px",
        }}
      >
        Remove Lesson?
      </DialogTitle>
      <StyledDialogContent>
        <p>
          Are you sure you want to remove <strong>{lessonTitle}</strong> from{" "}
          <strong>{studentName}</strong>?
        </p>
        <p style={{ marginTop: "8px", color: "#6b7280", fontSize: "14px" }}>
          This will remove the lesson from the student&apos;s dashboard. Their
          progress will not be deleted.
        </p>
        {modalState.state.errorMessage && (
          <p
            role="alert"
            aria-live="assertive"
            style={{ color: "#ef4444", marginTop: "8px" }}
          >
            {modalState.state.errorMessage}
          </p>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleUnassign}
          disabled={isMutating}
          aria-label={`Remove lesson "${lessonTitle}" from ${studentName}`}
          sx={{
            backgroundColor: "#ef4444",
            "&:hover": {
              backgroundColor: "#dc2626",
            },
          }}
        >
          {isMutating ? "Removing..." : "Remove"}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
