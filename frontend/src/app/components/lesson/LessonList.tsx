"use client";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteLessonModal from "../teacher/DeleteLessonModal";
import EditLessonModal from "../teacher/EditLessonModal";
import CardGrid from "../ui/CardGrid";
import LessonCard from "../ui/LessonCard";

interface LessonListProps {
  onAssignLesson: (lesson: { id: string; title: string }) => void;
}

export default function LessonList({ onAssignLesson }: LessonListProps) {
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.ALL_LESSONS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [lessonToDelete, setLessonToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  function handleDeleteLesson(lesson: Lesson) {
    setLessonToDelete({ id: lesson.id, title: lesson.title });
    setIsDeleteModalOpen(true);
  }

  function handleEditLesson(lesson: Lesson) {
    setSelectedLesson(lesson);
    setIsEditModalOpen(true);
  }

  function handleCloseDeleteModal() {
    setIsDeleteModalOpen(false);
    setLessonToDelete(null);
  }

  function handleCloseEditModal() {
    setIsEditModalOpen(false);
    setSelectedLesson(null);
  }

  return (
    <>
      <CardGrid>
        {lessons && (
          <LessonCard
            lessons={lessons}
            onAssignLesson={onAssignLesson}
            onDeleteLesson={handleDeleteLesson}
            onEditLesson={handleEditLesson}
          />
        )}
      </CardGrid>

      {lessonToDelete && (
        <DeleteLessonModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          lessonId={lessonToDelete.id}
          lessonTitle={lessonToDelete.title}
        />
      )}

      <EditLessonModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        lesson={selectedLesson}
      />
    </>
  );
}
