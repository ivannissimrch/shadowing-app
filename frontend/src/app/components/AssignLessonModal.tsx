"use client";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import useAlertMessageStyles from "../hooks/useAlertMessageStyles";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AssignLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: number;
  lessonTitle: string;
}

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
  const [errorMessage, setErrorMessage] = useState("");

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
  } = useAlertMessageStyles();

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
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        const result = await response.json();
        setStudents(result.data || []);
      } catch (error) {
        console.error("Error loading students:", error);
        setErrorMessage("Failed to load students");
      }
    }

    loadStudents();
  }, [token, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Please log in first");
      return;
    }

    if (!selectedStudent) {
      setErrorMessage("Please select a student");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${API_URL}/api/lessons/${lessonId}/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentId: selectedStudent,
          }),
        }
      );

      if (response.ok) {
        setSelectedStudent("");
        onClose();
        //Add success message or notification here if needed
      } else {
        const error = await response.json();
        setErrorMessage(`Error: ${error.message || "Failed to assign lesson"}`);
      }
    } catch (error) {
      console.error("Error assigning lesson:", error);
      setErrorMessage("Network error. Please try again.");
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
          {errorMessage && <p>{errorMessage}</p>}
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
