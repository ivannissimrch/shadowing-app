import styles from "./Card.module.css";
import Link from "next/link";
import { Lesson } from "../Types";

export default function Card({ currentLesson }: { currentLesson: Lesson }) {
  const { title, status, lesson_id } = currentLesson;
  console.log(currentLesson);
  return (
    <div className={styles.card}>
      <div className={styles["information-container"]}>
        <h3 className={styles.title}>{title}</h3>
        <h3 className={styles.status}>{status}</h3>
      </div>
      <Link href={`/lessons/${lesson_id}`} className={styles.button}>
        Go to Lesson
      </Link>
    </div>
  );
}
