"use client";
import styles from "./Students.module.css";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../components/SkeletonLoader";
import useFetchData from "../hooks/useFetchData";

export default function Students() {
  const { data, isLoading, error } = useFetchData("/api/users");
  const students = Array.isArray(data) ? data : [];
  if (isLoading) return <SkeletonLoader />;
  if (error) {
    return (
      <div className={styles.studentsGrid}>
        <h1>Error loading students</h1>
      </div>
    );
  }
  return (
    <ErrorBoundary
      fallback={
        <div className={styles.studentsGrid}>
          <h1>Error loading students</h1>
        </div>
      }
    >
      <div className={styles.studentsGrid}>
        {students &&
          students.map((student: { id: number; username: string }) => (
            <div key={student.id} className={styles.studentCard}>
              <h3>{student.username}</h3>
              <button className={styles.button}>See Details</button>
            </div>
          ))}
      </div>
    </ErrorBoundary>
  );
}
