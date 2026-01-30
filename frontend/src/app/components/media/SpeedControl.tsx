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
          sx={{ px: 1.5, py: 0.5, fontSize: "0.75rem", textTransform: "none" }}
        >
          {option}x
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

export default memo(SpeedControl);
