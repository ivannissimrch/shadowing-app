"use client";
import styles from "./LessonList.module.css";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteLessonModal from "../teacher/DeleteLessonModal";
import { FaBook, FaTrash, FaUserPlus } from "react-icons/fa";
import { Button } from "../ui/Button/Button";

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
              <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                  <FaBook />
                </div>
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.lessonTitle}>{lesson.title}</h3>
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  variant="secondary"
                  leftIcon={<FaUserPlus />}
                  onClick={() => onAssignLesson(lesson)}
                  className={styles.assignButton}
                >
                  Assign
                </Button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteLesson(lesson)}
                  title="Delete lesson"
                >
                  <FaTrash />
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
