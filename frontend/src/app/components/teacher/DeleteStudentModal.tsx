"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";

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
  const [errorMessage, setErrorMessage] = useState("");

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const { trigger, isMutating, error } = useSWRMutationHook(
    API_PATHS.USER(studentId),
    { method: "DELETE" },
    {
      onSuccess: () => {
        mutate(API_PATHS.USERS);
      },
    }
  );

  const handleDelete = async () => {
    setErrorMessage("");

    await trigger(undefined);

    if (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error deleting student"
      );
      return;
    }

    onClose();
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
        {errorMessage && (
          <p
            style={{ color: "red", marginTop: "8px" }}
            role="alert"
            aria-live="assertive"
          >
            {errorMessage}
          </p>
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
          aria-label={`Delete student ${studentUsername}. This action cannot be undone.`}
          sx={{
            backgroundColor: "#dc2626",
            "&:hover": {
              backgroundColor: "#b91c1c",
            },
          }}
        >
          {isMutating ? "Deleting..." : "Delete Student"}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
