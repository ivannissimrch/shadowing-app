"use client";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../ui/SkeletonLoader";
import StudentList from "./StudentList";
import { Suspense } from "react";
import ErrorFallback from "../ui/ErrorFallback";

export default function Students() {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error loading students" />
      )}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <StudentList />
      </Suspense>
    </ErrorBoundary>
  );
}
