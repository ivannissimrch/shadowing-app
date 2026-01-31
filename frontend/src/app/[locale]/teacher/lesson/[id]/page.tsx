"use client";
import { use, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import LessonPreview from "@/app/components/teacher/LessonPreview";
import EditLessonModal from "@/app/components/teacher/EditLessonModal";
import AssignLessonModal from "@/app/components/teacher/AssignLessonModal";
import { API_PATHS } from "@/app/constants/apiKeys";
import { Lesson } from "@/app/Types";
import Transitions from "@/app/components/ui/Transitions";

export default function TeacherLessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [editLesson, setEditLesson] = useState<Lesson | null>(null);
  const [assignLesson, setAssignLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error Loading Lesson" />
      )}
      onReset={() => {
        mutate(API_PATHS.TEACHER_LESSON(id), undefined, { revalidate: true });
      }}
    >
      <Transitions type="fade">
        <LessonPreview
        lessonId={id}
        onEdit={(lesson) => setEditLesson(lesson)}
        onAssign={(lesson) => setAssignLesson({ id: lesson.id, title: lesson.title })}
      />
      </Transitions>

      <EditLessonModal
        isOpen={!!editLesson}
        onClose={() => setEditLesson(null)}
        lesson={editLesson}
      />

      {assignLesson && (
        <AssignLessonModal
          isOpen={!!assignLesson}
          onClose={() => setAssignLesson(null)}
          lessonId={assignLesson.id}
          lessonTitle={assignLesson.title}
        />
      )}
    </ErrorBoundary>
  );
}
