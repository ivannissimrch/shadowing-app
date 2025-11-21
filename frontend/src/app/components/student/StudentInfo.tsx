"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Student } from "../../Types";
import styles from "./StudentInfo.module.css";
import { API_PATHS } from "../../constants/apiKeys";

export default function StudentInfo({ id }: { id: string }) {
  const { data } = useSWRAxios<Student>(API_PATHS.TEACHER_STUDENT(id));
  const student = data as Student;

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
