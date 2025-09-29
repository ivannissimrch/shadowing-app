import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import LessonList from "./LessonList";
import { Lesson } from "../Types";
import SkeletonLoader from "./SkeletonLoader";

interface AllLessonsProps {
  handleAssignClick: (lesson: { id: number; title: string }) => void;
}

export default function AllLessons({ handleAssignClick }: AllLessonsProps) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong!</div>}>
      <Suspense fallback={<SkeletonLoader />}>
        <LessonList handleAssignClick={handleAssignClick} />
      </Suspense>
    </ErrorBoundary>
  );
}
