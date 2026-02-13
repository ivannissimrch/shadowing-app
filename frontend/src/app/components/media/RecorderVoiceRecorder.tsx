import { useTranslations } from "next-intl";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { FiMic, FiPlay, FiPause, FiSquare } from "react-icons/fi";

export default function RecorderVoiceRecorder() {
  const t = useTranslations("media");
  const {
    recorderState,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecorderPanelContext();

  const isRecording = recorderState.status === "recording";
  const isPaused = recorderState.status === "paused";
  const isIdle = recorderState.status === "idle";

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        py: 1,
      }}
    >
      {(isRecording || isPaused) && (
        <Typography variant="body2" color="text.secondary">
          {isRecording && t("recordingInProgress")}
          {isPaused && t("recordingPaused")}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 1 }}>
        {isIdle && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={startRecording}
            startIcon={<FiMic size={14} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("startRecording")}
          </Button>
        )}
        {isRecording && (
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={pauseRecording}
            startIcon={<FiPause size={14} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("pause")}
          </Button>
        )}
        {isPaused && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={resumeRecording}
            startIcon={<FiPlay size={14} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("resume")}
          </Button>
        )}
        {(isRecording || isPaused) && (
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={stopRecording}
            startIcon={<FiSquare size={14} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("stop")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
