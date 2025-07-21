"use client";
import YouTube, { YouTubeProps } from "react-youtube";
import { useParams } from "next/navigation";

export default function YouTubePlayer() {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    event.target.pauseVideo();
  };
  const params = useParams();
  const videoId = typeof params?.id === "string" ? params.id : "";

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
    },
  };

  return <YouTube videoId={videoId} opts={opts} onReady={onPlayerReady} />;
}
