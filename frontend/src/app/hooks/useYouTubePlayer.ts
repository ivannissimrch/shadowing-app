import { YouTubeProps, YouTubePlayer as YTPlayer } from "react-youtube";

export default function useYouTubePlayer(
  playerRef: React.RefObject<YTPlayer | null>,
  intervalRef: React.RefObject<NodeJS.Timeout | null>,
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  updateTimeIntervalRef: React.RefObject<NodeJS.Timeout | null>,
  isLooping: boolean,
  startTime: number | null,
  endTime: number | null
) {
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

  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 0,
    },
  };

  return { onPlayerReady, onStateChange, opts };
}
