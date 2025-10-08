"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "@/styles/components/layout/TeacherHeader.module.css";
import AddLesson from "../teacher/AddLesson";
import AddStudent from "../teacher/AddStudent";
import Logout from "../auth/Logout";

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
        <div className={styles.headerContainer}>
          <div>
            <h1>ShadowSpeak</h1>
          </div>
          <button
            className={styles.hamburger}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            ☰
          </button>
          <nav
            className={`${styles.nav} ${
              isMobileMenuOpen ? styles.navOpen : ""
            }`}
          >
            <Link
              href="/teacher"
              className={`${styles.link} ${
                pathname === "/teacher" ? styles.active : ""
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Students
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
          <div className={styles.desktopLogout}>
            <Logout />
          </div>
        </div>
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
