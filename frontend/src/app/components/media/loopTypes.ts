//Where to place this file is debatable, but for now it lives here.

export type LoopState =
  | { status: "idle" }
  | { status: "start_set"; startTime: number }
  | { status: "ready"; startTime: number; endTime: number }
  | { status: "looping"; startTime: number; endTime: number };

export type LoopAction =
  | { type: "SET_START"; time: number }
  | { type: "SET_END"; time: number }
  | { type: "SET_RANGE"; startTime: number; endTime: number }
  | { type: "START_LOOP" }
  | { type: "STOP_LOOP" }
  | { type: "CLEAR" };
