import styles from "./LessonCard.module.css";
import { Lesson } from "../../Types";
import { FaBook, FaTrash, FaUserPlus } from "react-icons/fa";
import { Button } from "../ui/Button/Button";

interface LessonCardProps {
  lessons: Lesson[];
  onAssignLesson: (lesson: { id: string; title: string }) => void;
  onDeleteLesson: (lesson: Lesson) => void;
}

export default function LessonCard({
  lessons,
  onAssignLesson,
  onDeleteLesson,
}: LessonCardProps) {
  return lessons.map((lesson: Lesson) => (
    <div key={lesson.id} className={styles.lessonsCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconWrapper}>
          <FaBook />
        </div>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.lessonTitle}>{lesson.title}</h3>
      </div>
      <div className={styles.buttonGroup}>
        <Button
          variant="secondary"
          leftIcon={<FaUserPlus />}
          onClick={() => onAssignLesson(lesson)}
          className={styles.assignButton}
        >
          Assign
        </Button>
        <button
          className={styles.deleteButton}
          onClick={() => onDeleteLesson(lesson)}
          title="Delete lesson"
        >
          <FaTrash />
        </button>
      </div>
    </div>
  ));
}
