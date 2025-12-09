"use client";
import { FaUserGraduate, FaEye, FaTrash } from "react-icons/fa";
import styles from "./StudentCard.module.css";
import { Student } from "../../Types";
import { Button } from "./Button";
import { useState } from "react";

export default function StudentCard({
  students,
  onDeleteStudent,
}: {
  students: Student[] | undefined;
  onDeleteStudent: (student: Student) => void;
}) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return students?.map((student: Student) => (
    <div key={student.id} className={styles.studentCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <FaUserGraduate />
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.studentTitle}>{student.username}</h3>
        <p className={styles.studentSubtitle}>Student</p>
      </div>
      <div className={styles.buttonGroup}>
        <Button
          variant="secondary"
          leftIcon={<FaEye />}
          href={`/teacher/student/${student.id}`}
          className={styles.viewButton}
          onClick={() => setLoadingId(student.id)}
          disabled={loadingId === student.id}
        >
          {loadingId === student.id ? "Loading..." : "View Details"}
        </Button>
        <button
          onClick={() => onDeleteStudent(student)}
          className={styles.deleteButton}
          title="Delete student"
          aria-label={`Delete student ${student.username}`}
        >
          <FaTrash />
        </button>
      </div>
    </div>
  ));
}
