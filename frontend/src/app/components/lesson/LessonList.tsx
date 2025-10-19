"use client";
import styles from "@/styles/components/lesson/LessonList.module.css";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteLessonModal from "../teacher/DeleteLessonModal";

interface LessonListProps {
  onAssignLesson: (lesson: { id: string; title: string }) => void;
}

export default function LessonList({ onAssignLesson }: LessonListProps) {
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.ALL_LESSONS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);

  function handleDeleteLesson(lesson: Lesson) {
    setSelectedLesson({ id: lesson.id, title: lesson.title });
    setIsDeleteModalOpen(true);
  }

  function handleCloseModal() {
    setIsDeleteModalOpen(false);
    setSelectedLesson(null);
  }

  return (
    <>
      <div className={styles.lessonsGrid}>
        {lessons &&
          lessons.map((lesson: Lesson) => (
            <div key={lesson.id} className={styles.lessonsCard}>
              <h3>{lesson.title}</h3>
              <div>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteLesson(lesson)}
                >
                  Delete
                </button>
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
      {selectedLesson && (
        <DeleteLessonModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
        />
      )}
    </>
  );
}
