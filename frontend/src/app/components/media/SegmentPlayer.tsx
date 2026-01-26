import { Lesson } from "../../Types";
import YouTubePlayer from "./YouTubePlayer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SegmentPlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function SegmentPlayer({ selectedLesson }: SegmentPlayerProps) {
  if (!selectedLesson) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">Lesson not found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%" }}>
      <YouTubePlayer selectedLesson={selectedLesson} />
    </Box>
  );
}
