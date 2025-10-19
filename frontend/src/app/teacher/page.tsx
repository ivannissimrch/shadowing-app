"use client";
import styles from "./page.module.css";
import Students from "../components/student/Students";
import AddStudent from "../components/teacher/AddStudent";
import { useState } from "react";

export default function TeacherPage() {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  return (
    <div className={styles.teacherDashboard}>
      <section className={styles.statsRow}></section>
      <section className={styles.studentsSection}>
        <div className={styles.sectionHeader}>
          <h2>Students</h2>
          <button
            className={styles.addButton}
            onClick={() => setIsAddStudentDialogOpen(true)}
          >
            + Add Student
          </button>
        </div>
        <Students />
      </section>
      <AddStudent
        isAddStudentDialogOpen={isAddStudentDialogOpen}
        closeAddStudentDialog={() => setIsAddStudentDialogOpen(false)}
      />
    </div>
  );
}
