"use client";
import YouTube, { YouTubeProps } from "react-youtube";
import useSelectedLesson from "../hooks/useSelectedLesson";

export default function YouTubePlayer() {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo();
  };
  const selectedLesson = useSelectedLesson();

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return (
    <YouTube
      videoId={selectedLesson?.videoId}
      opts={opts}
      onReady={onPlayerReady}
    />
  );
}
