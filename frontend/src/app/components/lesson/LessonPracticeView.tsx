"use client";
import styles from "./LessonPracticeView.module.css";
import SegmentPlayer from "../media/SegmentPlayer";
import RecorderPanel from "../media/RecorderPanel";
import Image from "next/image";
import { ErrorBoundary } from "react-error-boundary";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";

export function LessonPracticeView({ id }: { id: string }) {
  const { data: selectedLesson } = useSWRAxios<Lesson>(API_PATHS.LESSON(id));

  return (
    <ErrorBoundary
      fallback={
        <div className={styles.grid}>
          <h1>Error loading lesson.</h1>
        </div>
      }
    >
      {selectedLesson && (
        <div className={styles.container}>
          <div className={styles.grid}>
            <SegmentPlayer selectedLesson={selectedLesson} />
            <Image
              src={selectedLesson.image}
              alt="ESL lesson"
              quality={100}
              width={625}
              height={390}
              priority
            />
          </div>
          <RecorderPanel selectedLesson={selectedLesson} />
        </div>
      )}
    </ErrorBoundary>
  );
}
