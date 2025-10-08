"use client";
import AssignLessonModal from "@/app/components/teacher/AssignLessonModal";
import styles from "./page.module.css";
import { useState } from "react";
import Lessons from "@/app/components/lesson/Lessons";

export default function LessonsPage() {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const handleAssignLesson = (lesson: { id: string; title: string }) => {
    setSelectedLesson(lesson);
    setAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setAssignModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <section className={styles.lessonsSection}>
      <h2>Lessons</h2>
      <Lessons onAssignLesson={handleAssignLesson} />
      {selectedLesson && (
        <AssignLessonModal
          isOpen={assignModalOpen}
          onClose={handleCloseModal}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
        />
      )}
    </section>
  );
}
