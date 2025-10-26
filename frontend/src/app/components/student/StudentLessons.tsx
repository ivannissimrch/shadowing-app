"use client";
import styles from "./StudentLessons.module.css";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import Card from "../ui/Card";

export default function StudentLessons() {
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.LESSONS);

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
