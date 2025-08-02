import { useParams } from "next/navigation";
import { useAppContext } from "../AppContext";
export default function useSelectedLesson() {
  const params = useParams();
  const lessonId = params.id;
  const { lessons } = useAppContext();
  if (lessons) {
    const activeLesson = lessons.find((lesson) => lesson.lessonId === lessonId);
    return activeLesson;
  }
  return null;
}
