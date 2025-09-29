"use client";
import styles from "./LessonList.module.css";
import fetchData from "../helpers/fetchData";
import { Lesson } from "../Types";
import { useAppContext } from "../AppContext";
import { use } from "react";

interface LessonListProps {
  handleAssignClick: (lesson: { id: string; title: string }) => void;
}

export default function LessonList({ handleAssignClick }: LessonListProps) {
  const { token } = useAppContext();
  if (!token) return;
  const lessons = use(fetchData("/api/all-lessons", token)) as Lesson[];

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
