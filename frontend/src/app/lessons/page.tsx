"use client";
import styles from "./page.module.css";
import StudentLessons from "../components/StudentLessons";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../components/SkeletonLoader";
import { Suspense } from "react";
import ErrorFallback from "../components/ErrorFallback";

export default function Lessons() {
  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <ErrorBoundary
        fallbackRender={(props) => (
          <ErrorFallback {...props} title="Error Loading Lessons" />
        )}
      >
        <Suspense fallback={<SkeletonLoader />}>
          <StudentLessons />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
