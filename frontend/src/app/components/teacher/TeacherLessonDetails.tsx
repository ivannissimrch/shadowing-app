"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson } from "../../Types";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { API_PATHS } from "../../constants/apiKeys";
import FeedBack from "./FeedBack";
import VideoScriptToggle from "../lesson/VideoScriptToggle";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

interface TeacherLessonDetailsProps {
  idInfo: { studentId: string; lessonId: string };
}

export default function TeacherLessonDetails({
  idInfo,
}: TeacherLessonDetailsProps) {
  const { data: selectedLesson } = useSWRAxios<Lesson>(
    API_PATHS.TEACHER_STUDENT_LESSON(idInfo.studentId, idInfo.lessonId)
  );
  if (!selectedLesson) return null;

  return (
    <Box>
      <VideoScriptToggle selectedLesson={selectedLesson} />
      {selectedLesson.status === "completed" && (
        <Box sx={{ mt: 3 }}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}>
              Student Recording
            </Typography>
            <AudioPlayer
              src={selectedLesson.audio_file}
              showJumpControls={false}
            />
          </Paper>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}>
              Feedback
            </Typography>
            <FeedBack idsInfo={idInfo} selectedLesson={selectedLesson} />
          </Paper>
        </Box>
      )}
    </Box>
  );
}
