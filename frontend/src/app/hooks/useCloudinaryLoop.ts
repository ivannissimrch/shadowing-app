import { useState, useRef, useEffect, useCallback } from "react";
import { VideoPlayerRef } from "../components/media/playerTypes";
import { LoopState } from "../components/media/loopTypes";

export default function useCloudinaryLoop(
  playerRef: React.RefObject<VideoPlayerRef | null>
) {
  const [state, setState] = useState<LoopState>({ status: "idle" });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const setRange = useCallback((startTime: number, endTime: number) => {
    setState({ status: "ready", startTime, endTime });
  }, []);

  const toggleLoop = useCallback(() => {
    setState((prev) => {
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
