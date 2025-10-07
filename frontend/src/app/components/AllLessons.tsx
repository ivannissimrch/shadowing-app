import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LessonList from "./LessonList";
import SkeletonLoader from "./SkeletonLoader";
import ErrorFallback from "./ErrorFallback";

interface AllLessonsProps {
  handleAssignClick: (lesson: { id: string; title: string }) => void;
}

export default function AllLessons({ handleAssignClick }: AllLessonsProps) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error loading lessons" />
      )}
    >
      <Suspense fallback={<SkeletonLoader />}>
        <LessonList handleAssignClick={handleAssignClick} />
      </Suspense>
    </ErrorBoundary>
  );
}
