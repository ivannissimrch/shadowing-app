import {
  RecorderState,
  RecorderAction,
} from "@/app/components/media/recorderPanelTypes";

export function recorderReducer(
  state: RecorderState,
  action: RecorderAction
): RecorderState {
  switch (action.type) {
    case "START_RECORDING":
      if (state.status !== "idle" && state.status !== "error") {
        return state;
      }
      return { status: "recording", startedAt: action.startedAt };

    case "PAUSE_RECORDING":
      if (state.status !== "recording") {
        return state;
      }
      return {
        status: "paused",
        startedAt: state.startedAt,
        pausedAt: action.pausedAt,
      };

    case "RESUME_RECORDING":
      if (state.status !== "paused") {
        return state;
      }
      return {
        status: "recording",
        startedAt: state.startedAt,
      };

    case "STOP_RECORDING":
      if (state.status !== "recording" && state.status !== "paused") {
        return state;
      }
      return {
        status: "stopped",
        blob: action.blob,
        audioURL: action.audioURL,
      };

    case "UPLOAD_SUCCESS":
      if (state.status !== "stopped") {
        return state;
      }
      return {
        ...state,
      };

    case "ERROR":
      return {
        status: "error",
        message: action.message,
      };

    case "RESET":
      return {
        status: "idle",
      };

    default:
      return state;
  }
}
