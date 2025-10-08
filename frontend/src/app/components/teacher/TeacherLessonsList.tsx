"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson } from "../../Types";
import TeacherLessonCard from "./TeacherLessonCard";
import styles from "@/styles/components/teacher/TeacherLessonsList.module.css";
import { API_PATHS } from "../../constants/apiKeys";

export default function TeacherLessonsList({ id }: { id: string }) {
  const { data: lessons } = useSWRAxios<Lesson[]>(
    API_PATHS.TEACHER_STUDENT_LESSONS(id)
  );
  return (
    <section className={styles.container}>
      {lessons &&
        lessons.map((lesson: Lesson) => (
          <TeacherLessonCard
            key={lesson.id}
            lesson={lesson}
            studentId={id}
          />
        ))}
    </section>
  );
}
