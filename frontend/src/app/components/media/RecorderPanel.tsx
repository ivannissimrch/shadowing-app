"use client";
import { useTranslations } from "next-intl";
import "react-h5-audio-player/lib/styles.css";
import { Lesson } from "../../Types";
import { ErrorBoundary } from "react-error-boundary";
import RecorderAudioPlayer from "./RecorderAudioplayer";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import RecorderVoiceRecorder from "./RecorderVoiceRecorder";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

interface RecorderProps {
  selectedLesson: Lesson | undefined;
}

export default function RecorderPanel({ selectedLesson }: RecorderProps) {
  const t = useTranslations("media");
  const tTeacher = useTranslations("teacher");
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
      <Paper sx={{ p: 3, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
        {!hasAudio && <RecorderVoiceRecorder />}
        {hasAudio && <RecorderAudioPlayer selectedLesson={selectedLesson} />}
        {selectedLesson?.feedback && (
          <Box sx={{ mt: 3, p: 2, bgcolor: "primary.light", borderRadius: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}>
              {tTeacher("feedback")}
            </Typography>
            <Typography variant="body1" color="text.primary">
              {selectedLesson.feedback}
            </Typography>
          </Box>
        )}
      </Paper>
    </ErrorBoundary>
  );
}
