"use client";
import { LessonPracticeView } from "@/app/components/LessonPracticeView";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { Suspense, use } from "react";
import ErrorFallback from "@/app/components/ErrorFallback";

export default function Practice({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return (
    <ErrorBoundary
      fallbackRender={(props) => <ErrorFallback {...props} />}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <LessonPracticeView id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
