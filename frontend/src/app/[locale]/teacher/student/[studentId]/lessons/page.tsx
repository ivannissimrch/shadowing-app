"use client";
import { use } from "react";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import TeacherLessonsList from "@/app/components/teacher/TeacherLessonsList";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import Transitions from "@/app/components/ui/Transitions";
import { API_PATHS } from "@/app/constants/apiKeys";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import { Student } from "@/app/Types";

interface LessonsPageProps {
  params: Promise<{ studentId: string }>;
}

export default function StudentLessonsPage({ params }: LessonsPageProps) {
  const { studentId: id } = use(params);
  const t = useTranslations("teacher");
  const tNav = useTranslations("navigation");
  const { data: student } = useSWRAxios<Student>(API_PATHS.TEACHER_STUDENT(id));

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Failed to load lessons" />
      )}
      onReset={() => {
        mutate(API_PATHS.TEACHER_STUDENT_LESSONS(id), undefined, {
          revalidate: true,
        });
      }}
    >
      <Transitions type="fade">
        <div>
          <Breadcrumbs
            items={[
              { label: tNav("students"), href: "/teacher/students" },
              {
                label: student?.username || "...",
                href: `/teacher/student/${id}`,
              },
              { label: t("assignedLessons") },
            ]}
          />
          <TeacherLessonsList id={id} />
        </div>
      </Transitions>
    </ErrorBoundary>
  );
}
