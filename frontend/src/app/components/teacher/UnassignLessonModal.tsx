"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { Lesson } from "@/app/Types";
import { useAlertContext } from "@/app/AlertContext";

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
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { openAlertDialog } = useAlertContext();

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledErrorButton,
  } = useAlertMessageStyles();

  const { trigger } = useSWRMutationHook(
    API_PATHS.UNASSIGN_LESSON(lessonId, studentId),
    { method: "DELETE" }
  );

  const handleUnassign = async () => {
    onClose();
    try {
      await mutate(
        API_PATHS.TEACHER_STUDENT_LESSONS(studentId),
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
        tErrors("failedToDelete"),
        t("couldNotRemoveLesson", { title: lessonTitle, name: studentName })
      );
    }
  };

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
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("removeLesson")}
      </DialogTitle>
      <StyledDialogContent>
        <p>
          {t("confirmRemoveLessonMessage", { title: lessonTitle, name: studentName })}
        </p>
        <p style={{ marginTop: "8px", color: "#697586", fontSize: "14px" }}>
          {t("removeLessonNote")}
        </p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledErrorButton
          variant="contained"
          onClick={handleUnassign}
          aria-label={`${t("removeLesson")} "${lessonTitle}"`}
        >
          {t("remove")}
        </StyledErrorButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
