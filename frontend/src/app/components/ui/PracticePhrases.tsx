import { API_PATHS } from "@/app/constants/apiKeys";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import { AudioSegment, Lesson } from "@/app/Types";
import Box from "@mui/material/Box";
import PracticeCard from "./PracticeCard";
import { UserProfile } from "@/app/[locale]/student/practice/LessonPhrasesList";
import PracticePhraseSkeleton from "./PracticePhraseSkeleton";

interface PracticePhrasesProps {
  selectedLesson: Lesson;
  userId: string;
}

export default function PracticePhrases({
  selectedLesson,
  userId,
}: PracticePhrasesProps) {
  const { data: segments, isLoading: isSegmentsLoading } = useSWRAxios<
    AudioSegment[]
  >(selectedLesson.id ? API_PATHS.LESSON_SEGMENTS(selectedLesson.id) : null);
  const { data: profile, isLoading: isProfileLoading } =
    useSWRAxios<UserProfile>(userId ? API_PATHS.USER_PROFILE(userId) : null);

  if (isSegmentsLoading || isProfileLoading) {
    return <PracticePhraseSkeleton />;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {segments?.map((segment) => (
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
  );
}
