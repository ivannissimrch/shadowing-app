"use client";
import AssignLessonModal from "@/app/components/teacher/AssignLessonModal";
import AddLesson from "@/app/components/teacher/AddLesson";
import { useState } from "react";
import Lessons from "@/app/components/lesson/Lessons";
import useModal from "@/app/hooks/useModal";
import TeacherPageHeader from "@/app/components/teacher/TeacherPageHeader";

export default function LessonsPage() {
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const assignModal = useModal();
  const AddLessonModal = useModal();

  function handleAssignLesson(lesson: { id: string; title: string }) {
    setSelectedLesson(lesson);
    assignModal.openModal();
  }
  function handleCloseModal() {
    assignModal.closeModal();
    setSelectedLesson(null);
  }

  return (
    <>
      <TeacherPageHeader
        title="Lessons"
        onClick={() => AddLessonModal.openModal()}
      />
      <Lessons onAssignLesson={handleAssignLesson} />
      {selectedLesson && (
        <AssignLessonModal
          isOpen={assignModal.isModalOpen}
          onClose={handleCloseModal}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
        />
      )}
      <AddLesson
        isAddLessonDialogOpen={AddLessonModal.isModalOpen}
        closeAddLessonDialog={() => AddLessonModal.closeModal()}
      />
    </>
  );
}
