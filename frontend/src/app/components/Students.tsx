import styles from "./Students.module.css";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../components/SkeletonLoader";
import StudentList from "./StudentList";
import { Suspense } from "react";

export default function Students() {
  return (
    <ErrorBoundary
      fallback={
        <div className={styles.studentsGrid}>
          <h1>Error loading students</h1>
        </div>
      }
    >
      <Suspense fallback={<SkeletonLoader />}>
        <StudentList />
      </Suspense>
    </ErrorBoundary>
  );
}
