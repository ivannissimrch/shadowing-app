"use client";
import { useRouter } from "next/navigation";
import styles from "./RecorderPanel.module.css";
import { useState, useRef } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAppContext } from "../AppContext";
import { Lesson } from "../Types";

interface RecorderProps {
  currentUser:
    | {
        name: string;
        email: string;
        lessons: Lesson[];
      }
    | undefined;
  selectedLesson: Lesson | undefined;
}

export default function RecorderPanel({
  currentUser,
  selectedLesson,
}: RecorderProps) {
  const { addAudioToLesson, openSnackBar } = useAppContext();
  const router = useRouter();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(audioChunks.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      setBlob(blob);
    };

    mediaRecorder.start();
    setRecording(true);
    setPaused(false);
  }

  function pauseRecording() {
    mediaRecorderRef.current?.pause();
    setPaused(true);
  }

  function resumeRecording() {
    mediaRecorderRef.current?.resume();
    setPaused(false);
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    setRecording(false);
    setPaused(false);
  }

  function handleSubmit() {
    if (!blob) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64Audio = reader.result;
      if (
        typeof base64Audio !== "string" ||
        selectedLesson?.lessonId === undefined
      ) {
        console.error("Invalid audio data or lesson ID");
        return;
      }

      addAudioToLesson(selectedLesson.lessonId, base64Audio);
      router.push(`/${currentUser?.name}`);
      openSnackBar();
    };
  }

  return (
    <div className={styles.panel}>
      {!audioURL && (
        <>
          {" "}
          <div className={styles.mic}>
            <span className={styles.icon}>🎙️</span>
            {!recording ? <p>Ready to record</p> : <p>Recording...</p>}
            {!recording && (
              <button onClick={startRecording} className={styles.recordBtn}>
                Start Recording
              </button>
            )}
            {recording && !paused && (
              <button className={styles.recordBtn} onClick={pauseRecording}>
                Pause
              </button>
            )}
            {recording && paused && (
              <button onClick={resumeRecording} className={styles.recordBtn}>
                Resume
              </button>
            )}
            {recording && (
              <button onClick={stopRecording} className={styles.recordBtn}>
                Stop
              </button>
            )}
          </div>
        </>
      )}
      {audioURL && (
        <div className={styles.MediaRecorder}>
          <AudioPlayer autoPlay src={audioURL} showJumpControls={false} />
          <button
            className={styles.recordBtn}
            onClick={() => setAudioURL(null)}
          >
            Delete
          </button>
          <button className={styles.recordBtn} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
