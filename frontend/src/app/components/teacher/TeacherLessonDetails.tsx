"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson } from "../../Types";
import styles from "./TeacherLessonDetails.module.css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { API_PATHS } from "../../constants/apiKeys";
import FeedBack from "./FeedBack";
import VideoScriptToggle from "../lesson/VideoScriptToggle";

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
    <>
      <VideoScriptToggle selectedLesson={selectedLesson} />
      {selectedLesson.status === "completed" && (
        <>
          <section className={styles.audioContainer}>
            <AudioPlayer
              src={selectedLesson.audio_file}
              showJumpControls={false}
            />
          </section>
          <FeedBack idsInfo={idInfo} selectedLesson={selectedLesson} />
        </>
      )}
    </>
  );
}
