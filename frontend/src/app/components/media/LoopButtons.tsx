import getFormattedTime from "../../helpers/getFormattedTime";
import { LoopState } from "./loopTypes";
import { memo, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
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
  // Local state for slider while dragging
  const [sliderValue, setSliderValue] = useState<number[]>([0, duration || 100]);
  const [prevSliderValue, setPrevSliderValue] = useState<number[]>([0, duration || 100]);

  // Update slider when duration loads or external state changes
  useEffect(() => {
    if (duration > 0) {
      if (startTime !== null && endTime !== null) {
        setSliderValue([startTime, endTime]);
        setPrevSliderValue([startTime, endTime]);
      } else {
        // Default to first 10 seconds or full duration if shorter
        const defaultValue = [0, Math.min(10, duration)];
        setSliderValue(defaultValue);
        setPrevSliderValue(defaultValue);
      }
    }
  }, [duration, startTime, endTime]);

  const handleSliderChange = (_event: Event, newValue: number | number[], activeThumb: number) => {
    const value = newValue as number[];
    setSliderValue(value);

    // Seek video to the position being adjusted
    if (activeThumb === 0 && value[0] !== prevSliderValue[0]) {
      // Start thumb moved - seek to start position
      seekTo(value[0]);
    } else if (activeThumb === 1 && value[1] !== prevSliderValue[1]) {
      // End thumb moved - seek to end position
      seekTo(value[1]);
    }
    setPrevSliderValue(value);
  };

  const handleSliderCommit = (_event: Event | React.SyntheticEvent, newValue: number | number[]) => {
    const value = newValue as number[];
    setRange(value[0], value[1]);
  };

  // Don't render until we have duration
  if (duration === 0) {
    return (
      <Box sx={{ p: 1 }}>
        <Typography variant="body2" color="text.secondary">
          Loading video...
        </Typography>
      </Box>
    );
  }

  const hasRange = state.status === "ready" || state.status === "looping";

  return (
    <Box sx={{ width: "100%" }}>
      {/* Slider */}
      <Box sx={{ px: 1, mb: 1 }}>
        <Slider
          value={sliderValue}
          onChange={handleSliderChange}
          onChangeCommitted={handleSliderCommit}
          min={0}
          max={duration}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => getFormattedTime(value)}
          disableSwap
          sx={{
            "& .MuiSlider-thumb": {
              width: 16,
              height: 16,
            },
            "& .MuiSlider-track": {
              height: 6,
            },
            "& .MuiSlider-rail": {
              height: 6,
              opacity: 0.3,
            },
          }}
        />
        {/* Time labels */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: -0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {getFormattedTime(sliderValue[0])}
          </Typography>
          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 500 }}>
            Loop: {sliderValue[1] - sliderValue[0]}s
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {getFormattedTime(sliderValue[1])}
          </Typography>
        </Box>
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <Button
          onClick={toggleLoop}
          variant={isLooping ? "contained" : "outlined"}
          size="small"
          color="primary"
          startIcon={<FiRepeat size={14} />}
          disabled={!hasRange}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          {isLooping ? "Loop ON" : "Loop OFF"}
        </Button>

        {hasRange && (
          <Button
            onClick={clearLoop}
            variant="outlined"
            size="small"
            color="error"
            startIcon={<FiX size={14} />}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Clear
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default memo(LoopButtons);
