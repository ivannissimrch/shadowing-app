"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { Lesson, Student } from "../../Types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { API_PATHS } from "../../constants/apiKeys";
import FeedBack from "./FeedBack";
import VideoScriptToggle from "../lesson/VideoScriptToggle";
import Breadcrumbs from "../ui/Breadcrumbs";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import { mutate } from "swr";
import { FiCheckCircle, FiClock } from "react-icons/fi";

interface TeacherLessonDetailsProps {
  idInfo: { studentId: string; lessonId: string };
}

export default function TeacherLessonDetails({
  idInfo,
}: TeacherLessonDetailsProps) {
  const t = useTranslations("teacher");
  const tNav = useTranslations("navigation");
  const tLesson = useTranslations("lesson");
  const [isMarking, setIsMarking] = useState(false);

  const { data: student } = useSWRAxios<Student>(
    API_PATHS.TEACHER_STUDENT(idInfo.studentId)
  );

  const { data: selectedLesson } = useSWRAxios<Lesson>(
    API_PATHS.TEACHER_STUDENT_LESSON(idInfo.studentId, idInfo.lessonId)
  );

  const { trigger: markComplete } = useSWRMutationHook(
    API_PATHS.TEACHER_STUDENT_LESSON_COMPLETE(idInfo.studentId, idInfo.lessonId),
    { method: "PATCH" }
  );

  if (!selectedLesson) return null;

  const hasSubmission = selectedLesson.status === "submitted" || selectedLesson.status === "completed";
  const isCompleted = selectedLesson.status === "completed";
  const isPendingReview = selectedLesson.status === "submitted";

  async function handleMarkComplete() {
    setIsMarking(true);
    try {
      await markComplete({});
      mutate(API_PATHS.TEACHER_STUDENT_LESSON(idInfo.studentId, idInfo.lessonId));
      mutate(API_PATHS.TEACHER_STUDENT_LESSONS(idInfo.studentId));
      mutate(API_PATHS.DASHBOARD_STATS);
    } finally {
      setIsMarking(false);
    }
  }

  // Only the audio player goes below the video (compact, like student's RecorderPanel)
  const belowVideoContent = hasSubmission ? (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}>
        {t("studentRecording")}
      </Typography>
      <AudioPlayer
        src={selectedLesson.audio_file}
        showJumpControls={false}
      />
    </Paper>
  ) : (
    <Paper sx={{ p: 2, borderRadius: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <FiClock size={48} color="#9e9e9e" />
        <Typography variant="h6" sx={{ mt: 2, color: "text.secondary" }}>
          {t("noSubmissionYet")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t("waitingForStudent")}
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Breadcrumbs
        items={[
          { label: tNav("students"), href: "/teacher/students" },
          { label: student?.username || "...", href: `/teacher/student/${idInfo.studentId}` },
          { label: selectedLesson.title },
        ]}
      />

      <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {selectedLesson.title}
        </Typography>
        {isCompleted && (
          <Chip
            icon={<FiCheckCircle size={14} />}
            label={tLesson("completed")}
            color="success"
            size="small"
          />
        )}
        {isPendingReview && (
          <Chip
            icon={<FiClock size={14} />}
            label={t("pendingReview")}
            color="warning"
            size="small"
          />
        )}
      </Box>

      <VideoScriptToggle
        selectedLesson={selectedLesson}
        belowVideo={belowVideoContent}
        hideFeedback
      />

      {/* Feedback, mark complete, etc. go BELOW the two-column grid */}
      {hasSubmission && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {/* Feedback Section */}
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}>
              {t("feedback")}
            </Typography>
            <FeedBack idsInfo={idInfo} selectedLesson={selectedLesson} />
          </Paper>

          {/* Mark as Completed */}
          {isPendingReview && (
            <Paper sx={{ p: 2, borderRadius: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {t("readyToComplete")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {t("markCompleteDescription")}
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleMarkComplete}
                  disabled={isMarking}
                  startIcon={isMarking ? <CircularProgress size={16} color="inherit" /> : <FiCheckCircle size={16} />}
                  sx={{ textTransform: "none", minWidth: 160 }}
                >
                  {isMarking ? t("marking") : t("markAsCompleted")}
                </Button>
              </Box>
            </Paper>
          )}

          {/* Completed Message */}
          {isCompleted && (
            <Paper sx={{ p: 2, borderRadius: 2, bgcolor: "success.light", boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <FiCheckCircle size={24} color="#2e7d32" />
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "success.dark" }}>
                    {t("lessonCompleted")}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "success.dark" }}>
                    {t("lessonCompletedDescription")}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
}
