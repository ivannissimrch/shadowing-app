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
  const { recorderState, dispatch, isAudioMutating, isLessonMutating } =
    useRecorderPanelContext();
  const isSubmitting = isAudioMutating || isLessonMutating;

  // Check for error state
  if (recorderState.status === "error") {
    return (
      <div className={styles.error}>
        <p>{recorderState.message}</p>
        <button
          onClick={() => dispatch({ type: "RESET" })}
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
  // Check if we have audio (stopped state with audioURL)
  const hasAudio = recorderState.status === "stopped";

  return (
    <ErrorBoundary fallback={<p>Error loading recorder panel</p>}>
      <section className={styles.panel}>
        {!hasAudio && <RecorderVoiceRecorder />}
        {hasAudio && <RecorderAudioPlayer selectedLesson={selectedLesson} />}
        {selectedLesson?.feedback && (
          <p className={styles.feedback}>{selectedLesson.feedback}</p>
        )}
      </section>
    </ErrorBoundary>
  );
}
