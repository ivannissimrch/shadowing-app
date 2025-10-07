import styles from "./LessonCard.module.css";
import Link from "next/link";
import { Lesson } from "../Types";

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  const { title, status, id } = lesson;
  return (
    <div className={styles.card}>
      <div className={styles["information-container"]}>
        <h3 className={styles.title}>{title}</h3>
        <h3 className={styles.status}>{status}</h3>
      </div>
      <Link href={`/lessons/${id}`} className={styles.button}>
        Go to Lesson
      </Link>
    </div>
  );
}
