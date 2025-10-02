"use client";
import styles from "./StudentList.module.css";
import { Student } from "../Types";
import { useFetch } from "../hooks/useFetch";
import Link from "next/link";

export default function StudentList() {
  const { data: students } = useFetch<Student[]>("/api/users");

  return (
    <div className={styles.studentsGrid}>
      {students &&
        students.map((student: Student) => (
          <div key={student.id} className={styles.studentCard}>
            <h3>{student.username}</h3>
            <Link
              href={`/teacher/student/${student.id}`}
              className={styles.button}
            >
              See Details
            </Link>
          </div>
        ))}
    </div>
  );
}
