import { render, screen, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import RecorderVoiceRecorder from "./RecorderVoiceRecorder";
import RecorderPanelContextProvider from "@/app/RecorderpanelContext";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    pathname: "/",
    query: {},
  }),
}));

vi.mock("../../AppContext", () => ({
  useAppContext: () => ({
    openAlertDialog: vi.fn(),
    closeAlertDialog: vi.fn(),
    token: "fake-token",
    updateToken: vi.fn(),
  }),
}));

const mockLesson = {
  id: "1",
  title: "Test Lesson",
  status: "pending",
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

describe("RecorderVoiceRecorder", () => {
  afterEach(() => {
    cleanup();
  });

  it('shows "Start Recording" button when not recording', () => {
    render(
      <RecorderPanelContextProvider selectedLesson={mockLesson}>
        <RecorderVoiceRecorder />
      </RecorderPanelContextProvider>
    );

    const startButton = screen.getByText("Start Recording");
    expect(startButton).toBeInTheDocument();
  });

  it('shows "Tap to record" message when not recording', () => {
    render(
      <RecorderPanelContextProvider selectedLesson={mockLesson}>
        <RecorderVoiceRecorder />
      </RecorderPanelContextProvider>
    );

    expect(screen.getByText("Tap to record")).toBeInTheDocument();
  });

  it('does not show "Recording..." message initially', () => {
    render(
      <RecorderPanelContextProvider selectedLesson={mockLesson}>
        <RecorderVoiceRecorder />
      </RecorderPanelContextProvider>
    );

    const recordingMessage = screen.queryByText("Recording...");
    expect(recordingMessage).not.toBeInTheDocument();
  });
});
