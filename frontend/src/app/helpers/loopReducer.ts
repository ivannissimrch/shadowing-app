import { LoopState, LoopAction } from "@/app/components/media/loopTypes";

export function loopReducer(state: LoopState, action: LoopAction): LoopState {
  switch (action.type) {
    case "SET_START":
      return { status: "start_set", startTime: action.time };

    case "SET_END":
      if (state.status === "idle") {
        return state;
      }
      return {
        status: "ready",
        startTime: state.startTime,
        endTime: action.time,
      };

    case "START_LOOP":
      if (state.status !== "ready") {
        return state;
      }
      return { ...state, status: "looping" };

    case "STOP_LOOP":
      if (state.status !== "looping") {
        return state;
      }
      return { ...state, status: "ready" };

    case "CLEAR":
      return { status: "idle" };
  }
}
