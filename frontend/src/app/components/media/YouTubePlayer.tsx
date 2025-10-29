"use client";
import YouTube, {
  YouTubeProps,
  YouTubePlayer as YTPlayer,
} from "react-youtube";
import { Lesson } from "../../Types";
import { useRef, useState, useEffect } from "react";
import styles from "./YouTubePlayer.module.css";
import getFormattedTime from "../../helpers/getFormattedTime";

interface YouTubePlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function YouTubePlayer({ selectedLesson }: YouTubePlayerProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [isLooping, setIsLooping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const updateTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (updateTimeIntervalRef.current) {
        clearInterval(updateTimeIntervalRef.current);
      }
    };
  }, []);

  if (!selectedLesson) {
    return <div>Loading...</div>;
  }

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    event.target.pauseVideo();

    // Start updating current time display
    updateTimeIntervalRef.current = setInterval(() => {
      if (playerRef.current) {
        setCurrentTime(Math.floor(playerRef.current.getCurrentTime()));
      }
    }, 100);
  };

  const onStateChange: YouTubeProps["onStateChange"] = (event) => {
    const player = event.target;

    if (
      event.data === 1 &&
      isLooping &&
      startTime !== null &&
      endTime !== null
    ) {
      // Playing state - start checking for end time
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        const currentTime = player.getCurrentTime();

        // Loop back to start when end time is reached
        if (currentTime >= endTime) {
          player.seekTo(startTime, true);
        }
      }, 100); // Check every 100ms
    } else if (event.data !== 1) {
      // Not playing - clear interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  };

  const setStartAtCurrentTime = () => {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.getCurrentTime());
      setStartTime(time);
    }
  };

  const setEndAtCurrentTime = () => {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.getCurrentTime());
      setEndTime(time);
    }
  };

  const toggleLoop = () => {
    if (!isLooping && playerRef.current && startTime !== null) {
      // Enable looping and seek to start
      playerRef.current.seekTo(startTime, true);
    }
    setIsLooping(!isLooping);
  };

  const clearLoop = () => {
    setStartTime(null);
    setEndTime(null);
    setIsLooping(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <div>
      <YouTube
        videoId={selectedLesson.video_id}
        opts={opts}
        onReady={onPlayerReady}
        onStateChange={onStateChange}
      />

      <div className={styles.controlsContainer}>
        <div className={styles.currentTime}>
          Current time: <strong>{getFormattedTime(currentTime)}</strong>
        </div>

        <div className={styles.buttonsContainer}>
          <button
            onClick={setStartAtCurrentTime}
            className={`${styles.button} ${styles.setStartButton}`}
          >
            Set Start {startTime !== null && `(${getFormattedTime(startTime)})`}
          </button>

          <button
            onClick={setEndAtCurrentTime}
            className={`${styles.button} ${styles.setEndButton}`}
          >
            Set End {endTime !== null && `(${getFormattedTime(endTime)})`}
          </button>

          {startTime !== null && endTime !== null && (
            <>
              <button
                onClick={toggleLoop}
                className={`${styles.button} ${styles.loopButton} ${
                  isLooping ? styles.active : ""
                }`}
              >
                {isLooping ? "🔁 Loop ON" : "▶️ Start Loop"}
              </button>

              <button
                onClick={clearLoop}
                className={`${styles.button} ${styles.clearButton}`}
              >
                Clear
              </button>
            </>
          )}
        </div>

        {startTime !== null && endTime !== null && (
          <div className={styles.segmentInfo}>
            📍 Loop segment: {getFormattedTime(startTime)} →{" "}
            {getFormattedTime(endTime)} ({endTime - startTime}s)
          </div>
        )}
      </div>
    </div>
  );
}
