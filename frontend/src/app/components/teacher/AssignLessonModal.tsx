"use client";
import DialogTitle from "@mui/material/DialogTitle";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import StudentSelect from "../student/StudentSelect";
import SkeletonLoader from "../ui/SkeletonLoader";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";
import { AssignmentResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";

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
  const [errorMessage, setErrorMessage] = useState("");
  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
  } = useAlertMessageStyles();
  const { trigger, isMutating, error } = useSWRMutationHook<
    AssignmentResponse,
    { studentId: string }
  >(
    API_PATHS.ASSIGN_LESSON(lessonId),
    { method: "POST" },
    {
      onSuccess: () => {
        mutate(API_PATHS.LESSONS);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");

    const response = await trigger({
      studentId: selectedStudent,
    });

    if (!response || error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Error assigning lesson"
      );
      return;
    }

    setSelectedStudent("");
    onClose();
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="assign-lesson-dialog-title"
      aria-modal="true"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
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
          {errorMessage && (
            <p
              role="alert"
              aria-live="assertive"
              style={{ color: "red", marginTop: "8px" }}
            >
              {errorMessage}
            </p>
          )}
        </form>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          Cancel
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isMutating || !selectedStudent}
          aria-label={`Assign lesson "${lessonTitle}" to selected student`}
        >
          {isMutating ? "Assigning..." : "Assign Lesson"}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
