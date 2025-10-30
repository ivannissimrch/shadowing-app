"use client";
import styles from "./RecorderPanel.module.css";
import "react-h5-audio-player/lib/styles.css";
import { Lesson } from "../../Types";
import { ErrorBoundary } from "react-error-boundary";

import RecorderAudioPlayer from "./RecorderAudioplayer";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import SkeletonLoader from "../ui/SkeletonLoader";
import RecorderVoiceRecorder from "./RecorderVoiceRecorder";

interface RecorderProps {
  selectedLesson: Lesson | undefined;
}

export default function RecorderPanel({ selectedLesson }: RecorderProps) {
  const {
    audioURL,
    errorMessage,
    setErrorMessage,
    isAudioMutating,
    isLessonMutating,
  } = useRecorderPanelContext();
  const isSubmitting = isAudioMutating || isLessonMutating;

  if (errorMessage) {
    return (
      <div className={styles.error}>
        <p>{errorMessage}</p>
        <button
          onClick={() => setErrorMessage("")}
          className={styles.recordBtn}
        >
          Dismiss
        </button>
      </div>
    );
  }
  if (isSubmitting) {
    return <SkeletonLoader />;
  }

  return (
    <ErrorBoundary fallback={<p>Error loading recorder panel</p>}>
      <section className={styles.panel}>
        {!audioURL && <RecorderVoiceRecorder />}
        {audioURL && <RecorderAudioPlayer selectedLesson={selectedLesson} />}
        {selectedLesson?.feedback && (
          <p className={styles.feedback}>{selectedLesson.feedback}</p>
        )}
      </section>
    </ErrorBoundary>
  );
}
