"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { Student } from "@/app/Types";
import { useSnackbar } from "@/app/SnackbarContext";

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentUsername: string;
}

export default function DeleteStudentModal({
  isOpen,
  onClose,
  studentId,
  studentUsername,
}: DeleteStudentModalProps) {
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

  const { trigger } = useSWRMutationHook(API_PATHS.USER(studentId), {
    method: "DELETE",
  });

  const handleDelete = async () => {
    onClose();
    try {
      await mutate(
        API_PATHS.USERS,
        async (currentStudents: Student[] | undefined) => {
          await trigger(undefined);
          return (
            currentStudents?.filter((student) => student.id !== studentId) ?? []
          );
        },
        {
          optimisticData: (currentStudents: Student[] | undefined) =>
            currentStudents?.filter((student) => student.id !== studentId) ?? [],
          rollbackOnError: true,
          revalidate: false,
        }
      );
    } catch {
      showSnackbar(t("couldNotDeleteStudent", { name: studentUsername }), "error");
    }
  };

  return (
    <StyledDialog
      aria-modal="true"
      open={isOpen}
      onClose={onClose}
      aria-labelledby="delete-student-dialog-title"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
    >
      <DialogTitle
        id="delete-student-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("deleteStudent")}
      </DialogTitle>
      <StyledDialogContent>
        <p>
          {t("confirmDeleteStudentMessage", { name: studentUsername })}
        </p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledErrorButton
          variant="contained"
          onClick={handleDelete}
          aria-label={`${t("deleteStudent")} ${studentUsername}`}
        >
          {t("deleteStudent")}
        </StyledErrorButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
