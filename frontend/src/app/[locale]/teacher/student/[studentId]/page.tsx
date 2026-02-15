"use client";
import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { use } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import StudentInfo from "@/app/components/student/StudentInfo";
import ErrorFallback from "@/app/components/ui/ErrorFallback";
import { API_PATHS } from "@/app/constants/apiKeys";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import { Lesson } from "@/app/Types";
import { mutate } from "swr";
import Transitions from "@/app/components/ui/Transitions";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { FiBook, FiMic, FiChevronRight } from "react-icons/fi";

interface PracticeWord {
  id: number;
  word: string;
  created_at: string;
}

interface StudentPageProps {
  params: Promise<{ studentId: string }>;
}

export default function StudentPage({ params }: StudentPageProps) {
  const { studentId: id } = use(params);
  const t = useTranslations("teacher");
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const { data: lessons } = useSWRAxios<Lesson[]>(
    API_PATHS.TEACHER_STUDENT_LESSONS(id)
  );
  const { data: words } = useSWRAxios<PracticeWord[]>(
    API_PATHS.TEACHER_STUDENT_PRACTICE_WORDS(id)
  );

  return (
    <ErrorBoundary
      fallbackRender={(props) => (
        <ErrorFallback {...props} title="Failed to load student details" />
      )}
      onReset={() => {
        mutate(API_PATHS.TEACHER_STUDENT(id), undefined, { revalidate: true });
        mutate(API_PATHS.TEACHER_STUDENT_LESSONS(id), undefined, {
          revalidate: true,
        });
      }}
    >
      <Transitions type="fade">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <StudentInfo id={id} />

          <Card>
            <CardActionArea
              component={Link}
              href={`/teacher/student/${id}/lessons`}
              onClick={() => setNavigatingTo("lessons")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 3,
                }}
              >
                <FiBook size={24} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t("assignedLessons")}
                  </Typography>
                </Box>
                {lessons && (
                  <Chip
                    label={lessons.length}
                    size="small"
                    color="primary"
                  />
                )}
                {navigatingTo === "lessons" ? (
                  <CircularProgress size={20} />
                ) : (
                  <FiChevronRight size={20} />
                )}
              </CardContent>
            </CardActionArea>
          </Card>

          <Card>
            <CardActionArea
              component={Link}
              href={`/teacher/student/${id}/practice`}
              onClick={() => setNavigatingTo("practice")}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  py: 3,
                }}
              >
                <FiMic size={24} />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {t("practiceWords")}
                  </Typography>
                </Box>
                {words && (
                  <Chip
                    label={words.length}
                    size="small"
                    color="secondary"
                  />
                )}
                {navigatingTo === "practice" ? (
                  <CircularProgress size={20} />
                ) : (
                  <FiChevronRight size={20} />
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Box>
      </Transitions>
    </ErrorBoundary>
  );
}
