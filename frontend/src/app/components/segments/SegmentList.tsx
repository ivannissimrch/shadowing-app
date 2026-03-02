"use client";
import { useRef, useEffect } from "react";
import Box from "@mui/material/Box";
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

interface SegmentRowProps {
  segment: LocalSegment;
  onLabelChange: (id: string, label: string) => void;
  onDelete: (id: string) => void;
  onPlay: (id: string) => void;
  playingSegmentId: string | null;
  t: (key: string) => string;
}

function SegmentRow({
  segment,
  onLabelChange,
  onDelete,
  onPlay,
  playingSegmentId,
  t,
}: SegmentRowProps) {
  const editableRef = useRef<HTMLDivElement>(null);

  // Sync external label changes (reset/save) without clobbering user edits
  useEffect(() => {
    if (
      editableRef.current &&
      editableRef.current.innerHTML !== segment.label
    ) {
      editableRef.current.innerHTML = segment.label;
    }
  }, [segment.label]);

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    e.preventDefault();
    const html = e.clipboardData.getData("text/html");
    const plain = e.clipboardData.getData("text/plain");

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    const temp = document.createElement("div");
    temp.innerHTML = html || plain;

    const frag = document.createDocumentFragment();
    while (temp.firstChild) frag.appendChild(temp.firstChild);
    range.insertNode(frag);
    range.collapse(false);

    if (editableRef.current) {
      onLabelChange(segment.id, editableRef.current.innerHTML);
    }
  }

  return (
    <Box
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
      <Box
        ref={editableRef}
        component="div"
        contentEditable
        suppressContentEditableWarning
        onInput={(e) =>
          onLabelChange(
            segment.id,
            (e.currentTarget as HTMLDivElement).innerHTML
          )
        }
        onPaste={handlePaste}
        data-placeholder={t("segmentLabel")}
        sx={{
          flex: 1,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          py: "6px",
          px: "10px",
          fontSize: "0.875rem",
          lineHeight: 1.5,
          cursor: "text",
          minHeight: "32px",
          "&:focus": {
            outline: "none",
            borderColor: "primary.main",
          },
          "&:empty::before": {
            content: "attr(data-placeholder)",
            color: "text.disabled",
          },
        }}
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
  );
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
        <SegmentRow
          key={segment.id}
          segment={segment}
          onLabelChange={onLabelChange}
          onDelete={onDelete}
          onPlay={onPlay}
          playingSegmentId={playingSegmentId}
          t={t}
        />
      ))}
    </Box>
  );
}
