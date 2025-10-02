import TeacherViewSelectedLesson from "@/app/components/TeacherViewSelectedLesson";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface StudentLessonPageProps {
  params: { studentId: string; lessonId: string };
}

export default async function StudentLessonPage({
  params,
}: StudentLessonPageProps) {
  const data = await params;

  return (
    <ErrorBoundary
      fallback={<div>Something went wrong loading the lesson.</div>}
    >
      <Suspense fallback={<div>Loading lesson...</div>}>
        <TeacherViewSelectedLesson idInfo={data} />
      </Suspense>
    </ErrorBoundary>
  );
}
