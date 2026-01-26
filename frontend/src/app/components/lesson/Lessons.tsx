import { ErrorBoundary } from "react-error-boundary";
import LessonList from "./LessonList";
import ErrorFallback from "../ui/ErrorFallback";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";

interface LessonsProps {
  onAssignLesson: (lesson: { id: string; title: string }) => void;
}

export default function Lessons({ onAssignLesson }: LessonsProps) {
  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Error loading lessons" />
      )}
      onReset={() => {
        mutate(API_PATHS.ALL_LESSONS, undefined, { revalidate: true });
      }}
    >
      <LessonList onAssignLesson={onAssignLesson} />
    </ErrorBoundary>
  );
}
