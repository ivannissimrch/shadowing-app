"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import { useAppContext } from "../AppContext";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import useAlertMessageStyles from "../hooks/useAlertMessageStyles";

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
  const [error, setError] = useState("");
  const { token } = useAppContext();
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setError("");

    try {
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
      } else {
        setError(result.message || "Failed to create student");
      }
    } catch (error) {
      console.error("Error creating student:", error);
      setError("Network error. Please try again.");
    }
  };

  return (
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
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter student username"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter student password"
            />
          </div>

          {error && <div>{error}</div>}
        </form>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={closeAddStudentDialog}>
          Cancel
        </StyledButton>
        <StyledButton variant="contained" onClick={handleSubmit}>
          Add Student
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
