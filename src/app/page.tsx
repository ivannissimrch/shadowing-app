"use client";
import styles from "./page.module.css";
import Link from "next/link";

export default function Login() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>
        <div className={styles.buttonsContainer}>
          <Link href="teacher">Teacher</Link>
          <Link href="student1">Student1</Link>
          <Link href="student2">Student2</Link>
          <Link href="student2">Student3</Link>
        </div>
      </div>
    </main>
  );
}
