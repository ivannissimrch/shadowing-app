"use client";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteLessonModal from "../teacher/DeleteLessonModal";
import CardGrid from "../ui/CardGrid";
import LessonCard from "../ui/LessonCard";

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
      <CardGrid>
        {lessons && (
          <LessonCard
            lessons={lessons}
            onAssignLesson={onAssignLesson}
            onDeleteLesson={handleDeleteLesson}
          />
        )}
      </CardGrid>
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
