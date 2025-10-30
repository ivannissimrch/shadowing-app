"use client";
import styles from "./LessonPracticeView.module.css";
import SegmentPlayer from "../media/SegmentPlayer";
import RecorderPanel from "../media/RecorderPanel";
import Image from "next/image";
import { ErrorBoundary } from "react-error-boundary";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import RecorderPanelContextProvider from "@/app/RecorderpanelContext";

export function LessonPracticeView({ id }: { id: string }) {
  const { data: selectedLesson } = useSWRAxios<Lesson>(API_PATHS.LESSON(id));
  const [isImageVisible, setIsImageVisible] = useState(true);
  const [isVideoVisible, setIsVideoVisible] = useState(true);

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
          <div
            className={
              isImageVisible && isVideoVisible
                ? styles.grid
                : styles.gridOneColumn
            }
          >
            <div className={isVideoVisible ? "" : styles.hide}>
              {" "}
              <SegmentPlayer selectedLesson={selectedLesson} />
            </div>

            <Image
              src={selectedLesson.image}
              alt={`${selectedLesson.title} - Practice lesson image`}
              quality={100}
              fill
              priority
              className={!isVideoVisible ? "" : styles.hide}
            />
            <Image
              src={selectedLesson.image}
              alt={`${selectedLesson.title} - Practice lesson image`}
              quality={100}
              width={1400}
              height={875}
              priority
              className={isImageVisible ? "" : styles.hide}
            />

            {isVideoVisible ? (
              <button
                className={styles.toggleImage}
                onClick={() => setIsImageVisible(!isImageVisible)}
              >
                {isImageVisible ? "hide image" : "show image"}
              </button>
            ) : null}

            {isImageVisible ? (
              <button
                className={styles.toggleVideo}
                onClick={() => setIsVideoVisible(!isVideoVisible)}
              >
                {isVideoVisible ? "hide video" : "show video"}
              </button>
            ) : null}
          </div>
          <RecorderPanelContextProvider selectedLesson={selectedLesson}>
            <RecorderPanel selectedLesson={selectedLesson} />
          </RecorderPanelContextProvider>
        </div>
      )}
    </ErrorBoundary>
  );
}
