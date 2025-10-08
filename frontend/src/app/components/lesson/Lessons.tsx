import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LessonList from "./LessonList";
import SkeletonLoader from "../ui/SkeletonLoader";
import ErrorFallback from "../ui/ErrorFallback";

interface LessonsProps {
  onAssignLesson: (lesson: { id: string; title: string }) => void;
}

export default function Lessons({ onAssignLesson }: LessonsProps) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error loading lessons" />
      )}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <LessonList onAssignLesson={onAssignLesson} />
      </Suspense>
    </ErrorBoundary>
  );
}
