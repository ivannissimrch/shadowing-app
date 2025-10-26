"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson } from "../../Types";
import Card from "../ui/Card";
import styles from "./TeacherLessonsList.module.css";
import { API_PATHS } from "../../constants/apiKeys";

export default function TeacherLessonsList({ id }: { id: string }) {
  const { data: lessons } = useSWRAxios<Lesson[]>(
    API_PATHS.TEACHER_STUDENT_LESSONS(id)
  );
  return (
    <section className={styles.container}>
      {lessons &&
        lessons.map((lesson: Lesson) => (
          <Card
            key={lesson.title}
            lesson={lesson}
            linkPath={`/teacher/student/${id}/lesson/${lesson.id}`}
          />
        ))}
    </section>
  );
}
