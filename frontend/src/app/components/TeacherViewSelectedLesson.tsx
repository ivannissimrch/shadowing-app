"use client";
import { useFetch } from "../hooks/useFetch";
import { Lesson } from "../Types";
import styles from "./TeacherViewSelectedLesson.module.css";
import YouTubePlayer from "./YouTubePlayer";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

interface TeacherViewSelectedLessonProps {
  idInfo: { studentId: string; lessonId: string };
}

export default function TeacherViewSelectedLesson({
  idInfo,
}: TeacherViewSelectedLessonProps) {
  const { data } = useFetch(
    `/api/teacher/student/${idInfo.studentId}/lesson/${idInfo.lessonId}`
  );

  const selectedLesson = data as Lesson;

  return (
    <>
      {selectedLesson && (
        <>
          <div className={styles.grid}>
            <YouTubePlayer selectedLesson={selectedLesson} />
            <Image
              src={`/images/${selectedLesson.image}.png`}
              alt="Lesson Image"
              quality={100}
              width={625}
              height={390}
              priority
            />
          </div>
          <div className={styles.audioContainer}>
            <AudioPlayer
              src={selectedLesson.audio_file}
              showJumpControls={false}
            />
          </div>
        </>
      )}
    </>
  );
}
