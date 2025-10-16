"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { AuthResponse } from "@/app/Types";

interface AddStudentProps {
  isAddStudentDialogOpen: boolean;
  closeAddStudentDialog: () => void;
}

export default function AddStudent({
  isAddStudentDialogOpen,
  closeAddStudentDialog,
}: AddStudentProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const { trigger, isMutating, error } = useSWRMutationHook<
    AuthResponse,
    { username: string; password: string }
  >(
    API_PATHS.USERS,
    { method: "POST" },
    {
      onSuccess: () => {
        mutate(API_PATHS.USERS);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }
    setErrorMessage("");
    const result = await trigger({
      username,
      password,
    });

    if (!result || error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error adding student"
      );
      return;
    }

    setUsername("");
    setPassword("");
    closeAddStudentDialog();
  };

  return (
    <ErrorBoundary
      fallback={
        <>
          <div>Something went wrong.</div>
        </>
      }
    >
      {" "}
      <StyledDialog
        open={isAddStudentDialogOpen}
        onClose={closeAddStudentDialog}
        aria-labelledby="add-student-dialog-title"
        disableScrollLock={true}
        keepMounted={false}
        disableRestoreFocus={true}
        disableEnforceFocus={true}
      >
        <DialogTitle
          id="add-student-dialog-title"
          sx={{
            fontWeight: 700,
            fontSize: "20px",
            color: "#1f2937",
            paddingBottom: "8px",
          }}
        >
          Add New Student
        </DialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setErrorMessage("");
                  setUsername(e.target.value);
                }}
                placeholder="Enter student username"
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder="Enter student password"
                autoComplete="new-password"
              />
            </div>
          </form>

          {errorMessage && <div>{errorMessage}</div>}
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="outlined" onClick={closeAddStudentDialog}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            disabled={isMutating}
          >
            {isMutating ? "Adding..." : "Add Student"}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}
