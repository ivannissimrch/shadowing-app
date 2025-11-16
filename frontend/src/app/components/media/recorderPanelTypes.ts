export type RecorderState =
  | {
      status: "idle";
    }
  | {
      status: "recording";
      startedAt: number;
    }
  | {
      status: "paused";
      startedAt: number;
      pausedAt: number;
    }
  | {
      status: "stopped";
      blob: Blob;
      audioURL: string;
    }
  | {
      status: "error";
      message: string;
    };

export type RecorderAction =
  | { type: "START_RECORDING"; startedAt: number }
  | { type: "PAUSE_RECORDING"; pausedAt: number }
  | { type: "RESUME_RECORDING" }
  | { type: "STOP_RECORDING"; blob: Blob; audioURL: string }
  | { type: "LOAD_EXISTING_AUDIO"; audioURL: string }
  | { type: "UPLOAD_SUCCESS" }
  | { type: "ERROR"; message: string }
  | { type: "RESET" };
