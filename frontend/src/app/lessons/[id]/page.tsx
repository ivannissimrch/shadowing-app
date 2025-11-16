"use client";
import { LessonPracticeView } from "@/app/components/lesson/LessonPracticeView";
import { ErrorBoundary } from "react-error-boundary";
import PracticePageSkeleton from "@/app/components/ui/PracticePageSkeleton";
import { Suspense, use } from "react";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "@/app/constants/apiKeys";

export default function Practice({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error Loading Lesson" />
      )}
      onReset={() => {
        mutate(API_PATHS.LESSON(id), undefined, { revalidate: true });
      }}
    >
      <Suspense fallback={<PracticePageSkeleton />}>
        <LessonPracticeView id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
