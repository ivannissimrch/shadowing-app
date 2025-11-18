"use client";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../ui/SkeletonLoader";
import StudentList from "./StudentList";
import { Suspense } from "react";
import ErrorFallback from "../ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";

export default function Students() {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error loading students" />
      )}
      onReset={() => {
        mutate(API_PATHS.USERS, undefined, { revalidate: true });
      }}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <StudentList />
      </Suspense>
    </ErrorBoundary>
  );
}
