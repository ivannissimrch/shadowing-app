import { it, describe, vi, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import RecorderPanel from "./RecorderPanel";
import RecorderPanelContextProvider from "@/app/RecorderpanelContext";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

vi.mock("../../AppContext", () => ({
  useAppContext: () => ({
    openAlertDialog: vi.fn(),
    token: "fake-token",
  }),
}));

describe("RecorderPanel", () => {
  afterEach(() => {
    cleanup();
  });

  const mockLesson = {
    id: "1",
    title: "Test Lesson",
    status: "pending" as const,
    image: "https://example.com/image.jpg",
    script_text: null,
    script_type: "image" as const,
    video_id: "abc123",
    video_type: "youtube" as const,
    cloudinary_public_id: null,
    cloudinary_url: null,
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

  it("renders RecorderPanel component", () => {
    render(
      <RecorderPanelContextProvider selectedLesson={mockLesson}>
        <RecorderPanel selectedLesson={mockLesson} />
      </RecorderPanelContextProvider>
    );
  });

  it("shows voice recorder when no audio has been recorded", () => {
    const lessonWithoutAudio = { ...mockLesson, audio_file: "" };

    render(
      <RecorderPanelContextProvider selectedLesson={lessonWithoutAudio}>
        <RecorderPanel selectedLesson={lessonWithoutAudio} />
      </RecorderPanelContextProvider>
    );

    expect(screen.getByText("Tap to record")).toBeInTheDocument();
    expect(screen.getByText("Start Recording")).toBeInTheDocument();
  });

  it("does not show voice recorder when audio exists", () => {
    const lessonWithAudio = {
      ...mockLesson,
      audio_file: "https://example.com/audio.webm",
    };

    render(
      <RecorderPanelContextProvider selectedLesson={lessonWithAudio}>
        <RecorderPanel selectedLesson={lessonWithAudio} />
      </RecorderPanelContextProvider>
    );

    expect(screen.queryByText("Start Recording")).not.toBeInTheDocument();
  });

  it("shows feedback when teacher provided feedback", () => {
    const lessonWithFeedback = {
      ...mockLesson,
      audio_file: "https://example.com/audio.webm",
      feedback: "Great job on your pronunciation!",
    };

    render(
      <RecorderPanelContextProvider selectedLesson={lessonWithFeedback}>
        <RecorderPanel selectedLesson={lessonWithFeedback} />
      </RecorderPanelContextProvider>
    );

    expect(
      screen.getByText("Great job on your pronunciation!")
    ).toBeInTheDocument();
  });
});
