"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useAppContext } from "../AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AddStudentProps {
  isAddStudentDialogOpen: boolean;
  closeAddStudentDialog: () => void;
}

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(4px)",
  },
}));

const StyledDialogContent = styled(DialogContent)({
  padding: "24px",
  "& form": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  "& > form > div": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  "& label": {
    fontWeight: 600,
    color: "#374151",
    fontSize: "14px",
  },
  "& input": {
    padding: "12px 16px",
    border: "2px solid #e5e7eb",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "all 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
    },
    "&::placeholder": {
      color: "#9ca3af",
    },
  },
});

const StyledDialogActions = styled(DialogActions)({
  padding: "16px 24px",
  gap: "12px",
  justifyContent: "flex-end",
});

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "10px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "14px",
  ...(variant === "contained" && {
    backgroundColor: "#2563eb",
    boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)",
    "&:hover": {
      backgroundColor: "#1d4ed8",
      boxShadow: "0 6px 16px rgba(37, 99, 235, 0.5)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#d1d5db",
    color: "#6b7280",
    "&:hover": {
      borderColor: "#9ca3af",
      backgroundColor: "#f9fafb",
    },
  }),
}));

export default function AddStudent({
  isAddStudentDialogOpen,
  closeAddStudentDialog,
}: AddStudentProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { token } = useAppContext();

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
