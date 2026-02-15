"use client";

import { memo, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";
import { FiVolume2, FiVolumeX, FiX } from "react-icons/fi";

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onVolumeChange: (volume: number) => void;
  onMuteToggle: () => void;
  disabled?: boolean;
}

function VolumeControl({
  volume,
  muted,
  onVolumeChange,
  onMuteToggle,
  disabled = false,
}: VolumeControlProps) {
  const [expanded, setExpanded] = useState(false);

  const handleSliderChange = (_event: Event, newValue: number | number[]) => {
    onVolumeChange(newValue as number);
  };

  if (!expanded) {
    return (
      <IconButton
        onClick={() => setExpanded(true)}
        disabled={disabled}
        size="small"
        aria-label={muted ? "Unmute" : "Mute"}
        sx={{
          color: muted ? "grey.400" : "grey.600",
          border: 1,
          borderColor: "grey.300",
          borderRadius: 1,
          p: 0.5,
        }}
      >
        {muted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
      </IconButton>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 0.5,
        bgcolor: "grey.100",
        borderRadius: 1,
        px: 1,
        py: 0.5,
      }}
    >
      <IconButton
        onClick={onMuteToggle}
        disabled={disabled}
        size="small"
        aria-label={muted ? "Unmute" : "Mute"}
        sx={{ p: 0.5, color: muted ? "grey.400" : "grey.600" }}
      >
        {muted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
      </IconButton>

      <Slider
        value={muted ? 0 : volume}
        onChange={handleSliderChange}
        min={0}
        max={1}
        step={0.05}
        disabled={disabled}
        size="small"
        aria-label="Volume"
        sx={{ width: 80 }}
      />

      <IconButton
        onClick={() => setExpanded(false)}
        size="small"
        sx={{ p: 0.5, color: "grey.600" }}
        aria-label="Collapse volume control"
      >
        <FiX size={12} />
      </IconButton>
    </Box>
  );
}

export default memo(VolumeControl);
