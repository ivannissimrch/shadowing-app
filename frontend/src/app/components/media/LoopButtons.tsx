import getFormattedTime from "../../helpers/getFormattedTime";
import { LoopState } from "./loopTypes";
import { memo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import { FiRepeat, FiX } from "react-icons/fi";

interface LoopButtonsProps {
  startTime: number | null;
  endTime: number | null;
  isLooping: boolean;
  duration: number;
  setRange: (start: number, end: number) => void;
  seekTo: (time: number) => void;
  toggleLoop: () => void;
  clearLoop: () => void;
  state: LoopState;
}

function LoopButtons({
  startTime,
  endTime,
  isLooping,
  duration,
  setRange,
  seekTo,
  toggleLoop,
  clearLoop,
  state,
}: LoopButtonsProps) {
  const [expanded, setExpanded] = useState(false);
  const [sliderValue, setSliderValue] = useState<number[]>([0, duration || 100]);
  const [prevSliderValue, setPrevSliderValue] = useState<number[]>([0, duration || 100]);

  const hasRange = state.status === "ready" || state.status === "looping";
  const loopDuration = sliderValue[1] - sliderValue[0];

  useEffect(() => {
    if (duration > 0) {
      if (startTime !== null && endTime !== null) {
        setSliderValue([startTime, endTime]);
        setPrevSliderValue([startTime, endTime]);
      } else {
        const defaultValue = [0, Math.min(10, duration)];
        setSliderValue(defaultValue);
        setPrevSliderValue(defaultValue);
      }
    }
  }, [duration, startTime, endTime]);

  // Auto-expand when loop is active
  useEffect(() => {
    if (isLooping) setExpanded(true);
  }, [isLooping]);

  const handleSliderChange = (_event: Event, newValue: number | number[], activeThumb: number) => {
    const value = newValue as number[];
    setSliderValue(value);

    if (activeThumb === 0 && value[0] !== prevSliderValue[0]) {
      seekTo(value[0]);
    } else if (activeThumb === 1 && value[1] !== prevSliderValue[1]) {
      seekTo(value[1]);
    }
    setPrevSliderValue(value);
  };

  const handleSliderCommit = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const value = newValue as number[];
    setRange(value[0], value[1]);
  };

  const handleClear = () => {
    clearLoop();
    setExpanded(false);
  };

  if (duration === 0) {
    return null;
  }

  // Collapsed state - just show button
  if (!expanded && !isLooping) {
    return (
      <Button
        onClick={() => setExpanded(true)}
        variant="outlined"
        size="small"
        startIcon={<FiRepeat size={14} />}
        sx={{ textTransform: "none", fontSize: "0.75rem" }}
      >
        Set Loop
      </Button>
    );
  }

  // Expanded state - compact slider + toggle
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, width: "100%" }}>
      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>
        {getFormattedTime(sliderValue[0])}
      </Typography>

      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        onChangeCommitted={handleSliderCommit}
        min={0}
        max={duration}
        valueLabelDisplay="auto"
        valueLabelFormat={(value) => getFormattedTime(value)}
        disableSwap
        size="small"
        sx={{ flex: 1 }}
      />

      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 32 }}>
        {getFormattedTime(sliderValue[1])}
      </Typography>

      <Button
        onClick={toggleLoop}
        variant={isLooping ? "contained" : "outlined"}
        size="small"
        color="primary"
        sx={{
          textTransform: "none",
          fontSize: "0.75rem",
          minWidth: "auto",
          px: 1.5,
        }}
      >
        {isLooping ? `Loop ${loopDuration}s` : "Loop"}
      </Button>

      {hasRange && (
        <IconButton
          onClick={handleClear}
          size="small"
          color="error"
          sx={{ p: 0.5 }}
        >
          <FiX size={14} />
        </IconButton>
      )}
    </Box>
  );
}

export default memo(LoopButtons);
