"use client";
import styles from "./StudentLessons.module.css";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import Card from "../ui/Card";

export default function StudentLessons() {
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.LESSONS);

  if (lessons?.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2 className={styles.emptyTitle}>No Lessons Assigned</h2>
        <p className={styles.emptyMessage}>
          Your teacher hasn&apos;t assigned any lessons yet. Check back soon!
        </p>
      </div>
    );
  }

  return (
    <div className={styles["cards-container"]}>
      {lessons &&
        lessons.map((lesson) => (
          <Card
            key={lesson.title}
            lesson={lesson}
            linkPath={`/lessons/${lesson.id}`}
          />
        ))}
    </div>
  );
}
