"use client";
import Footer from "../components/Footer";
import styles from "./layout.module.css";
import Header from "../components/Header";
import Link from "next/link";
import { useState } from "react";
import AddLesson from "../components/AddLesson";

export default function LessonsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
  const closeAddLessonDialog = () => setIsAddLessonDialogOpen(false);

  return (
    <>
      <Header />
      <section className={styles.container}>
        <aside className={styles.leftSidebar}>
          <Link href="/teacher" className={styles.sidebarLink}>
            Dashboard
          </Link>
          <Link href="" className={styles.sidebarLink}>
            Students
          </Link>
          <Link href="" className={styles.sidebarLink}>
            Lessons
          </Link>
        </aside>
        <main className={styles.mainContent}>{children}</main>
        <aside className={styles.rightSidebar}>
          <button
            className={styles.sidebarButton}
            onClick={() => setIsAddLessonDialogOpen(true)}
          >
            Add lesson
          </button>
          <Link href="/teacher/add-student" className={styles.sidebarButton}>
            Add student
          </Link>
          <button className={styles.sidebarButton}>Message student</button>
        </aside>
      </section>

      <Footer />
      <AddLesson
        isAddLessonDialogOpen={isAddLessonDialogOpen}
        closeAddLessonDialog={closeAddLessonDialog}
      />
    </>
  );
}
