"use client";
import DialogTitle from "@mui/material/DialogTitle";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { Student } from "@/app/Types";
import { useAlertContext } from "@/app/AlertContext";

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
  const { openAlertDialog } = useAlertContext();

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
      openAlertDialog(
        "Delete Failed",
        `Could not delete "${studentUsername}". Please check your connection and try again.`
      );
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
          fontWeight: 700,
          fontSize: "20px",
          color: "#1f2937",
          paddingBottom: "8px",
        }}
      >
        Delete Student
      </DialogTitle>
      <StyledDialogContent>
        <p>
          Are you sure you want to delete the student{" "}
          <strong>{studentUsername}</strong>? This action cannot be undone.
        </p>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          Cancel
        </StyledButton>
        <StyledErrorButton
          variant="contained"
          onClick={handleDelete}
          aria-label={`Delete student ${studentUsername}. This action cannot be undone.`}
        >
          Delete Student
        </StyledErrorButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
