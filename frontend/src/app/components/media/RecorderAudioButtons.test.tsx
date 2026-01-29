import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import RecorderAudioButtons from "./RecorderAudioButtons";
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

describe("RecorderAudioButtons", () => {
  afterEach(() => {
    cleanup();
  });

  const mockLesson = {
    id: "1",
    title: "Test Lesson",
    status: "pending" as const,
    image: "https://example.com/image.jpg",
    video_id: "abc123",
    video_type: "youtube" as const,
    cloudinary_public_id: null,
    cloudinary_url: null,
    audio_file: "https://example.com/audio.webm",
    assigned_at: null,
    completed: false,
    completed_at: null,
    lesson_start_time: null,
    lesson_end_time: null,
    created_at: "2025-10-27T00:00:00Z",
    updated_at: "2025-10-27T00:00:00Z",
    feedback: null,
  };

  it("shows Delete and Submit buttons when lesson is not completed", () => {
    const pendingLesson = { ...mockLesson, status: "pending" as const };

    render(
      <RecorderPanelContextProvider selectedLesson={pendingLesson}>
        <RecorderAudioButtons selectedLesson={pendingLesson} />
      </RecorderPanelContextProvider>
    );

    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("does not show buttons when lesson is completed", () => {
    const completedLesson = { ...mockLesson, status: "completed" as const };

    render(
      <RecorderPanelContextProvider selectedLesson={completedLesson}>
        <RecorderAudioButtons selectedLesson={completedLesson} />
      </RecorderPanelContextProvider>
    );

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Submit")).not.toBeInTheDocument();
  });
});
