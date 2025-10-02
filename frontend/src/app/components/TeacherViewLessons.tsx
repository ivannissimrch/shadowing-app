"use client";
import { useFetch } from "../hooks/useFetch";
import { Lesson } from "../Types";
import TeacherViewCard from "./TeacherViewCard";
import styles from "./TeacherViewLessons.module.css";

export default function TeacherViewLessons({ id }: { id: string }) {
  const { data: lessons } = useFetch<Lesson[]>(
    `/api/teacher/student/${id}/lessons`
  );
  return (
    <section className={styles.container}>
      {lessons &&
        lessons.map((lesson: Lesson) => (
          <TeacherViewCard
            key={lesson.id}
            currentLesson={lesson}
            studentId={id}
          />
        ))}
    </section>
  );
}
