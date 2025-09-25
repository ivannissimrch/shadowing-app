"use client";
import styles from "./StudentLessons.module.css";
import Card from "../components/Card";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "./SkeletonLoader";
import { useAppContext } from "../AppContext";
import useFetchData from "../hooks/useFetchData";
import { Lesson } from "../Types";

export default function StudentLessons() {
  const { data, isLoading, error } = useFetchData("/api/lessons");
  const lessons: Lesson[] = Array.isArray(data) ? data : [];
  const { openAlertDialog } = useAppContext();

  if (isLoading) return <SkeletonLoader />;
  if (error)
    openAlertDialog("Error fetching lessons", "Error fetching lessons");
  if (lessons.length === 0)
    return (
      <div className={styles["cards-container"]}>No lessons available</div>
    );

  return (
    <ErrorBoundary
      fallback={
        <div>
          <h1>Error</h1>Something went wrong
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
