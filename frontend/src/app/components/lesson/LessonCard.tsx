import styles from "./LessonCard.module.css";
import Link from "next/link";
import { Lesson } from "../../Types";
import { FaBook, FaCheckCircle, FaHourglassHalf, FaPlayCircle, FaArrowRight } from "react-icons/fa";

export default function LessonCard({ lesson }: { lesson: Lesson }) {
  const { title, status, id } = lesson;

  function getStatusIcon() {
    switch (status?.toLowerCase()) {
      case "completed":
        return <FaCheckCircle className={styles.statusIcon} />;
      case "in progress":
        return <FaPlayCircle className={styles.statusIcon} />;
      default:
        return <FaHourglassHalf className={styles.statusIcon} />;
    }
  }

  function getStatusClass() {
    switch (status?.toLowerCase()) {
      case "completed":
        return styles.statusCompleted;
      case "in progress":
        return styles.statusInProgress;
      default:
        return styles.statusPending;
    }
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <FaBook />
        </div>
      </div>
      <div className={styles["information-container"]}>
        <h3 className={styles.title}>{title}</h3>
        <div className={`${styles.status} ${getStatusClass()}`}>
          {getStatusIcon()}
          {status}
        </div>
      </div>
      <Link href={`/lessons/${id}`} className={styles.button}>
        Start Lesson <FaArrowRight />
      </Link>
    </div>
  );
}
