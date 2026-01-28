import { useTranslations } from "next-intl";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
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
        flexDirection: "column",
        alignItems: "center",
        py: 3,
      }}
    >
      <Avatar
        sx={{
          width: 80,
          height: 80,
          bgcolor: isRecording ? "error.main" : isPaused ? "secondary.main" : "primary.light",
          color: isRecording ? "white" : isPaused ? "white" : "primary.main",
          mb: 2,
        }}
      >
        <FiMic size={36} />
      </Avatar>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isIdle && t("clickToStartRecording")}
        {isRecording && t("recordingInProgress")}
        {isPaused && t("recordingPaused")}
      </Typography>

      <Box sx={{ display: "flex", gap: 2 }}>
        {isIdle && (
          <Button
            variant="contained"
            color="primary"
            onClick={startRecording}
            startIcon={<FiMic size={16} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("startRecording")}
          </Button>
        )}
        {isRecording && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={pauseRecording}
            startIcon={<FiPause size={16} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("pause")}
          </Button>
        )}
        {isPaused && (
          <Button
            variant="contained"
            color="primary"
            onClick={resumeRecording}
            startIcon={<FiPlay size={16} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("resume")}
          </Button>
        )}
        {(isRecording || isPaused) && (
          <Button
            variant="contained"
            color="error"
            onClick={stopRecording}
            startIcon={<FiSquare size={16} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            {t("stop")}
          </Button>
        )}
      </Box>
    </Box>
  );
}
