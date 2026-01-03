import {
  YouTubeProps,
  YouTubePlayer as YTPlayer,
  YouTubeEvent,
} from "react-youtube";
import { useRef, useState, useEffect, useCallback } from "react";

const opts: YouTubeProps["opts"] = {
  playerVars: {
    autoplay: 0,
  },
};
const PLAYER_UPDATE_INTERVAL_MS = 100;

export default function useYouTubePlayer(
  playerRef: React.RefObject<YTPlayer | null>
) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [hasError, setHasError] = useState<boolean>(false);
  const updateTimeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const onPlayerReady: YouTubeProps["onReady"] = useCallback(
    (event: YouTubeEvent) => {
      playerRef.current = event.target;
      event.target.pauseVideo();
      setHasError(false);

      if (updateTimeIntervalRef.current) {
        clearInterval(updateTimeIntervalRef.current);
      }
      // Start updating current time display
      updateTimeIntervalRef.current = setInterval(() => {
        if (playerRef.current) {
          setCurrentTime(Math.floor(playerRef.current.getCurrentTime()));
        }
      }, PLAYER_UPDATE_INTERVAL_MS);
    },
    [playerRef]
  );

  const onPlayerError: YouTubeProps["onError"] = useCallback(() => {
    setHasError(true);
  }, []);

  useEffect(() => {
    return () => {
      if (updateTimeIntervalRef.current) {
        clearInterval(updateTimeIntervalRef.current);
        updateTimeIntervalRef.current = null;
      }
    };
  }, []);

  return {
    onPlayerReady,
    onPlayerError,
    opts,
    currentTime,
    hasError,
  };
}
