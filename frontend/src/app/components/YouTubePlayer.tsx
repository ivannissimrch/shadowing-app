"use client";
import YouTube, { YouTubeProps } from "react-youtube";
import { Lesson } from "../Types";

interface YouTubePlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function YouTubePlayer({ selectedLesson }: YouTubePlayerProps) {
  if (!selectedLesson) {
    return <div>Loading...</div>;
  }
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
      videoId={selectedLesson.video_id}
      opts={opts}
      onReady={onPlayerReady}
    />
  );
}
