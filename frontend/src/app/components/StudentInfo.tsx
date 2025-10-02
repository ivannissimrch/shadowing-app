"use client";
import { useFetch } from "../hooks/useFetch";
import { Student } from "../Types";
import styles from "./StudentInfo.module.css";

export default function StudentInfo({ id }: { id: string }) {
  const { data: student } = useFetch<Student>(`/api/teacher/student/${id}`);

  if (!student) return <div>Loading student info...</div>;

  return (
    <section className={styles["student-info"]}>
      <h2>Student Information</h2>
      <p>
        <strong>Username:</strong> {student.username}
      </p>
      <p>
        <strong>Role:</strong> {student.role}
      </p>
    </section>
  );
}
