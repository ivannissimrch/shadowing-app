"use client";
import YouTube, { YouTubePlayer as YTPlayer } from "react-youtube";
import { Lesson } from "../../Types";
import styles from "./YouTubePlayer.module.css";
import LoopSegmentInfo from "./LoopSegmentInfo";
import VideoTimer from "./VideoTimer";
import LoopButtons from "./LoopButtons";
import useLoopButtons from "@/app/hooks/useLoopButtons";
import useYouTubePlayer from "@/app/hooks/useYouTubePlayer";
import { useRef } from "react";

interface YouTubePlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function YouTubePlayer({ selectedLesson }: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const {
    updateStartAtCurrentTime,
    updateEndAtCurrentTime,
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

  const { onPlayerReady, onPlayerError, opts, currentTime, hasError } =
    useYouTubePlayer(playerRef);

  const videoId = selectedLesson?.video_id || "";
  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (hasError) {
    return (
      <section
        role="region"
        aria-label="Video unavailable message"
        className={styles.errorContainer}
      >
        <div className={styles.errorContent}>
          <svg
            className={styles.errorIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <h3 className={styles.errorTitle}>Video Unavailable</h3>
          <p className={styles.errorMessage}>
            This video cannot be loaded. This may be due to regional
            restrictions or network settings.
          </p>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.youtubeLink}
          >
            Watch on YouTube
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-label="YouTube video player for pronunciation practice"
    >
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onPlayerReady}
        onError={onPlayerError}
      />
      <section className={styles.controlsContainer}>
        <VideoTimer currentTime={currentTime} />
        <LoopButtons
          startTime={startTime}
          endTime={endTime}
          isLooping={isLooping}
          updateStartAtCurrentTime={updateStartAtCurrentTime}
          updateEndAtCurrentTime={updateEndAtCurrentTime}
          toggleLoop={toggleLoop}
          clearLoop={clearLoop}
          state={state}
        />
        {startTime !== null && endTime !== null && (
          <LoopSegmentInfo startTime={startTime} endTime={endTime} />
        )}
      </section>
    </section>
  );
}
