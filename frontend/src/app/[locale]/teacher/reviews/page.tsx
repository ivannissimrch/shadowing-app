"use client";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useSWRAxios } from "../../../hooks/useSWRAxios";
import { API_PATHS } from "../../../constants/apiKeys";
import MainCard from "../../../components/ui/MainCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import { FiClock, FiBook, FiChevronRight } from "react-icons/fi";

interface PendingReview {
  assignment_id: string;
  student_id: string;
  lesson_id: string;
  audio_file: string;
  submitted_at: string;
  student_name: string;
  student_email: string | null;
  lesson_title: string;
  lesson_category: string | null;
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ReviewsPage() {
  const tTeacher = useTranslations("teacher");

  const { data: reviews, isLoading } = useSWRAxios<PendingReview[]>(
    API_PATHS.PENDING_REVIEWS
  );

  return (
    <Box>
      {/* Page Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {tTeacher("pendingReview")}
      </Typography>

      <MainCard>
        {isLoading ? (
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Box key={i}>
                <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="40%" height={24} />
                    <Skeleton variant="text" width="60%" height={20} />
                  </Box>
                  <Skeleton variant="rectangular" width={100} height={36} sx={{ borderRadius: 1 }} />
                </Stack>
                {i < 3 && <Divider sx={{ my: 2 }} />}
              </Box>
            ))}
          </Stack>
        ) : reviews && reviews.length > 0 ? (
          <Stack spacing={0}>
            {reviews.map((review, index) => (
              <Box key={review.assignment_id}>
                <Box
                  sx={{
                    py: 2,
                    "&:hover": {
                      bgcolor: "action.hover",
                      mx: -2.5,
                      px: 2.5,
                    },
                  }}
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    sx={{ alignItems: { xs: "flex-start", sm: "center" } }}
                  >
                    {/* Student Avatar */}
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: "warning.light",
                        color: "warning.dark",
                        fontWeight: 600,
                      }}
                    >
                      {getInitials(review.student_name)}
                    </Avatar>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {review.student_name}
                        </Typography>
                        <Chip
                          icon={<FiClock size={12} />}
                          label={formatTimeAgo(review.submitted_at)}
                          size="small"
                          sx={{ height: 22, fontSize: "0.7rem" }}
                        />
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ alignItems: "center", mt: 0.5 }}>
                        <FiBook size={14} color="#666" />
                        <Typography
                          variant="body2"
                          sx={{
                            color: "text.secondary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {review.lesson_title}
                        </Typography>
                        {review.lesson_category && (
                          <Chip
                            label={review.lesson_category}
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: "0.65rem",
                              bgcolor: "secondary.light",
                              color: "secondary.dark",
                            }}
                          />
                        )}
                      </Stack>
                    </Box>

                    {/* Action Button */}
                    <Button
                      component={Link}
                      href={`/teacher/student/${review.student_id}/lesson/${review.lesson_id}`}
                      variant="contained"
                      color="warning"
                      size="small"
                      endIcon={<FiChevronRight size={14} />}
                      sx={{ textTransform: "none", minWidth: 100 }}
                    >
                      {tTeacher("review")}
                    </Button>
                  </Stack>
                </Box>
                {index < reviews.length - 1 && <Divider />}
              </Box>
            ))}
          </Stack>
        ) : (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <FiClock size={48} color="#4caf50" />
            <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
              {tTeacher("noReviewsPending")}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {tTeacher("allCaughtUp")}
            </Typography>
          </Box>
        )}
      </MainCard>
    </Box>
  );
}
