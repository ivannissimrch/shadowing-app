"use client";
import { use } from "react";
import { useTranslations } from "next-intl";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import StudentPracticeWords from "@/app/components/teacher/StudentPracticeWords";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs";
import Transitions from "@/app/components/ui/Transitions";
import { API_PATHS } from "@/app/constants/apiKeys";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import { Student } from "@/app/Types";

interface PracticePageProps {
  params: Promise<{ studentId: string }>;
}

export default function StudentPracticePage({ params }: PracticePageProps) {
  const { studentId: id } = use(params);
  const t = useTranslations("teacher");
  const tNav = useTranslations("navigation");
  const { data: student } = useSWRAxios<Student>(API_PATHS.TEACHER_STUDENT(id));

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Failed to load practice words" />
      )}
      onReset={() => {
        mutate(API_PATHS.TEACHER_STUDENT_PRACTICE_WORDS(id), undefined, {
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
              { label: t("practiceWords") },
            ]}
          />
          <StudentPracticeWords studentId={id} />
        </div>
      </Transitions>
    </ErrorBoundary>
  );
}
