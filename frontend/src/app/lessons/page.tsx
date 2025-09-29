import styles from "./page.module.css";
import StudentLessons from "../components/StudentLessons";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../components/SkeletonLoader";
import { Suspense } from "react";

export default function Lessons() {
  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <ErrorBoundary
        fallback={
          <div className={styles["cards-container"]}>
            <h1>Error Loading Lessons</h1>
          </div>
        }
      >
        <Suspense fallback={<SkeletonLoader />}>
          <StudentLessons />
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
