"use client";
import styles from "./StudentLessons.module.css";
import LessonCard from "../components/LessonCard";
import { Lesson } from "../Types";
import { useSWRAxios } from "../hooks/useSWRAxios";
import { API_PATHS } from "../constants/apiKeys";

export default function StudentLessons() {
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.LESSONS);

  return (
    <div className={styles["cards-container"]}>
      {lessons &&
        lessons.map((lesson) => (
          <LessonCard key={lesson.title} lesson={lesson} />
        ))}
    </div>
  );
}
