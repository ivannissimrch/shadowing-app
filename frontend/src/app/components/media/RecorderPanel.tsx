"use client";
import { useTranslations } from "next-intl";
import "react-h5-audio-player/lib/styles.css";
import { Lesson } from "../../Types";
import { ErrorBoundary } from "react-error-boundary";
import RecorderAudioPlayer from "./RecorderAudioplayer";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import RecorderVoiceRecorder from "./RecorderVoiceRecorder";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";

interface RecorderProps {
  selectedLesson: Lesson | undefined;
}

export default function RecorderPanel({ selectedLesson }: RecorderProps) {
  const t = useTranslations("media");
  const { recorderState, dispatch } = useRecorderPanelContext();

  // Check for error state
  if (recorderState.status === "error") {
    return (
      <Alert
        severity="error"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => dispatch({ type: "RESET" })}
          >
            {t("dismiss")}
          </Button>
        }
      >
        {recorderState.message}
      </Alert>
    );
  }

  const hasNewRecording = recorderState.status === "stopped";
  const hasExistingAudio = selectedLesson?.audio_file != null;
  const hasAudio = hasNewRecording || hasExistingAudio;

  return (
    <ErrorBoundary
      fallback={
        <Alert severity="error">{t("errorLoadingRecorder")}</Alert>
      }
    >
      <Paper sx={{ p: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
        {!hasAudio && <RecorderVoiceRecorder />}
        {hasAudio && <RecorderAudioPlayer selectedLesson={selectedLesson} />}
      </Paper>
    </ErrorBoundary>
  );
}
