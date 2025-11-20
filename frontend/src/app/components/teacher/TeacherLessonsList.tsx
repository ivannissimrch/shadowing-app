"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson, Student } from "../../Types";
import Card from "../ui/Card";
import styles from "./TeacherLessonsList.module.css";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import UnassignLessonModal from "./UnassignLessonModal";
import { MdClose } from "react-icons/md"; // Material Design close icon
import CardGrid from "../ui/CardGrid/CardGrid";

export default function TeacherLessonsList({ id }: { id: string }) {
  const { data: lessons } = useSWRAxios<Lesson[]>(
    API_PATHS.TEACHER_STUDENT_LESSONS(id)
  );
  const { data: student } = useSWRAxios<Student>(API_PATHS.TEACHER_STUDENT(id));

  const [unassignModal, setUnassignModal] = useState<{
    isOpen: boolean;
    lessonId: string;
    lessonTitle: string;
  }>({
    isOpen: false,
    lessonId: "",
    lessonTitle: "",
  });

  return (
    <>
      <CardGrid>
        {lessons &&
          lessons.map((lesson: Lesson) => (
            <div key={lesson.id} className={styles.lessonCardWrapper}>
              <Card
                lesson={lesson}
                linkPath={`/teacher/student/${id}/lesson/${lesson.id}`}
              />
              <button
                onClick={() =>
                  setUnassignModal({
                    isOpen: true,
                    lessonId: lesson.id,
                    lessonTitle: lesson.title,
                  })
                }
                className={styles.unassignButton}
                aria-label={`Remove ${lesson.title} from student`}
              >
                <MdClose size={20} />
              </button>
            </div>
          ))}
      </CardGrid>

      {student && (
        <UnassignLessonModal
          isOpen={unassignModal.isOpen}
          onClose={() =>
            setUnassignModal({ isOpen: false, lessonId: "", lessonTitle: "" })
          }
          lessonId={unassignModal.lessonId}
          lessonTitle={unassignModal.lessonTitle}
          studentId={id}
          studentName={student.username}
        />
      )}
    </>
  );
}
