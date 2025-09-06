"use client";
import YouTube, { YouTubeProps } from "react-youtube";
import { Lesson } from "../Types";

export default function YouTubePlayer({
  selectedLesson,
}: {
  selectedLesson: Lesson;
}) {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
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
