import { YouTubeProps, YouTubePlayer as YTPlayer } from "react-youtube";

export default function useYouTubePlayer(
  playerRef: React.RefObject<YTPlayer | null>,
  intervalRef: React.RefObject<NodeJS.Timeout | null>,
  setCurrentTime: React.Dispatch<React.SetStateAction<number>>,
  updateTimeIntervalRef: React.RefObject<NodeJS.Timeout | null>
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

  const opts: YouTubeProps["opts"] = {
    playerVars: {
      autoplay: 0,
    },
  };

  return { onPlayerReady, opts };
}
