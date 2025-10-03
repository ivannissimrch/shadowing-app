import TeacherViewSelectedLesson from "@/app/components/TeacherViewSelectedLesson";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export interface StudentLessonPageProps {
  params: Promise<{ studentId: string; lessonId: string }>;
}

export default async function StudentLessonPage({
  params,
}: StudentLessonPageProps) {
  const data = await params;
  // No additional code needed here; just use params directly.
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
