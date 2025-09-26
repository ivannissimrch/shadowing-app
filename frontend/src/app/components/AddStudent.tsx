"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useAppContext } from "../AppContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import useAlertMessageStyles from "../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";

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
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInputsValid, setIsInputsValid] = useState(true);

  const { token } = useAppContext();
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      if (!username || !password) {
        setIsInputsValid(false);
        setIsSubmitting(false);
        return;
      }
      const response = await fetch(`${API_URL}/api/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
      const result = await response.json();

      if (result.success) {
        setUsername("");
        setPassword("");
        closeAddStudentDialog();
        setIsInputsValid(true);
        setIsSubmitting(false);
      } else {
        setIsError(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating student:", error);
      setIsError(true);
      setIsSubmitting(false);
    }
  };

  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
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
                  setIsError(false);
                  setIsInputsValid(true);
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
                  setIsError(false);
                  setIsInputsValid(true);
                }}
                placeholder="Enter student password"
                autoComplete="new-password"
              />
            </div>
          </form>

          {isError && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              An error occurred.
            </div>
          )}
          {!isInputsValid && (
            <div style={{ color: "red", marginBottom: "10px" }}>
              Please fill in all fields.
            </div>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="outlined" onClick={closeAddStudentDialog}>
            Cancel
          </StyledButton>
          <StyledButton variant="contained" onClick={handleSubmit}>
            {isSubmitting ? "Adding..." : "Add Student"}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}
