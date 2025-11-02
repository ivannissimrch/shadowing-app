"use client";
import YouTube, { YouTubePlayer as YTPlayer } from "react-youtube";
import { Lesson } from "../../Types";
import { useRef, useState, useEffect } from "react";
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
    isLooping,
    startTime,
    endTime,
  } = useLoopButtons(playerRef, intervalRef);
  const lessonLoading = !selectedLesson;

  const { onPlayerReady, onStateChange, opts } = useYouTubePlayer(
    playerRef,
    intervalRef,
    setCurrentTime,
    updateTimeIntervalRef,
    isLooping,
    startTime,
    endTime
  );

  // Cleanup intervals on unmount
  useEffect(() => {
    const loopInterval = intervalRef.current;
    const timeInterval = updateTimeIntervalRef.current;

    return () => {
      if (loopInterval) {
        clearInterval(loopInterval);
      }
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    };
  }, []);

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
        />
        {startTime !== null && endTime !== null && (
          <LoopSegmentInfo startTime={startTime} endTime={endTime} />
        )}
      </section>
    </section>
  );
}
