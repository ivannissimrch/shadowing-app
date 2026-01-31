"use client";
import TeacherLessonDetails from "@/app/components/teacher/TeacherLessonDetails";
import { ErrorBoundary } from "react-error-boundary";
import { use } from "react";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import { mutate } from "swr/_internal";
import { API_PATHS } from "@/app/constants/apiKeys";
import Transitions from "@/app/components/ui/Transitions";

export interface StudentLessonPageProps {
  params: Promise<{ studentId: string; lessonId: string }>;
}

export default function StudentLessonPage({ params }: StudentLessonPageProps) {
  const data = use(params);
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback
          {...props}
          title="Something went wrong loading the lesson"
        />
      )}
      onReset={() => {
        mutate(
          API_PATHS.TEACHER_STUDENT_LESSON(data.studentId, data.lessonId),
          undefined,
          {
            revalidate: true,
          }
        );
      }}
    >
      <Transitions type="fade">
        <TeacherLessonDetails idInfo={data} />
      </Transitions>
    </ErrorBoundary>
  );
}
