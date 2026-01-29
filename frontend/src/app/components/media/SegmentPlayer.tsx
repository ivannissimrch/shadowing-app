import { useTranslations } from "next-intl";
import { Lesson } from "../../Types";
import YouTubePlayer from "./YouTubePlayer";
import CloudinaryPlayer from "./CloudinaryPlayer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface SegmentPlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function SegmentPlayer({ selectedLesson }: SegmentPlayerProps) {
  const t = useTranslations("lesson");

  if (!selectedLesson) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">{t("lessonNotFound")}</Typography>
      </Box>
    );
  }

  // Determine which player to use based on video_type
  const videoType = selectedLesson.video_type || 'youtube';

  return (
    <Box sx={{ width: "100%" }}>
      {videoType === 'cloudinary' && selectedLesson.cloudinary_public_id ? (
        <CloudinaryPlayer selectedLesson={selectedLesson} />
      ) : (
        <YouTubePlayer selectedLesson={selectedLesson} />
      )}
    </Box>
  );
}
