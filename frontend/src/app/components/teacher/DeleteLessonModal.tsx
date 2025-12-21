"use client";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { Lesson } from "@/app/Types";
import { useAlertContext } from "@/app/AlertContext";

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
  const { openAlertDialog } = useAlertContext();

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledErrorButton,
  } = useAlertMessageStyles();

  const { trigger } = useSWRMutationHook(API_PATHS.DELETE_LESSON(lessonId), {
    method: "DELETE",
  });

  const handleDelete = async () => {
    onClose();
    try {
      await mutate(
        API_PATHS.ALL_LESSONS,
        async (currentLessons: Lesson[] | undefined) => {
          await trigger(undefined);
          return (
            currentLessons?.filter((lesson) => lesson.id !== lessonId) ?? []
          );
        },
        {
          optimisticData: (currentLessons: Lesson[] | undefined) =>
            currentLessons?.filter((lesson) => lesson.id !== lessonId) ?? [],
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      openAlertDialog(
        "Delete Failed",
        `Could not delete "${lessonTitle}". Please check your connection and try again.`
      );
    }
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
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          Cancel
        </StyledButton>
        <StyledErrorButton
          variant="contained"
          onClick={handleDelete}
          aria-label={`Delete lesson ${lessonTitle}. This action cannot be undone.`}
        >
          Delete Lesson
        </StyledErrorButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
