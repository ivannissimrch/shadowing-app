import { Box, Button } from "@mui/material";
import { FiMic, FiSquare, FiVolume2 } from "react-icons/fi";

interface PracticeCardActionsProps {
  text: string;
  status: string;
  isEvaluating: boolean;
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
  handleSpeak,
  t,
  mediaBlobUrl,
}: PracticeCardActionsProps) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 2,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FiVolume2 />}
        onClick={listenToSegment ? listenToSegment : () => speak(text, speechRate)}
        sx={{ textTransform: "none" }}
      >
        {t("listen")}
      </Button>
      <Button
        variant="contained"
        color={status === "recording" ? "error" : "primary"}
        startIcon={status === "recording" ? <FiSquare /> : <FiMic />}
        onClick={handleSpeak}
        disabled={isEvaluating}
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
          component="audio"
          src={mediaBlobUrl}
          controls
          sx={{ height: 36 }}
        />
      )}
    </Box>
  );
}
