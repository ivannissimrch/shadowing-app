"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useSWRAxios } from "../../../hooks/useSWRAxios";
import { API_PATHS } from "../../../constants/apiKeys";
import { useAuthContext } from "../../../AuthContext";
import PracticeCard from "@/app/components/ui/PracticeCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import type { AudioSegment, Lesson } from "../../../Types";

interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  native_language: string | null;
  role: string;
}

export default function LessonPhrasesList() {
  const t = useTranslations("practiceWords");
  const searchParams = useSearchParams();
  const preselectedLessonId = searchParams.get("lessonId");

  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    preselectedLessonId || ""
  );

  // Fetch student's assigned lessons for the dropdown
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.LESSONS);

  // Fetch segments for the selected lesson
  const { data: segments } = useSWRAxios<AudioSegment[]>(
    selectedLessonId ? API_PATHS.LESSON_SEGMENTS(selectedLessonId) : null
  );

  // Fetch user profile for native language (AI coaching)
  const { token } = useAuthContext();
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const { data: profile } = useSWRAxios<UserProfile>(
    user?.id ? API_PATHS.USER_PROFILE(user.id) : null
  );

  // Find the selected lesson to get its audio_url
  const selectedLesson = lessons?.find((l) => l.id === selectedLessonId);

  if (!lessons || lessons.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", py: 4 }}
      >
        {t("noLessonsWithSegments")}
      </Typography>
    );
  }

  return (
    <Box>
      {/* Lesson selector dropdown */}
      <TextField
        select
        fullWidth
        label={t("selectLesson")}
        value={selectedLessonId}
        onChange={(e) => setSelectedLessonId(e.target.value)}
        size="small"
        sx={{ mb: 3 }}
      >
        {lessons.map((lesson) => (
          <MenuItem key={lesson.id} value={lesson.id}>
            {lesson.title}
          </MenuItem>
        ))}
      </TextField>

      {/* Segments list */}
      {selectedLessonId && segments && segments.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {segments.map((segment) => (
            <PracticeCard
              key={segment.id}
              text={segment.label}
              nativeLanguage={profile?.native_language}
              audioSegment={
                selectedLesson?.audio_url || selectedLesson?.cloudinary_url
                  ? {
                      audioUrl:
                        selectedLesson.audio_url ||
                        selectedLesson.cloudinary_url!.replace(
                          "/upload/",
                          "/upload/f_mp3/"
                        ),
                      startTime: segment.start_time,
                      endTime: segment.end_time,
                    }
                  : undefined
              }
            />
          ))}
        </Box>
      )}

      {/* Empty state - lesson selected but no segments */}
      {selectedLessonId && segments && segments.length === 0 && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          {t("noSegments")}
        </Typography>
      )}

      {/* No lesson selected yet */}
      {!selectedLessonId && (
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ textAlign: "center", py: 4 }}
        >
          {t("selectLesson")}
        </Typography>
      )}
    </Box>
  );
}
