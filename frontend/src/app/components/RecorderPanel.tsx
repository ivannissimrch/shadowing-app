"use client";
import styles from "./RecorderPanel.module.css";
import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAppContext } from "../AppContext";
import { Lesson } from "../Types";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "./SkeletonLoader";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from "next/navigation";
import base64ToBlob from "../helpers/base64ToBlob";

interface RecorderProps {
  selectedLesson: Lesson | undefined;
  updateSelectedLesson?: (updatedLesson: Lesson) => void;
}

export default function RecorderPanel({
  selectedLesson,
  updateSelectedLesson,
}: RecorderProps) {
  const { token, openAlertDialog } = useAppContext();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

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
        const blob = new Blob(audioChunks.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setBlob(blob);
      };

      mediaRecorder.start();
      setRecording(true);
      setPaused(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
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
    setRecording(false);
    setPaused(false);
  }

  async function handleSubmit() {
    if (!blob || !selectedLesson?.id || !token) return;

    setIsSubmitting(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;

        if (
          typeof base64Audio !== "string" ||
          selectedLesson?.id === undefined
        ) {
          console.error("Invalid audio data or lesson ID");
          return;
        }

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
          console.error("Failed to update lesson with audio file");
          setErrorMessage("There was an error submitting your audio. Please try again.");
          return;
        }

        openAlertDialog("Success", "Audio submitted successfully!");
        if (updateSelectedLesson) {
          updateSelectedLesson({
            ...selectedLesson,
            audio_file: base64Audio,
            status: "completed",
          });
        }
        router.push("/lessons");
      };
    } catch (error) {
      console.error("Error submitting audio:", error);
      setErrorMessage("Error submitting audio. Please try again.");
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
        console.error("Error parsing audio data:", error);
        openAlertDialog(
          "Error parsing audio data:",
          "Error parsing audio data"
        );
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
          Try Again
        </button>
      </div>
    );
  }

  if (isSubmitting) {
    return <SkeletonLoader />;
  }

  // If lesson is completed and has audio, just show the player
  if (selectedLesson?.status === "completed" && audioURL) {
    return (
      <ErrorBoundary fallback={<p>Error loading recorder panel</p>}>
        <div className={styles.MediaRecorder}>
          <AudioPlayer src={audioURL} showJumpControls={false} />
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary fallback={<p>Error loading recorder panel</p>}>
      <div className={styles.panel}>
        {!audioURL && (
          <>
            <div className={styles.mic}>
              <span className={styles.icon}>🎙️</span>
              {!recording ? <p>Ready to record</p> : <p>Recording...</p>}
              {!recording && (
                <button className={styles.recordBtn} onClick={startRecording}>
                  Start Recording
                </button>
              )}
              {recording && !paused && (
                <button className={styles.recordBtn} onClick={stopRecording}>
                  Stop Recording
                </button>
              )}
            </div>
          </>
        )}
        {audioURL && (
          <div className={styles.MediaRecorder}>
            <AudioPlayer src={audioURL} showJumpControls={false} />
            {selectedLesson?.status !== "completed" && (
              <>
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
              </>
            )}
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}