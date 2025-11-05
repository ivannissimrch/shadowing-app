"use client";
import YouTube, { YouTubePlayer as YTPlayer } from "react-youtube";
import { Lesson } from "../../Types";
import { useRef, useState } from "react";
import styles from "./YouTubePlayer.module.css";
import LoopSegmentInfo from "./LoopSegmentInfo";
import VideoTimer from "./VideoTimer";
import LoopButtons from "./LoopButtons";
import SkeletonLoader from "../ui/SkeletonLoader";
import useLoopButtons from "@/app/hooks/useLoopButtons";
import useYouTubePlayer from "@/app/hooks/useYouTubePlayer";

interface YouTubePlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function YouTubePlayer({ selectedLesson }: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    updateStartAtCurrentTime,
    updateEndAtCurrentTime,
    toggleLoop,
    clearLoop,
    state,
  } = useLoopButtons(playerRef);
  const lessonLoading = !selectedLesson;

  const isLooping = state.status === "looping";
  const startTime = state.status === "idle" ? null : state.startTime;
  const endTime =
    state.status === "idle" || state.status === "start_set"
      ? null
      : state.endTime;

  const { onPlayerReady, onStateChange, opts } = useYouTubePlayer(
    playerRef,
    intervalRef,
    setCurrentTime,
    updateTimeIntervalRef,
    isLooping,
    startTime,
    endTime
  );

  if (lessonLoading) {
    return <SkeletonLoader />;
  }

  return (
    <section
      role="region"
      aria-label="YouTube video player for pronunciation practice"
    >
      <YouTube
        videoId={selectedLesson.video_id}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
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
