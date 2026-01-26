"use client";
import YouTube, { YouTubePlayer as YTPlayer } from "react-youtube";
import { Lesson } from "../../Types";
import VideoTimer from "./VideoTimer";
import LoopButtons from "./LoopButtons";
import useLoopButtons from "@/app/hooks/useLoopButtons";
import useYouTubePlayer from "@/app/hooks/useYouTubePlayer";
import { useRef, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiAlertCircle, FiExternalLink } from "react-icons/fi";

interface YouTubePlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function YouTubePlayer({ selectedLesson }: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const {
    setRange,
    toggleLoop,
    clearLoop,
    state,
  } = useLoopButtons(playerRef);

  const isLooping = state.status === "looping";
  const startTime = state.status === "idle" ? null : state.startTime;
  const endTime =
    state.status === "idle" || state.status === "start_set"
      ? null
      : state.endTime;

  const { onPlayerReady, onPlayerError, opts, currentTime, duration, hasError } =
    useYouTubePlayer(playerRef);

  const seekTo = useCallback((time: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(time, true);
    }
  }, []);

  const videoId = selectedLesson?.video_id || "";
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (hasError) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "grey.100",
          borderRadius: 2,
        }}
        role="region"
        aria-label="Video unavailable message"
      >
        <FiAlertCircle size={48} color="#697586" style={{ marginBottom: 16 }} />
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
          Video Unavailable
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This video cannot be loaded. This may be due to regional
          restrictions or network settings.
        </Typography>
        <Button
          variant="contained"
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          startIcon={<FiExternalLink size={16} />}
          sx={{ textTransform: "none" }}
        >
          Watch on YouTube
        </Button>
      </Box>
    );
  }

  return (
    <Box
      component="section"
      role="region"
      aria-label="YouTube video player for pronunciation practice"
    >
      <Box sx={{
        "& iframe": {
          display: "block",
          width: "100%",
          aspectRatio: "16/9",
        }
      }}>
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onError={onPlayerError}
        />
      </Box>
      <Box
        sx={{
          p: 2,
          bgcolor: "grey.50",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <VideoTimer currentTime={currentTime} />
          <Typography variant="caption" color="text.secondary">
            / {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
          </Typography>
        </Box>
        <LoopButtons
          startTime={startTime}
          endTime={endTime}
          isLooping={isLooping}
          duration={duration}
          setRange={setRange}
          seekTo={seekTo}
          toggleLoop={toggleLoop}
          clearLoop={clearLoop}
          state={state}
        />
      </Box>
    </Box>
  );
}
