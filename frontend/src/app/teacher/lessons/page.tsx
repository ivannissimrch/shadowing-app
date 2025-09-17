"use client";
import { useAppContext } from "@/app/AppContext";
import AssignLessonModal from "@/app/components/AssignLessonModal";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LessonsPage() {
  const { token } = useAppContext();
  const [lessons, setLessons] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<{
    id: number;
    title: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      const response = await fetch(`${API_URL}/api/all-lessons`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
      setLessons(result.data);
    }

    loadData();
  }, [token]);

  const handleAssignClick = (lesson: { id: number; title: string }) => {
    setSelectedLesson(lesson);
    setAssignModalOpen(true);
  };

  const handleCloseModal = () => {
    setAssignModalOpen(false);
    setSelectedLesson(null);
  };

  return (
    <section className={styles.lessonsSection}>
      <h2>Lessons</h2>
      <div className={styles.lessonsGrid}>
        {lessons &&
          lessons.map((lesson: { id: number; title: string }) => (
            <div key={lesson.id} className={styles.lessonsCard}>
              <h3>{lesson.title}</h3>
              <div>
                {" "}
                {/* <button className={styles.button}>Delete</button> */}
                <button
                  className={styles.button}
                  onClick={() => handleAssignClick(lesson)}
                >
                  Assign
                </button>
              </div>
            </div>
          ))}
      </div>
      {selectedLesson && (
        <AssignLessonModal
          isOpen={assignModalOpen}
          onClose={handleCloseModal}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
        />
      )}
    </section>
  );
}
