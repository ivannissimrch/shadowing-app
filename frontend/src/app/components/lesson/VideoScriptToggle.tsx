"use client";
import { Lesson } from "@/app/Types";
import Box from "@mui/material/Box";
import useCurrentUserId from "@/app/hooks/useCurrentUserId";
import VideoPanel from "./VideoPanel";
import ScriptPanel from "./ScriptPanel";
import LessonFeedback from "./LessonFeedback";

interface VideoScriptToggleProps {
  selectedLesson: Lesson;
  belowVideo?: React.ReactNode;
  hideFeedback?: boolean;
}

export default function VideoScriptToggle({
  selectedLesson,
  belowVideo,
  hideFeedback = false,
}: VideoScriptToggleProps) {
  const currentUserId = useCurrentUserId();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          alignItems: { xs: "start", lg: "stretch" },
          gap: 3,
          flex: { lg: 1 },
          minHeight: { lg: 0 },
        }}
      >
        <VideoPanel
          belowVideo={belowVideo}
          selectedLesson={selectedLesson}
          currentUserId={currentUserId}
        />
        <ScriptPanel selectedLesson={selectedLesson} />
      </Box>
      {!hideFeedback && selectedLesson.feedback && (
        <LessonFeedback selectedLesson={selectedLesson} />
      )}
    </Box>
  );
}
