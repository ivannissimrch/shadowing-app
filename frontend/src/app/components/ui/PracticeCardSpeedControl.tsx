import { Box, Slider, Typography } from "@mui/material";

interface PracticeCardSpeedControlProps {
  speechRate: number;
  updateSpeechRate: (value: number) => void;
  t: (key: string) => string;
}

export default function PracticeCardSpeedControl({
  speechRate,
  updateSpeechRate,
  t,
}: PracticeCardSpeedControlProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {t("speed")}: {speechRate.toFixed(1)}x
      </Typography>
      <Slider
        value={speechRate}
        onChange={(_, val) => updateSpeechRate(val as number)}
        min={0.5}
        max={1}
        step={0.1}
        size="small"
        sx={{ width: 200 }}
      />
    </Box>
  );
}
