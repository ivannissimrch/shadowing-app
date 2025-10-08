"use client";
import TeacherLessonsList from "@/app/components/teacher/TeacherLessonsList";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, use } from "react";
import StudentInfo from "@/app/components/student/StudentInfo";
import ErrorFallback from "@/app/components/ui/ErrorFallback";

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
    >
      <Suspense fallback={<div>Loading student details...</div>}>
        <StudentInfo id={id} />
        <TeacherLessonsList id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
