"use client";
import styles from "./StudentLessons.module.css";
import Card from "../components/Card";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "./SkeletonLoader";
import useFetchData from "../hooks/useFetchData";
import { Lesson } from "../Types";

export default function StudentLessons() {
  const { data, isLoading, error } = useFetchData("/api/lessons");
  const lessons: Lesson[] = Array.isArray(data) ? data : [];

  if (isLoading) return <SkeletonLoader />;
  if (error)
    return (
      <div className={styles["cards-container"]}>
        <h1>Error Loading Lessons</h1>
      </div>
    );
  if (lessons.length === 0)
    return (
      <div className={styles["cards-container"]}>No lessons available</div>
    );

  return (
    <ErrorBoundary
      fallback={
        <div className={styles["cards-container"]}>
          <h1>Error Loading Lessons</h1>
        </div>
      }
    >
      <div className={styles["cards-container"]}>
        {lessons.map((currentLesson) => (
          <Card key={currentLesson.title} currentLesson={currentLesson} />
        ))}
      </div>
    </ErrorBoundary>
  );
}
