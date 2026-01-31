"use client";
import TeacherLessonsList from "@/app/components/teacher/TeacherLessonsList";
import { ErrorBoundary } from "react-error-boundary";
import { use } from "react";
import StudentInfo from "@/app/components/student/StudentInfo";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import { API_PATHS } from "@/app/constants/apiKeys";
import { mutate } from "swr";
import Transitions from "@/app/components/ui/Transitions";
import Box from "@mui/material/Box";

interface StudentPageProps {
  params: Promise<{ studentId: string }>;
}

export default function StudentPage({ params }: StudentPageProps) {
  const { studentId: id } = use(params);

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Failed to load student details" />
      )}
      onReset={() => {
        mutate(API_PATHS.TEACHER_STUDENT(id), undefined, { revalidate: true });
        mutate(API_PATHS.TEACHER_STUDENT_LESSONS(id), undefined, {
          revalidate: true,
        });
      }}
    >
      <Transitions type="fade">
        <Box>
          <StudentInfo id={id} />
          <TeacherLessonsList id={id} />
        </Box>
      </Transitions>
    </ErrorBoundary>
  );
}
