"use client";
import styles from "./LessonPracticeView.module.css";
import RecorderPanel from "../media/RecorderPanel";
import { ErrorBoundary } from "react-error-boundary";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import RecorderPanelContextProvider from "@/app/RecorderpanelContext";
import VideoScriptToggle from "./VideoScriptToggle";

export function LessonPracticeView({ id }: { id: string }) {
  const { data: selectedLesson } = useSWRAxios<Lesson>(API_PATHS.LESSON(id));

  return (
    <ErrorBoundary
      fallback={
        <div className={styles.error}>
          <h1>Error loading lesson.</h1>
        </div>
      }
    >
      {selectedLesson && (
        <>
          <VideoScriptToggle selectedLesson={selectedLesson} />
          <RecorderPanelContextProvider selectedLesson={selectedLesson}>
            <RecorderPanel selectedLesson={selectedLesson} />
          </RecorderPanelContextProvider>
        </>
      )}
    </ErrorBoundary>
  );
}
