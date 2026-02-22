"use client";
import RecorderPanel from "../media/RecorderPanel";
import { Lesson, AudioSegment } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import RecorderPanelContextProvider from "@/app/RecorderpanelContext";
import VideoScriptToggle from "./VideoScriptToggle";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import Button from "@mui/material/Button";
import { FiMessageSquare } from "react-icons/fi";

export function LessonPracticeView({ id }: { id: string }) {
  const t = useTranslations("practiceWords");
  const { data: selectedLesson } = useSWRAxios<Lesson>(API_PATHS.LESSON(id));
  const { data: segments } = useSWRAxios<AudioSegment[]>(
    selectedLesson ? API_PATHS.LESSON_SEGMENTS(id) : null
  );

  const hasSegments = segments && segments.length > 0;

  return (
    <>
      {selectedLesson && (
        <RecorderPanelContextProvider selectedLesson={selectedLesson}>
          <VideoScriptToggle
            selectedLesson={selectedLesson}
            belowVideo={
              <>
                {hasSegments && (
                  <Button
                    component={Link}
                    href={`/student/practice?lessonId=${id}`}
                    variant="outlined"
                    startIcon={<FiMessageSquare size={16} />}
                    sx={{ textTransform: "none", fontWeight: 500 }}
                  >
                    {t("practicePhrases")}
                  </Button>
                )}
                <RecorderPanel selectedLesson={selectedLesson} />
              </>
            }
          />
        </RecorderPanelContextProvider>
      )}
    </>
  );
}
