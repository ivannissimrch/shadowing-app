"use client";
import styles from "@/styles/components/lesson/LessonList.module.css";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";

interface LessonListProps {
  onAssignLesson: (lesson: { id: string; title: string }) => void;
}

export default function LessonList({ onAssignLesson }: LessonListProps) {
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.ALL_LESSONS);

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
                onClick={() => onAssignLesson(lesson)}
              >
                Assign
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}
