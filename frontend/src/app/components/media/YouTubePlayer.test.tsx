import { it, describe, vi, expect, afterEach, beforeEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import YouTubePlayer from "./YouTubePlayer";
import { Lesson } from "../../Types";

// ========================================
// STEP 2: MOCK EXTERNAL DEPENDENCIES
// ========================================

// Mock the react-youtube library
// This is needed because we can't actually load YouTube in tests
vi.mock("react-youtube", () => ({
  default: () => {
    // Return a simple div that we can test against
    return <div data-testid="youtube-player">YouTube Player Mock</div>;
  },
  YouTubePlayer: vi.fn(),
}));

// Mock the child components (we're testing YouTubePlayer, not these)
vi.mock("./VideoTimer", () => ({
  default: ({ currentTime }: { currentTime: number }) => (
    <div data-testid="video-timer">Current time: {currentTime}</div>
  ),
}));

vi.mock("./LoopButtons", () => ({
  default: ({
    startTime,
    endTime,
    isLooping,
    updateStartAtCurrentTime,
    updateEndAtCurrentTime,
    toggleLoop,
    clearLoop,
  }: {
    startTime: number | null;
    endTime: number | null;
    isLooping: boolean;
    updateStartAtCurrentTime: () => void;
    updateEndAtCurrentTime: () => void;
    toggleLoop: () => void;
    clearLoop: () => void;
  }) => (
    <div data-testid="loop-buttons">
      <button onClick={updateStartAtCurrentTime}>Set Start</button>
      <button onClick={updateEndAtCurrentTime}>Set End</button>
      {startTime !== null && endTime !== null && (
        <>
          <button onClick={toggleLoop}>
            {isLooping ? "Loop ON" : "Start Loop"}
          </button>
          <button onClick={clearLoop}>Clear</button>
        </>
      )}
    </div>
  ),
}));

vi.mock("./LoopSegmentInfo", () => ({
  default: ({
    startTime,
    endTime,
  }: {
    startTime: number | null;
    endTime: number | null;
  }) => (
    <div data-testid="loop-segment-info">
      Segment: {startTime} - {endTime}
    </div>
  ),
}));

// ========================================
// STEP 3: MOCK TIMERS (IMPORTANT!)
// ========================================
// This tells Vitest to replace real timers with fake ones we can control
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.clearAllTimers(); // Clear any pending timers
  vi.restoreAllMocks(); // Restore original functions
});

// ========================================
// STEP 4: CREATE TEST DATA
// ========================================
describe("YouTubePlayer", () => {
  const mockLesson: Lesson = {
    id: "1",
    title: "Test Lesson",
    status: "pending" as const,
    image: "https://example.com/image.jpg",
    video_id: "abc123",
    audio_file: "",
    assigned_at: null,
    completed: false,
    completed_at: null,
    lesson_start_time: null,
    lesson_end_time: null,
    created_at: "2025-10-27T00:00:00Z",
    updated_at: "2025-10-27T00:00:00Z",
    feedback: null,
  };

  // ========================================
  // STEP 5: BASIC RENDERING TESTS
  // ========================================

  it("renders YouTubePlayer component with all child components", () => {
    render(<YouTubePlayer selectedLesson={mockLesson} />);

    // Check that all parts are rendered
    expect(screen.getByTestId("youtube-player")).toBeInTheDocument();
    expect(screen.getByTestId("video-timer")).toBeInTheDocument();
    expect(screen.getByTestId("loop-buttons")).toBeInTheDocument();
  });

  it("shows loading state when no lesson is provided", () => {
    render(<YouTubePlayer selectedLesson={undefined} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  // ========================================
  // STEP 6: TEST BUTTON INTERACTIONS
  // ========================================

  it("shows loop controls only after setting both start and end times", () => {
    render(<YouTubePlayer selectedLesson={mockLesson} />);

    // Initially, loop buttons should NOT be visible
    expect(screen.queryByText("Start Loop")).not.toBeInTheDocument();
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();

    // TODO: We'll add interaction tests in the next step
  });

  // ========================================
  // STEP 7: TEST INTERVAL CLEANUP
  // ========================================

  it("renders without crashing and unmounts cleanly", () => {
    // This test verifies the component mounts and unmounts without errors
    const { unmount } = render(<YouTubePlayer selectedLesson={mockLesson} />);

    // If unmount doesn't throw an error, cleanup is working
    expect(() => unmount()).not.toThrow();
  });
});
