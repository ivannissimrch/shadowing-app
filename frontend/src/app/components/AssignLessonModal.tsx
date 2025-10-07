"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useAlertMessageStyles from "../hooks/useAlertMessageStyles";
import StudentSelect from "./StudentSelect";
import SkeletonLoader from "./SkeletonLoader";
import { mutate } from "swr";
import api from "../helpers/axiosFetch";
import { API_PATHS, API_KEYS } from "../constants/apiKeys";

interface AssignLessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  lessonId: string;
  lessonTitle: string;
}

export default function AssignLessonModal({
  isOpen,
  onClose,
  lessonId,
  lessonTitle,
}: AssignLessonModalProps) {
  const [selectedStudent, setSelectedStudent] = useState<string | "">("");
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

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await api.post(API_PATHS.ASSIGN_LESSON(lessonId), {
        studentId: selectedStudent,
      });

      if (response.data.success) {
        setSelectedStudent("");
        onClose();
        await mutate(API_KEYS.LESSONS);
        //latter on add a success message with a toast
      }
    } catch (error: unknown) {
      setErrorMessage((error as Error).message || "Error assigning lesson");
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
