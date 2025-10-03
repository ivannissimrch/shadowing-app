"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./TeacherHeader.module.css";
import AddLesson from "./AddLesson";
import AddStudent from "./AddStudent";
import Logout from "./Logout";

export default function TeacherHeader() {
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const [isAddStudentDialogOpen, setIsAddStudentDialogOpen] = useState(false);
  const closeAddLessonDialog = () => setIsAddLessonDialogOpen(false);
  const closeAddStudentDialog = () => setIsAddStudentDialogOpen(false);
  const pathname = usePathname();

  return (
    <>
      <header className={styles.header}>
        <div>
          <h1>ShadowSpeak</h1>
        </div>
        <nav className={styles.nav}>
          <Link
            href="/teacher"
            className={`${styles.link} ${
              pathname === "/teacher" ? styles.active : ""
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/teacher/lessons"
            className={`${styles.link} ${
              pathname === "/teacher/lessons" ? styles.active : ""
            }`}
          >
            Lessons
          </Link>
          <button
            className={styles.navButton}
            onClick={() => setIsAddLessonDialogOpen(true)}
          >
            Add lesson
          </button>
          <button
            className={styles.navButton}
            onClick={() => setIsAddStudentDialogOpen(true)}
          >
            Add student
          </button>
        </nav>
        <Logout />
      </header>
      <AddLesson
        isAddLessonDialogOpen={isAddLessonDialogOpen}
        closeAddLessonDialog={closeAddLessonDialog}
      />
      <AddStudent
        isAddStudentDialogOpen={isAddStudentDialogOpen}
        closeAddStudentDialog={closeAddStudentDialog}
      />
    </>
  );
}
