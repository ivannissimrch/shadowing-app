"use client";
import styles from "./PracticeComponents.module.css";
import SegmentPlayer from "./SegmentPlayer";
import RecorderPanel from "./RecorderPanel";
import Image from "next/image";
import { ErrorBoundary } from "react-error-boundary";
import { useAppContext } from "../AppContext";
import fetchData from "../helpers/fetchData";
import { use } from "react";
import { Lesson } from "../Types";

export function PracticeComponents({ id }: { id: string }) {
  const { token } = useAppContext();
  if (!token) {
    return;
  }
  const selectedLesson = use(fetchData(`/api/lessons/${id}`, token)) as Lesson;

  return (
    <ErrorBoundary
      fallback={
        <div className={styles.grid}>
          <h1>Error loading lesson.</h1>
        </div>
      }
    >
      <div className={styles.grid}>
        <SegmentPlayer selectedLesson={selectedLesson} />
        {selectedLesson.image && (
          <Image
            src={`/images/${selectedLesson.image}.png`}
            alt="ESL lesson"
            quality={100}
            width={625}
            height={390}
            priority
          />
        )}
      </div>
      <RecorderPanel selectedLesson={selectedLesson} />
    </ErrorBoundary>
  );
}
