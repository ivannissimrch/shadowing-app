"use client";
import TeacherLessonDetails from "@/app/components/TeacherLessonDetails";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { use } from "react";
import ErrorFallback from "@/app/components/ErrorFallback";

export interface StudentLessonPageProps {
  params: Promise<{ studentId: string; lessonId: string }>;
}

export default function StudentLessonPage({ params }: StudentLessonPageProps) {
  const data = use(params);
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Something went wrong loading the lesson" />
      )}
    >
      <Suspense fallback={<div>Loading lesson...</div>}>
        <TeacherLessonDetails idInfo={data} />
      </Suspense>
    </ErrorBoundary>
  );
}
