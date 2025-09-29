"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useAppContext } from "../AppContext";
import useAlertMessageStyles from "../hooks/useAlertMessageStyles";
import StudentSelect from "./StudentSelect";
import SkeletonLoader from "./SkeletonLoader";

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
            <ErrorBoundary fallback={<div>Error loading students</div>}>
              <Suspense fallback={<SkeletonLoader />}>
                <StudentSelect
                  selectedStudent={selectedStudent}
                  onStudentChange={setSelectedStudent}
                  StyledFormControl={StyledFormControl}
                />
              </Suspense>
            </ErrorBoundary>
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
