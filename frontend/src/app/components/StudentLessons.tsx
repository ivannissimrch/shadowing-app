"use client";
import styles from "./StudentLessons.module.css";
import Card from "../components/Card";
import { Lesson } from "../Types";
import { useFetch } from "../hooks/useFetch";

export default function StudentLessons() {
  const { data: lessons } = useFetch<Lesson[]>("/api/lessons");

  return (
    <div className={styles["cards-container"]}>
      {lessons &&
        lessons.map((currentLesson) => (
          <Card key={currentLesson.title} currentLesson={currentLesson} />
        ))}
    </div>
  );
}
