"use client";
import styles from "./StudentList.module.css";
import { Student } from "../Types";
import Link from "next/link";
import { useSWRAxios } from "../hooks/useSWRAxios";
import { API_PATHS } from "../constants/apiKeys";

export default function StudentList() {
  const { data: students } = useSWRAxios<Student[]>(API_PATHS.USERS);

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
