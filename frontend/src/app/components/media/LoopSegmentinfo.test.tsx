import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import LoopSegmentInfo from "./LoopSegmentInfo";

describe("LoopSegmentInfo", () => {
  afterEach(() => {
    cleanup();
  });

  const mockedStartTime = 20;
  const mockedEndTime = 30;

  it("shows loop segment information when start and end times are set", () => {
    render(
      <LoopSegmentInfo startTime={mockedStartTime} endTime={mockedEndTime} />
    );

    expect(
      screen.getByText("Loop segment: 0:20 → 0:30 (10s)")
    ).toBeInTheDocument();
  });
});
