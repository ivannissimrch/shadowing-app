"use client";
import styles from "./PracticeComponents.module.css";
import SegmentPlayer from "./SegmentPlayer";
import RecorderPanel from "./RecorderPanel";
import Image from "next/image";
import { ErrorBoundary } from "react-error-boundary";
import { Lesson } from "../Types";
import { useFetch } from "../hooks/useFetch";

export function PracticeComponents({ id }: { id: string }) {
  const { data: selectedLesson } = useFetch<Lesson>(`/api/lessons/${id}`);

  return (
    <ErrorBoundary
      fallback={
        <div className={styles.grid}>
          <h1>Error loading lesson.</h1>
        </div>
      }
    >
      {selectedLesson && (
        <>
          <div className={styles.grid}>
            <SegmentPlayer selectedLesson={selectedLesson} />
            <Image
              src={`/images/${selectedLesson.image}.png`}
              alt="ESL lesson"
              quality={100}
              width={625}
              height={390}
              priority
            />
          </div>
          <RecorderPanel selectedLesson={selectedLesson} />
        </>
      )}
    </ErrorBoundary>
  );
}
