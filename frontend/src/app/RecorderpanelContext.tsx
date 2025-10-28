"use client";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import { API_PATHS } from "../../src/app/constants/apiKeys";
import logger from "@/app/helpers/logger";
import {
  AudioUploadResponse,
  Lesson,
  LessonResponse,
  RecorderPanelContextType,
} from "../../src/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { useAppContext } from "@/app/AppContext";

export const RecorderPanelContext = createContext<RecorderPanelContextType>({
  recording: false,
  paused: false,
  audioURL: null,
  startRecording: () => {},
  pauseRecording: () => {},
  resumeRecording: () => {},
  stopRecording: () => {},
  handleSubmit: async () => {},
  errorMessage: "",
  setErrorMessage: () => {},
  isAudioMutating: false,
  isLessonMutating: false,
  setAudioURL: () => {},
  setRecording: () => {},
  setPaused: () => {},
});

export default function RecorderPanelContextProvider({
  children,
  selectedLesson,
}: {
  children: React.ReactNode;
  selectedLesson: Lesson | null;
}) {
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

  return (
    <RecorderPanelContext.Provider
      value={{
        recording,
        paused,
        audioURL,
        startRecording,
        pauseRecording,
        resumeRecording,
        stopRecording,
        handleSubmit,
        errorMessage,
        setErrorMessage,
        isAudioMutating,
        isLessonMutating,
        setAudioURL,
        setRecording,
        setPaused,
      }}
    >
      {children}
    </RecorderPanelContext.Provider>
  );
}

export function useRecorderPanelContext() {
  return useContext(RecorderPanelContext);
}
