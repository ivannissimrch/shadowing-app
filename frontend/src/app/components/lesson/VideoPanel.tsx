"use client";
import { Box, Paper, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { MdOndemandVideo, MdRecordVoiceOver } from "react-icons/md";
import SegmentPlayer from "../media/SegmentPlayer";
import PracticePhrases from "../ui/PracticePhrases";
import useVideoPhrasesToggle from "@/app/hooks/useVideoPhrasesToggle";
import { Lesson } from "@/app/Types";
import RecorderPanel from "../media/RecorderPanel";

export default function VideoPanel({
  belowVideo,
  selectedLesson,
  currentUserId,
}: {
  belowVideo?: React.ReactNode;
  selectedLesson: Lesson;
  currentUserId: string;
}) {
  const { isVideoVisible, toggleVideoPhrases } = useVideoPhrasesToggle();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        minHeight: { lg: 0 },
        overflow: { lg: "hidden" },
      }}
    >
      <Paper
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
          bgcolor: "#ffffff",
          flex: { lg: 1 },
          minHeight: { lg: 0 },
          display: { lg: "flex" },
          flexDirection: { lg: "column" },
          ...(!isVideoVisible && { maxHeight: "60vh", overflowY: "auto" }),
        }}
      >
        <Box
          sx={{
            px: 2,
            pt: 1,
            pb: 0.5,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <ToggleButtonGroup
            value={isVideoVisible ? "video" : "practice"}
            exclusive
            onChange={toggleVideoPhrases}
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                px: 1,
                py: 0,
                Height: 18,
                margin: 0.5,
                color: "text.secondary",
                borderColor: "#e0e0e0",
                borderRadius: 1,
                "&.Mui-selected": {
                  color: "primary.main",
                  bgcolor: "primary.lighter",
                  "&:hover": { bgcolor: "primary.lighter" },
                },
              },
            }}
          >
            <ToggleButton value="video">
              <MdOndemandVideo size={16} />
              Video
            </ToggleButton>
            <ToggleButton value="practice">
              <MdRecordVoiceOver size={16} />
              Practice
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
        {isVideoVisible ? (
          <SegmentPlayer selectedLesson={selectedLesson} />
        ) : (
          <PracticePhrases
            selectedLesson={selectedLesson}
            userId={currentUserId}
          />
        )}
      </Paper>
      {belowVideo ?? <RecorderPanel selectedLesson={selectedLesson} />}
    </Box>
  );
}
