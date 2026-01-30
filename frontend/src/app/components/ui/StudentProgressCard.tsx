"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import MainCard from "./MainCard";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Skeleton from "@mui/material/Skeleton";
import { FiUsers, FiChevronRight } from "react-icons/fi";

export interface StudentProgress {
  id: string;
  username: string;
  name?: string;
  totalLessons: number;
  completedLessons: number;
}

interface StudentProgressCardProps {
  students: StudentProgress[] | undefined;
  isLoading?: boolean;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getProgressColor(percent: number): "success" | "warning" | "error" | "primary" {
  if (percent >= 75) return "success";
  if (percent >= 50) return "primary";
  if (percent >= 25) return "warning";
  return "error";
}

export default function StudentProgressCard({ students, isLoading }: StudentProgressCardProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return (
      <MainCard title="Student Progress">
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i}>
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Skeleton variant="circular" width={36} height={36} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="50%" height={20} />
                  <Skeleton variant="rectangular" height={6} sx={{ mt: 1, borderRadius: 1 }} />
                </Box>
              </Stack>
              {i < 5 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </MainCard>
    );
  }

  const topStudents = students?.slice(0, 5) || [];

  return (
    <MainCard
      title="Student Progress"
      contentSX={{ p: 0 }}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ p: 2.5, pt: 0, flex: 1 }}>
        {topStudents.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <FiUsers size={32} color="#9e9e9e" />
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              No students yet
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {topStudents.map((student, index) => {
              const percent = student.totalLessons > 0
                ? Math.round((student.completedLessons / student.totalLessons) * 100)
                : 0;
              const progressColor = getProgressColor(percent);
              const displayName = student.name || student.username;

              return (
                <Box key={student.id}>
                  <Box
                    component={Link}
                    href={`/teacher/student/${student.id}`}
                    sx={{
                      display: "block",
                      py: 1.5,
                      textDecoration: "none",
                      "&:hover": {
                        bgcolor: "action.hover",
                        mx: -2.5,
                        px: 2.5,
                      },
                    }}
                  >
                    <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
                        {getInitials(displayName)}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Stack
                          direction="row"
                          sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.5 }}
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
                            {displayName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: `${progressColor}.main`, fontWeight: 600, ml: 1 }}
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
                        <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.25, display: "block" }}>
                          {student.completedLessons} of {student.totalLessons} lessons
                        </Typography>
                      </Box>
                      <FiChevronRight size={16} color="#9e9e9e" />
                    </Stack>
                  </Box>
                  {index < topStudents.length - 1 && <Divider />}
                </Box>
              );
            })}
          </Stack>
        )}
      </Box>
      {topStudents.length > 0 && (
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: "center", borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            component={Link}
            href="/teacher/students"
            size="small"
            disableElevation
            endIcon={<FiChevronRight size={14} />}
            sx={{ textTransform: "none" }}
          >
            {t("viewAll")}
          </Button>
        </CardActions>
      )}
    </MainCard>
  );
}
