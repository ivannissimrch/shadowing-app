"use client";
import { LessonPracticeView } from "@/app/components/lesson/LessonPracticeView";
import { ErrorBoundary } from "react-error-boundary";
import PracticePageSkeleton from "@/app/components/ui/PracticePageSkeleton";
import { Suspense, use } from "react";
import ErrorFallback from "@/app/components/ui/ErrorFallback";

export default function Practice({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <ErrorBoundary fallbackRender={(props) => <ErrorFallback {...props} />}>
      <Suspense fallback={<PracticePageSkeleton />}>
        <LessonPracticeView id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
