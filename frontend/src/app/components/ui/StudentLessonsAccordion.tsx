"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import { API_PATHS } from "@/app/constants/apiKeys";
import { StudentProgressWithLessons } from "@/app/Types";
import MainCard from "./MainCard";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import CircularProgress from "@mui/material/CircularProgress";
import { FiUsers, FiChevronDown, FiChevronRight } from "react-icons/fi";

const MAX_LESSONS_PER_STUDENT = 5;

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getProgressColor(
  percent: number
): "success" | "warning" | "error" | "primary" {
  if (percent >= 75) return "success";
  if (percent >= 50) return "primary";
  if (percent >= 25) return "warning";
  return "error";
}

function getStatusColor(
  status: string
): "success" | "warning" | "default" {
  if (status === "completed") return "success";
  if (status === "submitted") return "warning";
  return "default";
}

export default function StudentLessonsAccordion() {
  const tDashboard = useTranslations("dashboard");
  const tLesson = useTranslations("lesson");
  const tCommon = useTranslations("common");
  const [navigatingLessonId, setNavigatingLessonId] = useState<string | null>(null);

  const { data: students, isLoading } =
    useSWRAxios<StudentProgressWithLessons[]>(API_PATHS.STUDENTS_WITH_LESSONS);

  if (isLoading) {
    return (
      <MainCard title={tDashboard("studentLessons")}>
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton
                    variant="rectangular"
                    height={6}
                    sx={{ mt: 1, borderRadius: 1 }}
                  />
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </MainCard>
    );
  }

  const studentList = students || [];

  return (
    <MainCard
      title={tDashboard("studentLessons")}
      contentSX={{ p: 0 }}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ p: 2.5, pt: 0, flex: 1 }}>
        {studentList.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <FiUsers size={32} color="#9e9e9e" />
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 1 }}
            >
              {tDashboard("noStudents")}
            </Typography>
          </Box>
        ) : (
          studentList.map((student) => {
            const percent =
              student.totalLessons > 0
                ? Math.round(
                    (student.completedLessons / student.totalLessons) * 100
                  )
                : 0;
            const progressColor = getProgressColor(percent);
            const visibleLessons = student.lessons.slice(
              0,
              MAX_LESSONS_PER_STUDENT
            );

            return (
              <Accordion
                key={student.id}
                disableGutters
                elevation={0}
                sx={{
                  "&:before": { display: "none" },
                  borderBottom: "1px solid",
                  borderColor: "divider",
                  "&:last-of-type": { borderBottom: "none" },
                }}
              >
                <AccordionSummary
                  expandIcon={<FiChevronDown size={16} />}
                  sx={{ px: 0, "& .MuiAccordionSummary-content": { my: 1.5 } }}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{ alignItems: "center", flex: 1, mr: 1 }}
                  >
                    <Avatar
                      sx={{
                        width: 36,
                        height: 36,
                        bgcolor: "primary.light",
                        color: "primary.dark",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(student.username)}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack
                        direction="row"
                        sx={{
                          alignItems: "center",
                          justifyContent: "space-between",
                          mb: 0.5,
                        }}
                      >
                        <Typography
                          variant="subtitle2"
                          sx={{
                            color: "text.primary",
                            fontWeight: 500,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {student.username}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: `${progressColor}.main`,
                            fontWeight: 600,
                            ml: 1,
                          }}
                        >
                          {percent}%
                        </Typography>
                      </Stack>
                      <LinearProgress
                        variant="determinate"
                        value={percent}
                        color={progressColor}
                        sx={{
                          height: 6,
                          borderRadius: 1,
                          bgcolor: "grey.100",
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          mt: 0.25,
                          display: "block",
                        }}
                      >
                        {student.totalLessons > 0
                          ? tDashboard("lessonsAssigned", {
                              completed: student.completedLessons,
                              total: student.totalLessons,
                            })
                          : tDashboard("noLessonsAssigned")}
                      </Typography>
                    </Box>
                  </Stack>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 0, pt: 0, pb: 1.5 }}>
                  {visibleLessons.length === 0 ? (
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary", pl: 6.5 }}
                    >
                      {tDashboard("noLessonsAssigned")}
                    </Typography>
                  ) : (
                    <Stack spacing={0.5}>
                      {visibleLessons.map((lesson) => (
                        <Box
                          key={lesson.lesson_id}
                          component={Link}
                          href={`/teacher/student/${student.id}/lesson/${lesson.lesson_id}`}
                          onClick={() => setNavigatingLessonId(lesson.lesson_id)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            py: 0.75,
                            px: 1,
                            ml: 5.5,
                            borderRadius: 1,
                            textDecoration: "none",
                            "&:hover": { bgcolor: "action.hover" },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "text.primary",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              flex: 1,
                              mr: 1,
                            }}
                          >
                            {lesson.lesson_title}
                          </Typography>
                          {navigatingLessonId === lesson.lesson_id ? (
                            <CircularProgress size={16} />
                          ) : (
                            <Chip
                              label={
                                lesson.status === "completed"
                                  ? tLesson("completed")
                                  : lesson.status === "submitted"
                                    ? tLesson("submitted")
                                    : tLesson("new")
                              }
                              size="small"
                              color={getStatusColor(lesson.status)}
                              sx={{ height: 22, fontSize: "0.7rem" }}
                            />
                          )}
                        </Box>
                      ))}
                      {student.lessons.length > MAX_LESSONS_PER_STUDENT && (
                        <Box sx={{ pl: 6.5, pt: 0.5 }}>
                          <Button
                            component={Link}
                            href={`/teacher/student/${student.id}`}
                            size="small"
                            sx={{ textTransform: "none", p: 0 }}
                          >
                            {tCommon("viewAll")}
                          </Button>
                        </Box>
                      )}
                    </Stack>
                  )}
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Box>
      {studentList.length > 0 && (
        <CardActions
          sx={{
            p: 1.25,
            pt: 0,
            justifyContent: "center",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            component={Link}
            href="/teacher/students"
            size="small"
            disableElevation
            endIcon={<FiChevronRight size={14} />}
            sx={{ textTransform: "none" }}
          >
            {tCommon("viewAll")}
          </Button>
        </CardActions>
      )}
    </MainCard>
  );
}
