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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const closeAddLessonDialog = () => setIsAddLessonDialogOpen(false);
  const closeAddStudentDialog = () => setIsAddStudentDialogOpen(false);
  const pathname = usePathname();

  return (
    <>
      <header className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1>ShadowSpeak</h1>
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <div className={styles.desktopLogout}>
            <Logout />
          </div>
        </div>
        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.navOpen : ""}`}>
          <Link
            href="/teacher"
            className={`${styles.link} ${
              pathname === "/teacher" ? styles.active : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/teacher/lessons"
            className={`${styles.link} ${
              pathname === "/teacher/lessons" ? styles.active : ""
            }`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Lessons
          </Link>
          <button
            className={styles.navButton}
            onClick={() => {
              setIsAddLessonDialogOpen(true);
              setIsMobileMenuOpen(false);
            }}
          >
            Add lesson
          </button>
          <button
            className={styles.navButton}
            onClick={() => {
              setIsAddStudentDialogOpen(true);
              setIsMobileMenuOpen(false);
            }}
          >
            Add student
          </button>
          <div className={styles.mobileLogout}>
            <Logout />
          </div>
        </nav>
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
