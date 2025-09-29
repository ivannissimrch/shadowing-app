"use client";
import styles from "./StudentList.module.css";
import { useAppContext } from "../AppContext";
import fetchData from "../helpers/fetchData";
import { use } from "react";
import { Student } from "../Types";

export default function StudentList() {
  const { token } = useAppContext();
  if (!token) return;
  const students = use(fetchData("/api/users", token)) as Student[];

  return (
    <div className={styles.studentsGrid}>
      {students &&
        students.map((student: Student) => (
          <div key={student.id} className={styles.studentCard}>
            <h3>{student.username}</h3>
            <button className={styles.button}>See Details</button>
          </div>
        ))}
    </div>
  );
}
