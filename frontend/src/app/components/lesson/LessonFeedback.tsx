"use client";
import { Box, Paper, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import FeedbackReplyThread from "../feedback/FeedbackReplyThread";
import { useTranslations } from "next-intl";
import useCurrentUserId from "@/app/hooks/useCurrentUserId";
import { API_PATHS } from "@/app/constants/apiKeys";
import { Lesson } from "@/app/Types";
import { SANITIZE_CONFIG } from "@/app/constants/sanitizeConfig";

export default function LessonFeedback({
  selectedLesson,
}: {
  selectedLesson: Lesson;
}) {
  const tTeacher = useTranslations("teacher");
  const currentUserId = useCurrentUserId();
  return (
    <Paper sx={{ mt: 2, p: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}
      >
        {tTeacher("feedback")}
      </Typography>
      <Box
        sx={{
          "& p": { mb: 0.5, mt: 0 },
          "& p:last-child": { mb: 0 },
          "& ul, & ol": { pl: 3 },
          "& strong, & b": { fontWeight: 600 },
          "& s": { textDecoration: "line-through" },
          "& mark": { borderRadius: "2px", padding: "0 2px" },
        }}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            selectedLesson.feedback ?? "",
            SANITIZE_CONFIG
          ),
        }}
      />

      <FeedbackReplyThread
        repliesEndpoint={API_PATHS.STUDENT_FEEDBACK_REPLIES(selectedLesson.id)}
        currentUserId={currentUserId}
      />
    </Paper>
  );
}
