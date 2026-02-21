import { useCallback, useEffect, useRef, useState } from "react";
import { VideoPlayerRef } from "../components/media/playerTypes";

interface CloudinaryVideoPlayer {
  source: (publicId: string) => void;
  currentTime: (time?: number) => number;
  duration: () => number;
  play: () => void;
  pause: () => void;
  dispose: () => void;
  on: (event: string, callback: () => void) => void;
}

export default function useCloudinaryPlayer(
  publicId: string | undefined | null
) {
  const cloudinaryPlayerRef = useRef<CloudinaryVideoPlayer | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<VideoPlayerRef | null>(null);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!publicId || !videoRef.current) return;

    let mounted = true;

    const initPlayer = async () => {
      try {
        const cloudinaryModule = await import("cloudinary-video-player");
        const cloudinary = cloudinaryModule.default || cloudinaryModule;

        if (!mounted || !videoRef.current) return;

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        if (!cloudName) {
          console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
          setHasError(true);
          return;
        }

        cloudinaryPlayerRef.current = (
          cloudinary.videoPlayer as unknown as (
            el: HTMLVideoElement,
            opts: Record<string, unknown>
          ) => CloudinaryVideoPlayer
        )(videoRef.current, {
          cloud_name: cloudName,
          controls: true,
          fluid: true,
          muted: false,
          preload: "auto",
        });

        cloudinaryPlayerRef.current.source(publicId);

        const player = cloudinaryPlayerRef.current;

        if (!player || typeof player.on !== "function") {
          console.error("Cloudinary player failed to initialize properly");
          setHasError(true);
          return;
        }

        player.on("ready", () => {
          if (mounted) {
            setIsReady(true);
            if (cloudinaryPlayerRef.current) {
              playerRef.current = {
                getCurrentTime: () =>
                  cloudinaryPlayerRef.current?.currentTime() ?? 0,
                seekTo: (time: number) =>
                  cloudinaryPlayerRef.current?.currentTime(time),
                getDuration: () => cloudinaryPlayerRef.current?.duration() ?? 0,
                play: () => cloudinaryPlayerRef.current?.play(),
                pause: () => cloudinaryPlayerRef.current?.pause(),
                setPlaybackRate: (rate: number) => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = rate;
                    setPlaybackRate(rate);
                  }
                },
                getPlaybackRate: () => videoRef.current?.playbackRate ?? 1,
              };
            }

            const dur = player.duration() || 0;
            setDuration(Math.floor(dur));
          }
        });

        player.on("loadedmetadata", () => {
          if (mounted) {
            const dur = player.duration() || 0;
            setDuration(Math.floor(dur));
          }
        });

        player.on("error", () => {
          if (mounted) {
            setHasError(true);
          }
        });
      } catch (error) {
        console.error("Error initializing Cloudinary player:", error);
        if (mounted) {
          setHasError(true);
        }
      }
    };

    initPlayer();

    return () => {
      mounted = false;
      if (cloudinaryPlayerRef.current) {
        try {
          cloudinaryPlayerRef.current.dispose();
        } catch (error) {
          console.error("Error disposing Cloudinary player:", error);
        }
        cloudinaryPlayerRef.current = null;
      }
      playerRef.current = null;
      setIsReady(false);
    };
  }, [publicId]);

  const seekTo = useCallback((time: number) => {
    if (cloudinaryPlayerRef.current) {
      cloudinaryPlayerRef.current.currentTime(time);
    }
  }, []);

  const handleSpeedChange = useCallback((rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  }, []);

  return {
    playerRef,
    playbackRate,
    handleSpeedChange,
    isReady,
    seekTo,
    duration,
    hasError,
    videoRef,
  };
}
