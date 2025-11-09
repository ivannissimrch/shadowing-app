import { describe, it, expect } from "vitest";
import { loopReducer } from "./loopReducer";
import { LoopState, LoopAction } from "@/app/components/media/loopTypes";

describe("loopReducer", () => {
  it("should set start time when status is idle", () => {
    const initialState: LoopState = { status: "idle" };

    const action: LoopAction = { type: "SET_START", time: 10 };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual({
      status: "start_set",
      startTime: 10,
    });
  });

  it("should set end time when status is start_set", () => {
    const initialState: LoopState = {
      status: "start_set",
      startTime: 10,
    };

    const action: LoopAction = { type: "SET_END", time: 20 };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual({
      status: "ready",
      startTime: 10,
      endTime: 20,
    });
  });

  it("should NOT set end time when status is idle (blocks bad UX)", () => {
    const initialState: LoopState = { status: "idle" };

    const action: LoopAction = { type: "SET_END", time: 20 };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual(initialState);
    expect(newState.status).toBe("idle");
  });

  it("should update end time when already ready", () => {
    const initialState: LoopState = {
      status: "ready",
      startTime: 10,
      endTime: 20,
    };

    const action: LoopAction = { type: "SET_END", time: 25 };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual({
      status: "ready",
      startTime: 10,
      endTime: 25,
    });
  });

  it("should start looping when status is ready", () => {
    const initialState: LoopState = {
      status: "ready",
      startTime: 10,
      endTime: 20,
    };

    const action: LoopAction = { type: "START_LOOP" };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual({
      status: "looping",
      startTime: 10,
      endTime: 20,
    });
  });

  it("should NOT start looping when status is idle", () => {
    const initialState: LoopState = { status: "idle" };

    const action: LoopAction = { type: "START_LOOP" };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual(initialState);
    expect(newState.status).toBe("idle");
  });

  it("should NOT start looping when status is start_set", () => {
    const initialState: LoopState = {
      status: "start_set",
      startTime: 10,
    };

    const action: LoopAction = { type: "START_LOOP" };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it("should stop looping when status is looping", () => {
    const initialState: LoopState = {
      status: "looping",
      startTime: 10,
      endTime: 20,
    };

    const action: LoopAction = { type: "STOP_LOOP" };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual({
      status: "ready",
      startTime: 10,
      endTime: 20,
    });
  });

  it("should NOT stop looping when not currently looping", () => {
    const initialState: LoopState = {
      status: "ready",
      startTime: 10,
      endTime: 20,
    };

    const action: LoopAction = { type: "STOP_LOOP" };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual(initialState);
  });

  it("should clear all state and return to idle", () => {
    const initialState: LoopState = {
      status: "looping",
      startTime: 10,
      endTime: 20,
    };

    const action: LoopAction = { type: "CLEAR" };
    const newState = loopReducer(initialState, action);
    expect(newState).toEqual({ status: "idle" });
  });

  it("should clear from any state", () => {
    const state1: LoopState = { status: "start_set", startTime: 5 };
    expect(loopReducer(state1, { type: "CLEAR" })).toEqual({ status: "idle" });

    const state2: LoopState = { status: "ready", startTime: 5, endTime: 10 };
    expect(loopReducer(state2, { type: "CLEAR" })).toEqual({ status: "idle" });

    const state3: LoopState = { status: "idle" };
    expect(loopReducer(state3, { type: "CLEAR" })).toEqual({ status: "idle" });
  });

  it("should preserve times when transitioning between ready and looping", () => {
    let state: LoopState = {
      status: "ready",
      startTime: 10,
      endTime: 20,
    };

    state = loopReducer(state, { type: "START_LOOP" });
    expect(state.status).toBe("looping");
    if (state.status === "looping") {
      expect(state.startTime).toBe(10);
      expect(state.endTime).toBe(20);
    }

    state = loopReducer(state, { type: "STOP_LOOP" });
    expect(state.status).toBe("ready");
    if (state.status === "ready") {
      expect(state.startTime).toBe(10);
      expect(state.endTime).toBe(20);
    }
  });
});
