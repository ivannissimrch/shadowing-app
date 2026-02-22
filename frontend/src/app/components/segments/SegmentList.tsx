"use client";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FiPlay, FiSquare, FiTrash2 } from "react-icons/fi";
import type { LocalSegment } from "@/app/hooks/useAudioSegmenter";

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const tenths = Math.round((seconds % 1) * 10);
  return `${mins}:${secs.toString().padStart(2, "0")}.${tenths}`;
}

interface SegmentListProps {
  segments: LocalSegment[];
  onLabelChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onPlay: (id: string) => void;
  playingSegmentId: string | null;
  t: (key: string) => string;
}

export default function SegmentList({
  segments,
  onLabelChange,
  onDelete,
  onPlay,
  playingSegmentId,
  t,
}: SegmentListProps) {
  if (segments.length === 0) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", py: 3 }}
      >
        {t("noSegmentsYet")}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
      {segments.map((segment) => (
        <Box
          key={segment.id}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            borderRadius: 1,
            bgcolor: "action.hover",
          }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, minWidth: 24, textAlign: "center" }}
          >
            {segment.position}
          </Typography>
          <IconButton
            size="small"
            onClick={() => onPlay(segment.id)}
            title={t("playSegment")}
            color={playingSegmentId === segment.id ? "primary" : "default"}
          >
            {playingSegmentId === segment.id ? (
              <FiSquare size={14} />
            ) : (
              <FiPlay size={14} />
            )}
          </IconButton>
          <Typography
            variant="caption"
            sx={{
              minWidth: 100,
              color: "text.secondary",
              fontFamily: "monospace",
            }}
          >
            {formatTime(segment.start_time)} - {formatTime(segment.end_time)}
          </Typography>
          <TextField
            size="small"
            placeholder={t("segmentLabel")}
            value={segment.label}
            onChange={(e) => onLabelChange(segment.id, e.target.value)}
            sx={{ flex: 1 }}
            slotProps={{ input: { sx: { py: "6px", px: "10px" } } }}
          />
          <IconButton
            size="small"
            onClick={() => onDelete(segment.id)}
            color="error"
            title={t("deleteSegment")}
          >
            <FiTrash2 size={14} />
          </IconButton>
        </Box>
      ))}
    </Box>
  );
}
