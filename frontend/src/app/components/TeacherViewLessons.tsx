"use client";
import { useSWRAxios } from "../hooks/useSWRAxios";
import { Lesson } from "../Types";
import TeacherViewCard from "./TeacherViewCard";
import styles from "./TeacherViewLessons.module.css";
import { API_PATHS } from "../constants/apiKeys";

export default function TeacherViewLessons({ id }: { id: string }) {
  const { data: lessons } = useSWRAxios<Lesson[]>(
    API_PATHS.TEACHER_STUDENT_LESSONS(id)
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
