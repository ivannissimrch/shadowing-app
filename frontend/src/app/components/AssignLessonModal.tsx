"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AssignLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  lessonTitle: string;
}

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fefefe",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(224, 242, 254, 0.8)",
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
    backgroundColor: "#0ea5e9",
    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)",
    "&:hover": {
      backgroundColor: "#0284c7",
      boxShadow: "0 6px 16px rgba(14, 165, 233, 0.5)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#bae6fd",
    color: "#6b7280",
    "&:hover": {
      borderColor: "#7dd3fc",
      backgroundColor: "#f0f9ff",
    },
  }),
}));

const StyledFormControl = styled(FormControl)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#bae6fd",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#7dd3fc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0ea5e9",
      boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#374151",
    fontWeight: 600,
    "&.Mui-focused": {
      color: "#0ea5e9",
    },
  },
});

export default function AssignLessonModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}: AssignLessonModalProps) {
  const { token } = useAppContext();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState<number | "">("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadStudents() {
      if (!token || !isOpen) return;

      try {
        const response = await fetch(`${API_URL}/api/users`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setStudents(result.data || []);
      } catch (error) {
        console.error("Error loading students:", error);
        alert("Failed to load students");
      }
    }

    loadStudents();
  }, [token, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      alert("Please log in first");
      return;
    }

    if (!selectedStudent) {
      alert("Please select a student");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/lessons/${lessonId}/assign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: selectedStudent,
        }),
      });

      if (response.ok) {
        setSelectedStudent("");
        onClose();
        alert("Lesson assigned successfully!");
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || "Failed to assign lesson"}`);
      }
    } catch (error) {
      console.error("Error assigning lesson:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="assign-lesson-dialog-title"
      disableScrollLock={true}
      keepMounted={false}
      disableRestoreFocus={true}
      disableEnforceFocus={true}
    >
      <DialogTitle
        id="assign-lesson-dialog-title"
        sx={{
          fontWeight: 700,
          fontSize: "20px",
          color: "#1f2937",
          paddingBottom: "8px",
        }}
      >
        Assign Lesson: {lessonTitle}
      </DialogTitle>
      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          <div>
            <StyledFormControl fullWidth>
              <InputLabel id="student-select-label">Select Student</InputLabel>
              <Select
                labelId="student-select-label"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value as number)}
                label="Select Student"
              >
                {students.map((student: { id: number; username: string }) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.username}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </div>
        </form>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedStudent}
        >
          {isSubmitting ? "Assigning..." : "Assign Lesson"}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}