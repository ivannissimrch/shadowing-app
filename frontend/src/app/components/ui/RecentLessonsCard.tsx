"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Lesson } from "../../Types";
import MainCard from "./MainCard";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import CardActions from "@mui/material/CardActions";
import Skeleton from "@mui/material/Skeleton";
import { FiBook, FiChevronRight } from "react-icons/fi";

interface RecentLessonsCardProps {
  lessons: Lesson[] | undefined;
  isLoading?: boolean;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RecentLessonsCard({ lessons, isLoading }: RecentLessonsCardProps) {
  const t = useTranslations("common");

  if (isLoading) {
    return (
      <MainCard title="Recent Lessons">
        <Stack spacing={2}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i}>
              <Skeleton variant="text" width="60%" height={24} />
              <Skeleton variant="text" width="30%" height={18} />
              {i < 5 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </MainCard>
    );
  }

  const recentLessons = lessons?.slice(0, 5) || [];

  return (
    <MainCard
      title="Recent Lessons"
      contentSX={{ p: 0 }}
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box sx={{ p: 2.5, pt: 0, flex: 1 }}>
        {recentLessons.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center" }}>
            <FiBook size={32} color="#9e9e9e" />
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1 }}>
              No lessons yet
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0}>
            {recentLessons.map((lesson, index) => (
              <Box key={lesson.id}>
                <Box
                  component={Link}
                  href={`/teacher/lesson/${lesson.id}`}
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
                  <Stack
                    direction="row"
                    sx={{ alignItems: "center", justifyContent: "space-between" }}
                  >
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "text.primary",
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lesson.title}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {formatDate(lesson.created_at)}
                        </Typography>
                        {lesson.category && (
                          <Chip
                            label={lesson.category}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.65rem",
                              bgcolor: "primary.light",
                              color: "primary.dark",
                            }}
                          />
                        )}
                      </Stack>
                    </Box>
                    <FiChevronRight size={16} color="#9e9e9e" />
                  </Stack>
                </Box>
                {index < recentLessons.length - 1 && <Divider />}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      {recentLessons.length > 0 && (
        <CardActions sx={{ p: 1.25, pt: 0, justifyContent: "center", borderTop: "1px solid", borderColor: "divider" }}>
          <Button
            component={Link}
            href="/teacher/lessons"
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
