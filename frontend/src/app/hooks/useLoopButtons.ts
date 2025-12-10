import { useReducer, useRef, useEffect, useCallback } from "react";
import { YouTubePlayer as YTPlayer } from "react-youtube";
import { loopReducer } from "@/app/helpers/loopReducer";
import { LoopState } from "@/app/components/media/loopTypes";
const PLAYER_UPDATE_INTERVAL_MS = 100;

export default function useLoopButtons(
  playerRef: React.RefObject<YTPlayer | null>
) {
  const initialLoopState: LoopState = { status: "idle" };
  const [state, dispatch] = useReducer(loopReducer, initialLoopState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const updateStartAtCurrentTime = useCallback(() => {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.getCurrentTime());
      dispatch({ type: "SET_START", time });
    }
  }, [playerRef]);

  const updateEndAtCurrentTime = useCallback(() => {
    if (playerRef.current) {
      const time = Math.floor(playerRef.current.getCurrentTime());
      dispatch({ type: "SET_END", time });
    }
  }, [playerRef]);

  const toggleLoop = useCallback(() => {
    if (state.status === "ready") {
      dispatch({ type: "START_LOOP" });
    } else if (state.status === "looping") {
      dispatch({ type: "STOP_LOOP" });
    }
  }, [state.status]);

  const clearLoop = useCallback(() => {
    dispatch({ type: "CLEAR" });
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
      const currentTime = playerRef.current?.getCurrentTime() ?? 0;
      if (playerRef.current && currentTime >= state.endTime) {
        playerRef.current.seekTo(state.startTime, true);
      }
    }, PLAYER_UPDATE_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    updateStartAtCurrentTime,
    updateEndAtCurrentTime,
    toggleLoop,
    clearLoop,
    state,
  };
}
