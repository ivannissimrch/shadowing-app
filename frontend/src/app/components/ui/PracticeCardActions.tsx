import { Box, Button } from "@mui/material";
import { FiMic, FiSquare, FiVolume2 } from "react-icons/fi";

interface PracticeCardActionsProps {
  text: string;
  status: string;
  isEvaluating: boolean;
  isLessonRecording?: boolean;
  handleSpeak: () => void;
  speak: (text: string, rate: number) => void;
  listenToSegment?: () => void;
  speechRate: number;
  t: (key: string) => string;
  mediaBlobUrl?: string | null;
}

export default function PracticeCardActions({
  text,
  speechRate,
  speak,
  listenToSegment,
  status,
  isEvaluating,
  isLessonRecording,
  handleSpeak,
  t,
  mediaBlobUrl,
}: PracticeCardActionsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 1,
        mb: 2,
        alignItems: { xs: "stretch", sm: "center" },
        "& .MuiButton-root": {
          fontSize: { xs: "0.875rem", sm: "0.875rem" },
          px: { xs: 2, sm: 2 },
          flex: { xs: "none", sm: "0 1 auto" }
        },
        "& audio": {
          width: "100%",
          maxWidth: "300px"
        }
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FiVolume2 />}
        onClick={
          listenToSegment ? listenToSegment : () => speak(text, speechRate)
        }
        sx={{ textTransform: "none" }}
      >
        {t("listen")}
      </Button>
      <Button
        variant="contained"
        color={status === "recording" ? "error" : "primary"}
        startIcon={status === "recording" ? <FiSquare /> : <FiMic />}
        onClick={handleSpeak}
        disabled={isEvaluating || status === "stopping" || isLessonRecording}
        sx={{ textTransform: "none" }}
      >
        {status === "recording"
          ? t("stop")
          : isEvaluating
            ? t("evaluating")
            : t("speak")}
      </Button>
      {mediaBlobUrl && status !== "recording" && (
        <Box
          playsInline
          component="audio"
          src={mediaBlobUrl}
          controls
          sx={{ height: 36 }}
        />
      )}
    </Box>
  );
}
