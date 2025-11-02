import { useState } from "react";
import { YouTubePlayer as YTPlayer } from "react-youtube";

export default function useLoopButtons(
  playerRef: React.RefObject<YTPlayer | null>,
  intervalRef: React.RefObject<NodeJS.Timeout | null>
) {
  const [isLooping, setIsLooping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  function updateStartAtCurrentTime() {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.getCurrentTime());
      setStartTime(time);
    }
  }
  function updateEndAtCurrentTime() {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.getCurrentTime());
      setEndTime(time);
    }
  }
  function toggleLoop() {
    if (!isLooping && playerRef.current && startTime !== null) {
      // Enable looping and seek to start
      playerRef.current.seekTo(startTime, true);
    }
    setIsLooping(!isLooping);
  }
  function clearLoop() {
    setStartTime(null);
    setEndTime(null);
    setIsLooping(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }

  return {
    updateStartAtCurrentTime,
    updateEndAtCurrentTime,
    toggleLoop,
    clearLoop,
    isLooping,
    startTime,
    endTime,
  };
}
