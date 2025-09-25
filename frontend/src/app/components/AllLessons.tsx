import { ErrorBoundary } from "react-error-boundary";
import useFetchData from "../hooks/useFetchData";
import styles from "./AllLessons.module.css";
import SkeletonLoader from "./SkeletonLoader";

export default function AllLessons({
  handleAssignClick,
}: {
  handleAssignClick: (lesson: { id: number; title: string }) => void;
}) {
  const { data, error, isLoading } = useFetchData("/api/all-lessons");
  const lessons = Array.isArray(data) ? data : [];

  if (isLoading) return <SkeletonLoader />;
  if (error) return <div>Error loading lessons</div>;

  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <div className={styles.lessonsGrid}>
        {lessons &&
          lessons.map((lesson: { id: number; title: string }) => (
            <div key={lesson.id} className={styles.lessonsCard}>
              <h3>{lesson.title}</h3>
              <div>
                {" "}
                {/* <button className={styles.button}>Delete</button> */}
                <button
                  className={styles.button}
                  onClick={() => handleAssignClick(lesson)}
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
      </div>
    </ErrorBoundary>
  );
}
