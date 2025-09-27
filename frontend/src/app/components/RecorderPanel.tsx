"use client";
import styles from "./RecorderPanel.module.css";
import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAppContext } from "../AppContext";
import { Lesson } from "../Types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from "next/navigation";
import base64ToBlob from "../helpers/base64ToBlob";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "./SkeletonLoader";

interface RecorderProps {
  selectedLesson: Lesson | undefined;
}

export default function RecorderPanel({ selectedLesson }: RecorderProps) {
  const { token, openAlertDialog } = useAppContext();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null); // URL of the recorded audio
  const [blob, setBlob] = useState<Blob | null>(null);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function startRecording() {
    try {
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
    } catch (error) {
      console.error("Error accessing microphone:", error);
      //TODO use  a modal instead of alert
      openAlertDialog(
        "Microphone Access Error",
        "Could not access your microphone. Please check your permissions and try again."
      );
    }
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
  }

  function handleSubmit() {
    try {
      if (!blob) {
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;

        if (
          typeof base64Audio !== "string" ||
          selectedLesson?.id === undefined
        ) {
          setErrorMessage("Invalid audio data or lesson ID");
          return;
        }

        setIsSubmitting(true);
        const response = await fetch(
          `${API_URL}/api/lessons/${selectedLesson.id}`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              audio_file: base64Audio,
            }),
          }
        );

        setRecording(false);
        setPaused(false);
        if (!response.ok) {
          setErrorMessage("Failed to update lesson with audio file");
          setIsSubmitting(false);
          return;
        }

        openAlertDialog(
          "Submission Successful",
          "Your recording has been successfully submitted for review."
        );
        router.push("/lessons");
      };
    } catch (error) {
      console.error("Error submitting audio:", error);
      setErrorMessage("An error occurred while submitting your audio.");
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    if (selectedLesson?.audio_file) {
      try {
        const blob = base64ToBlob(selectedLesson.audio_file);
        const blobUrl = URL.createObjectURL(blob);
        setAudioURL(blobUrl);
      } catch (error) {
        console.error("Error converting base64 to blob:", error);
      }
    }

    return () => {
      if (audioURL && audioURL.startsWith("blob:")) {
        URL.revokeObjectURL(audioURL);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLesson?.audio_file]);

  if (errorMessage) {
    return (
      <div className={styles.error}>
        <p>{errorMessage}</p>
        <button
          onClick={() => setErrorMessage("")}
          className={styles.recordBtn}
        >
          Dismiss
        </button>
      </div>
    );
  }
  if (isSubmitting) {
    return <SkeletonLoader />;
  }

  if (selectedLesson?.status === "completed" && audioURL) {
    return (
      <ErrorBoundary fallback={<p>Error loading audio player</p>}>
        <div className={styles.MediaRecorder}>
          <AudioPlayer src={audioURL} showJumpControls={false} />
        </div>
      </ErrorBoundary>
    );
  } else {
    return (
      <ErrorBoundary fallback={<p>Error loading recorder panel</p>}>
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
                  <button
                    onClick={resumeRecording}
                    className={styles.recordBtn}
                  >
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
              <AudioPlayer src={audioURL} showJumpControls={false} />
              <button
                className={styles.recordBtn}
                onClick={() => {
                  setAudioURL(null);
                  setRecording(false);
                  setPaused(false);
                }}
              >
                Delete
              </button>
              <button className={styles.recordBtn} onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>
      </ErrorBoundary>
    );
  }
}
