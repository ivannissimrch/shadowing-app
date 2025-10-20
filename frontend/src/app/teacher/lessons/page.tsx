"use client";
import AssignLessonModal from "@/app/components/teacher/AssignLessonModal";
import AddLesson from "@/app/components/teacher/AddLesson";
import styles from "./page.module.css";
import { useState } from "react";
import Lessons from "@/app/components/lesson/Lessons";
import { FaPlus } from "react-icons/fa";

export default function LessonsPage() {
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [isAddLessonDialogOpen, setIsAddLessonDialogOpen] = useState(false);
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
      <div className={styles.sectionHeader}>
        <h2>Lessons</h2>
        <button
          className={styles.addButton}
          onClick={() => setIsAddLessonDialogOpen(true)}
        >
          <FaPlus /> Add Lesson
        </button>
      </div>
      <Lessons onAssignLesson={handleAssignLesson} />
      {selectedLesson && (
        <AssignLessonModal
          isOpen={assignModalOpen}
          onClose={handleCloseModal}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
        />
      )}
      <AddLesson
        isAddLessonDialogOpen={isAddLessonDialogOpen}
        closeAddLessonDialog={() => setIsAddLessonDialogOpen(false)}
      />
    </section>
  );
}
