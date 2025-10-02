import TeacherViewLessons from "@/app/components/TeacherViewLessons";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import StudentInfo from "@/app/components/StudentInfo";

interface StudentPageProps {
  params: { studentId: string };
}

export default async function StudentPage({ params }: StudentPageProps) {
  const { studentId: id } = await params;

  return (
    <ErrorBoundary fallback={<div>Failed to load student details.</div>}>
      <Suspense fallback={<div>Loading student details...</div>}>
        <StudentInfo id={id} />
        <TeacherViewLessons id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}
