"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import api from "../../helpers/axiosFetch";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post<AuthResponse>(API_PATHS.USERS, {
        username,
        password,
      });

      if (response.data.success) {
        setUsername("");
        setPassword("");
        closeAddStudentDialog();
        await mutate(API_PATHS.USERS);
      }
    } catch (error) {
      setErrorMessage((error as Error).message || "Error adding student");
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Student"}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}
