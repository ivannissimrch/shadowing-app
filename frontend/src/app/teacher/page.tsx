"use client";
import styles from "./page.module.css";
import Students from "../components/student/Students";
import AddStudent from "../components/teacher/AddStudent";
import { useState } from "react";
import TeacherPageHeader from "../components/teacher/TeacherPageHeader";

export default function TeacherPage() {
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);

  return (
    <div className={styles.container}>
      <section className={styles.studentsSection}>
        <TeacherPageHeader
          onAddStudentClick={() => setIsAddStudentDialogOpen(true)}
        />
        <Students />
      </section>
      <AddStudent
        isAddStudentDialogOpen={isAddStudentDialogOpen}
        closeAddStudentDialog={() => setIsAddStudentDialogOpen(false)}
        aria-label="Add new student"
      />
    </div>
  );
}
