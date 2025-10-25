"use client";
import styles from "./RecorderPanel.module.css";
import { useState, useRef, useEffect } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useAppContext } from "../../AppContext";
import { Lesson } from "../../Types";
import { useRouter } from "next/navigation";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "../ui/SkeletonLoader";
import { mutate } from "swr";
import { API_PATHS } from "../../constants/apiKeys";
import logger from "@/app/helpers/logger";
import { AudioUploadResponse, LessonResponse } from "../../Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { FaMicrophone } from "react-icons/fa";

interface RecorderProps {
  selectedLesson: Lesson | undefined;
}

export default function RecorderPanel({ selectedLesson }: RecorderProps) {
  const { openAlertDialog } = useAppContext();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null); // URL of the recorded audio
  const [blob, setBlob] = useState<Blob | null>(null);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState("");
  const { trigger: triggerUploadAudio, isMutating: isAudioMutating } =
    useSWRMutationHook<
      AudioUploadResponse,
      { audioData: string; lessonId: string }
    >(API_PATHS.UPLOAD_AUDIO, { method: "POST" });

  const { trigger: triggerUpdateLesson, isMutating: isLessonMutating } =
    useSWRMutationHook<LessonResponse, { audio_file: string | null }>(
      selectedLesson?.id ? API_PATHS.LESSON(selectedLesson.id) : null,
      { method: "PATCH" }
    );

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
      logger.error("Error accessing microphone:", error);
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

  async function handleSubmit() {
    try {
      if (!blob) {
        setErrorMessage(
          "Error: No audio recorded. Please record audio before submitting."
        );
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
          setErrorMessage("Invalid audio data");
          return;
        }
        setErrorMessage("");
        try {
          // First, upload audio to Azure
          const uploadResponse = await triggerUploadAudio({
            audioData: base64Audio,
            lessonId: selectedLesson.id,
          });
          console.log("Upload Response:", uploadResponse);

          if (!uploadResponse) {
            setErrorMessage("Error uploading audio");
            return;
          }

          // Then save the Azure URL to database
          const response = await triggerUpdateLesson({
            audio_file: uploadResponse.audioUrl,
          });

          setRecording(false);
          setPaused(false);
          if (response) {
            openAlertDialog(
              "Submission Successful",
              "Your recording has been successfully submitted for review."
            );
          }
          await mutate(API_PATHS.LESSON(selectedLesson.id));
          router.push("/lessons");
        } catch (error) {
          logger.error("Error submitting audio:", error);
          setErrorMessage("An error occurred while submitting your audio.");
        } finally {
          setBlob(null);
          setAudioURL(null);
          setRecording(false);
        }
      };
    } catch (error) {
      logger.error("Error submitting audio:", error);
      setErrorMessage("An error occurred while submitting your audio.");
    }
  }

  useEffect(() => {
    if (selectedLesson?.audio_file) {
      try {
        // It's an Azure URL - use directly
        setAudioURL(selectedLesson.audio_file);
      } catch (error) {
        logger.error("Error parsing audio data:", error);
        setErrorMessage("Error loading existing audio recording.");
      }
    }

    return () => {
      if (audioURL && audioURL.startsWith("blob:")) {
        URL.revokeObjectURL(audioURL);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLesson?.audio_file]);

  const isSubmitting = isAudioMutating || isLessonMutating;

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

  return (
    <ErrorBoundary fallback={<p>Error loading recorder panel</p>}>
      <div className={styles.panel}>
        {!audioURL && (
          <>
            {" "}
            <div className={styles.mic}>
              <div className={styles.icon}>
                <FaMicrophone />
              </div>
              {!recording ? <p>Tap to record</p> : <p>Recording...</p>}
              <div>
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
        {selectedLesson?.feedback ? (
          <p className={styles.feedback}>{selectedLesson?.feedback}</p>
        ) : null}
      </div>
    </ErrorBoundary>
  );
}
