"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { Lesson } from "@/app/Types";
import { useSnackbar } from "@/app/SnackbarContext";

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
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const { showSnackbar } = useSnackbar();

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
      showSnackbar(t("couldNotDeleteLesson", { title: lessonTitle }), "error");
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
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("deleteLesson")}
      </DialogTitle>
      <StyledDialogContent>
        <p>
          {t("confirmDeleteLessonMessage", { title: lessonTitle })}
        </p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledErrorButton
          variant="contained"
          onClick={handleDelete}
          aria-label={`${t("deleteLesson")} ${lessonTitle}`}
        >
          {t("deleteLesson")}
        </StyledErrorButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
