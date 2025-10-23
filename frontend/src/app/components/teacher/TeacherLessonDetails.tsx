"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Lesson } from "../../Types";
import styles from "./TeacherLessonDetails.module.css";
import YouTubePlayer from "../media/YouTubePlayer";
import Image from "next/image";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { API_PATHS } from "../../constants/apiKeys";
import FeedBack from "./FeedBack";

interface TeacherLessonDetailsProps {
  idInfo: { studentId: string; lessonId: string };
}

export default function TeacherLessonDetails({
  idInfo,
}: TeacherLessonDetailsProps) {
  const { data } = useSWRAxios<Lesson>(
    API_PATHS.TEACHER_STUDENT_LESSON(idInfo.studentId, idInfo.lessonId)
  );

  const selectedLesson = data as Lesson;

  return (
    <>
      {selectedLesson && (
        <section className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.videoWrapper}>
              <YouTubePlayer selectedLesson={selectedLesson} />
            </div>
            <Image
              src={selectedLesson.image}
              alt="Lesson Image"
              quality={100}
              width={625}
              height={390}
              priority
            />
          </div>
          {selectedLesson.status === "completed" && (
            <>
              <div className={styles.audioContainer}>
                <AudioPlayer
                  src={selectedLesson.audio_file}
                  showJumpControls={false}
                />
              </div>

              <FeedBack idsInfo={idInfo} selectedLesson={selectedLesson} />
            </>
          )}
        </section>
      )}
    </>
  );
}
