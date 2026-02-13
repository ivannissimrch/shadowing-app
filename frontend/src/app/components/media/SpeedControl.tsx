"use client";

import { memo } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

const SPEED_OPTIONS = [0.5, 0.75, 1];

interface SpeedControlProps {
  speed: number;
  onSpeedChange: (speed: number) => void;
  disabled?: boolean;
}

function SpeedControl({ speed, onSpeedChange, disabled = false }: SpeedControlProps) {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newSpeed: number | null) => {
    if (newSpeed !== null) {
      onSpeedChange(newSpeed);
    }
  };

  return (
    <ToggleButtonGroup
      value={speed}
      exclusive
      onChange={handleChange}
      disabled={disabled}
      size="small"
      aria-label="Playback speed"
    >
      {SPEED_OPTIONS.map((option) => (
        <ToggleButton
          key={option}
          value={option}
          sx={{
            px: 1,
            py: 0.25,
            fontSize: "0.7rem",
            textTransform: "none",
            // Force dark text on light background (grey.50 container)
            color: "grey.700",
            borderColor: "grey.300",
            "&.Mui-selected": {
              color: "primary.dark",
              bgcolor: "primary.light",
              borderColor: "primary.main",
              "&:hover": {
                bgcolor: "primary.light",
              },
            },
            "&:hover": {
              bgcolor: "grey.100",
            },
          }}
        >
          {option}x
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default memo(SpeedControl);
