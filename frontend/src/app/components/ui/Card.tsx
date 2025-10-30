import { Lesson } from "@/app/Types";
import styles from "./Card.module.css";
import Link from "next/link";
import {
  FaBook,
  FaCheckCircle,
  FaHourglassHalf,
  FaPlayCircle,
  FaArrowRight,
} from "react-icons/fa";

export default function Card({
  lesson,
  linkPath,
}: {
  lesson: Lesson;
  linkPath: string;
}) {
  const { title, status } = lesson;

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
        <h2 className={styles.title}>{title}</h2>
        <div className={`${styles.status} ${getStatusClass()}`}>
          {getStatusIcon()}
          {status}
        </div>
      </div>
      <Link href={linkPath} className={styles.button}>
        Start Lesson <FaArrowRight />
      </Link>
    </div>
  );
}
