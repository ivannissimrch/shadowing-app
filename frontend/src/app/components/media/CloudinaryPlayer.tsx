"use client";
import { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import { Lesson } from "../../Types";
import VideoTimer from "./VideoTimer";
import LoopButtons from "./LoopButtons";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FiAlertCircle } from "react-icons/fi";
import { VideoPlayerRef } from "./playerTypes";
import { LoopState } from "./loopTypes";

// Import Cloudinary video player CSS
import "cloudinary-video-player/cld-video-player.min.css";

// Cloudinary player instance type (simplified)
interface CloudinaryVideoPlayer {
  source: (publicId: string) => void;
  currentTime: (time?: number) => number;
  duration: () => number;
  play: () => void;
  pause: () => void;
  dispose: () => void;
  on: (event: string, callback: () => void) => void;
}

interface CloudinaryPlayerProps {
  selectedLesson: Lesson | undefined;
}

// Create a hook similar to useLoopButtons but for generic player
function useCloudinaryLoop(playerRef: React.RefObject<VideoPlayerRef | null>) {
  const [state, setState] = useState<LoopState>({ status: "idle" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const setRange = useCallback((startTime: number, endTime: number) => {
    setState({ status: "ready", startTime, endTime });
  }, []);

  const toggleLoop = useCallback(() => {
    setState(prev => {
      if (prev.status === "ready") {
        return { ...prev, status: "looping" } as LoopState;
      } else if (prev.status === "looping") {
        return { ...prev, status: "ready" } as LoopState;
      }
      return prev;
    });
  }, []);

  const clearLoop = useCallback(() => {
    setState({ status: "idle" });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (state.status !== "looping") {
      return;
    }

    intervalRef.current = setInterval(() => {
      if (playerRef.current && state.status === "looping") {
        const currentTime = playerRef.current.getCurrentTime();
        if (currentTime >= state.endTime) {
          playerRef.current.seekTo(state.startTime);
        }
      }
    }, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [state, playerRef]);

  return { state, setRange, toggleLoop, clearLoop };
}

const CloudinaryPlayer = forwardRef<VideoPlayerRef, CloudinaryPlayerProps>(
  function CloudinaryPlayer({ selectedLesson }, ref) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<VideoPlayerRef | null>(null);
    const cloudinaryPlayerRef = useRef<CloudinaryVideoPlayer | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [hasError, setHasError] = useState(false);
    const [isReady, setIsReady] = useState(false);

    const { state, setRange, toggleLoop, clearLoop } = useCloudinaryLoop(playerRef);

    const isLooping = state.status === "looping";
    const startTime = state.status === "idle" ? null : state.startTime;
    const endTime =
      state.status === "idle" || state.status === "start_set"
        ? null
        : state.endTime;

    // Create player ref interface
    useEffect(() => {
      if (cloudinaryPlayerRef.current) {
        playerRef.current = {
          getCurrentTime: () => cloudinaryPlayerRef.current?.currentTime() ?? 0,
          seekTo: (time: number) => cloudinaryPlayerRef.current?.currentTime(time),
          getDuration: () => cloudinaryPlayerRef.current?.duration() ?? 0,
          play: () => cloudinaryPlayerRef.current?.play(),
          pause: () => cloudinaryPlayerRef.current?.pause(),
        };
      }
    }, [isReady]);

    // Expose player ref to parent
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useImperativeHandle(ref, () => playerRef.current!, [playerRef.current]);

    // Initialize Cloudinary player
    useEffect(() => {
      if (!selectedLesson?.cloudinary_public_id || !videoRef.current) return;

      let mounted = true;

      const initPlayer = async () => {
        try {
          // Dynamic import since cloudinary-video-player is client-side only
          const cloudinaryModule = await import("cloudinary-video-player");
          const cloudinary = cloudinaryModule.default || cloudinaryModule;

          if (!mounted || !videoRef.current) return;

          // Get cloud name from environment
          const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
          if (!cloudName) {
            console.error("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set");
            setHasError(true);
            return;
          }

          // Initialize the player - cast through unknown since type definitions don't match runtime behavior
          cloudinaryPlayerRef.current = (cloudinary.videoPlayer as unknown as (el: HTMLVideoElement, opts: Record<string, unknown>) => CloudinaryVideoPlayer)(videoRef.current, {
            cloud_name: cloudName,
            controls: true,
            fluid: true,
            muted: false,
            preload: "auto",
          });

          // Set the source (we already checked cloudinary_public_id is not null above)
          cloudinaryPlayerRef.current.source(selectedLesson.cloudinary_public_id!);

          // Store reference for event handlers
          const player = cloudinaryPlayerRef.current;

          // Listen for events
          player.on("ready", () => {
            if (mounted) {
              setIsReady(true);
              const dur = player.duration() || 0;
              setDuration(Math.floor(dur));
            }
          });

          player.on("timeupdate", () => {
            if (mounted) {
              const time = player.currentTime() || 0;
              setCurrentTime(Math.floor(time));
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
          } catch {
            // Player might already be disposed
          }
          cloudinaryPlayerRef.current = null;
        }
        playerRef.current = null;
        setIsReady(false);
      };
    }, [selectedLesson?.cloudinary_public_id]);

    const seekTo = useCallback((time: number) => {
      if (cloudinaryPlayerRef.current) {
        cloudinaryPlayerRef.current.currentTime(time);
      }
    }, []);

    if (hasError) {
      return (
        <Box
          sx={{
            p: 4,
            textAlign: "center",
            bgcolor: "grey.100",
            borderRadius: 2,
          }}
          role="region"
          aria-label="Video unavailable message"
        >
          <FiAlertCircle size={48} color="#697586" style={{ marginBottom: 16 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
            Video Unavailable
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This video cannot be loaded. Please try again later.
          </Typography>
        </Box>
      );
    }

    return (
      <Box
        component="section"
        role="region"
        aria-label="Video player for pronunciation practice"
      >
        <Box
          sx={{
            "& video": {
              display: "block",
              width: "100%",
              aspectRatio: "16/9",
            },
            "& .cld-video-player": {
              width: "100%",
            },
          }}
        >
          <video
            ref={videoRef}
            className="cld-video-player cld-fluid"
            style={{ width: "100%" }}
          />
        </Box>
        <Box
          sx={{
            p: 2,
            bgcolor: "grey.50",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <VideoTimer currentTime={currentTime} />
            <Typography variant="caption" color="text.secondary">
              / {Math.floor(duration / 60)}:{String(duration % 60).padStart(2, "0")}
            </Typography>
          </Box>
          <LoopButtons
            startTime={startTime}
            endTime={endTime}
            isLooping={isLooping}
            duration={duration}
            setRange={setRange}
            seekTo={seekTo}
            toggleLoop={toggleLoop}
            clearLoop={clearLoop}
            state={state}
          />
        </Box>
      </Box>
    );
  }
);

export default CloudinaryPlayer;
