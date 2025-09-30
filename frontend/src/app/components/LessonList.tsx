"use client";
import styles from "./LessonList.module.css";
import { Lesson } from "../Types";
import { useFetch } from "../hooks/useFetch";

interface LessonListProps {
  handleAssignClick: (lesson: { id: string; title: string }) => void;
}

export default function LessonList({ handleAssignClick }: LessonListProps) {
  const { data: lessons } = useFetch<Lesson[]>("/api/all-lessons");

  return (
    <div className={styles.lessonsGrid}>
      {lessons &&
        lessons.map((lesson: Lesson) => (
          <div key={lesson.id} className={styles.lessonsCard}>
            <h3>{lesson.title}</h3>
            <div>
              {" "}
              {/* <button className={styles.button}>Delete</button> */}
              <button
                className={styles.button}
                onClick={() => handleAssignClick(lesson)}
              >
                Assign
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
