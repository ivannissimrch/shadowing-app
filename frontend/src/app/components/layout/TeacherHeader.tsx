"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "@/styles/components/layout/TeacherHeader.module.css";
import Logout from "../auth/Logout";

export default function TeacherHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
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
          <div className={styles.mobileLogout}>
            <Logout />
          </div>
        </nav>
        <div className={styles.desktopLogout}>
          <Logout />
        </div>
      </div>
    </header>
  );
}
