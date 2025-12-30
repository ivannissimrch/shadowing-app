"use client";
import styles from "./page.module.css";
import StudentLessons from "../../components/student/StudentLessons";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import { Suspense } from "react";
import ErrorFallback from "../../components/ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";

export default function Lessons() {
  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <ErrorBoundary
        fallbackRender={(props) => (
          <ErrorFallback {...props} title="Error Loading Lessons" />
        )}
        onReset={() => {
          mutate(API_PATHS.LESSONS, undefined, { revalidate: true });
        }}
      >
        <Suspense fallback={<SkeletonLoader />}>
          <StudentLessons />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
