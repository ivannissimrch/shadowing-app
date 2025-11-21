"use client";
import TeacherLessonsList from "@/app/components/teacher/TeacherLessonsList";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense, use } from "react";
import StudentInfo from "@/app/components/student/StudentInfo";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import SkeletonLoader from "@/app/components/ui/SkeletonLoader";
import { API_PATHS } from "@/app/constants/apiKeys";
import { mutate } from "swr";

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
      <Suspense fallback={<SkeletonLoader />}>
        <StudentInfo id={id} />
        <TeacherLessonsList id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
