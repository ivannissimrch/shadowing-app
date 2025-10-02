import styles from "./TeacherViewCard.module.css";
import Link from "next/link";
import { Lesson } from "../Types";

interface TeacherViewCardProps {
  currentLesson: Lesson;
  studentId: string;
}

export default function TeacherViewCard({
  currentLesson,
  studentId,
}: TeacherViewCardProps) {
  const { title, status, id } = currentLesson;
  return (
    <div className={styles.card}>
      <div className={styles["information-container"]}>
        <h3 className={styles.title}>{title}</h3>
        <h3 className={styles.status}>{status}</h3>
      </div>
      <Link
        href={`/teacher/student/${studentId}/lesson/${id}`}
        className={styles.button}
      >
        Go to Lesson
      </Link>
    </div>
  );
}
