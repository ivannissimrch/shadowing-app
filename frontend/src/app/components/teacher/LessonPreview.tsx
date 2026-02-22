"use client";
import { useTranslations } from "next-intl";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import VideoScriptToggle from "../lesson/VideoScriptToggle";
import MainCard from "../ui/MainCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import { FiEdit2, FiUserPlus } from "react-icons/fi";
import AudioSegmenter from "../segments/AudioSegmenter";

interface LessonPreviewProps {
  lessonId: string;
  onEdit?: (lesson: Lesson) => void;
  onAssign?: (lesson: Lesson) => void;
}

export default function LessonPreview({
  lessonId,
  onEdit,
  onAssign,
}: LessonPreviewProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");

  const { data: lesson, isLoading } = useSWRAxios<Lesson>(
    API_PATHS.TEACHER_LESSON(lessonId)
  );

  if (isLoading) {
    return (
      <Box>
        <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!lesson) {
    return (
      <MainCard>
        <Typography color="text.secondary" textAlign="center" py={4}>
          Lesson not found
        </Typography>
      </MainCard>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary" }}>
            {lesson.title}
          </Typography>
          {lesson.category && (
            <Chip
              label={lesson.category}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: "secondary.light",
                color: "secondary.dark",
                fontWeight: 500,
              }}
            />
          )}
        </Box>

        {/* Actions */}
        <Box sx={{ display: "flex", gap: 1 }}>
          {onEdit && (
            <Button
              variant="outlined"
              startIcon={<FiEdit2 size={16} />}
              onClick={() => onEdit(lesson)}
              sx={{ textTransform: "none" }}
            >
              {tCommon("edit")}
            </Button>
          )}
          {onAssign && (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<FiUserPlus size={16} />}
              onClick={() => onAssign(lesson)}
              sx={{ textTransform: "none" }}
            >
              {t("assignLesson")}
            </Button>
          )}
        </Box>
      </Box>

      {/* Video and Script */}
      <MainCard title="Lesson Content" divider={true}>
        <VideoScriptToggle selectedLesson={lesson} />
      </MainCard>

      {/* Phrase Builder - only show if lesson has audio */}
      {(lesson.audio_url || lesson.cloudinary_url) && (
        <MainCard sx={{ mt: 3 }}>
          <AudioSegmenter
            lessonId={lesson.id}
            audioUrl={
              lesson.audio_url ||
              lesson.cloudinary_url!.replace("/upload/", "/upload/f_mp3/")
            }
          />
        </MainCard>
      )}
    </Box>
  );
}
