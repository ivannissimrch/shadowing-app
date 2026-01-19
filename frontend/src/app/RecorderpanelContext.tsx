"use client";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";
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
import { useAlertContext } from "@/app/AlertContext";
import { recorderReducer } from "./helpers/recorderReducer";

export const RecorderPanelContext = createContext<RecorderPanelContextType>({
  recorderState: { status: "idle" },
  dispatch: () => {},
  startRecording: () => {},
  pauseRecording: () => {},
  resumeRecording: () => {},
  stopRecording: () => {},
  handleSubmit: async () => {},
  isAudioMutating: false,
  isLessonMutating: false,
});

interface RecorderPanelContextProviderProps {
  children: React.ReactNode;
  selectedLesson: Lesson | null;
}

export default function RecorderPanelContextProvider({
  children,
  selectedLesson,
}: RecorderPanelContextProviderProps) {
  const { openAlertDialog } = useAlertContext();
  const router = useRouter();
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
  const [recorderState, dispatch] = useReducer(recorderReducer, {
    status: "idle",
  });

  // react-media-recorder hook handles all the browser MediaRecorder complexity
  const {
    startRecording: startMediaRecording,
    stopRecording: stopMediaRecording,
    pauseRecording: pauseMediaRecording,
    resumeRecording: resumeMediaRecording,
    clearBlobUrl,
    error,
  } = useReactMediaRecorder({
    audio: true,
    onStop: (blobUrl, blob) => {
      dispatch({ type: "STOP_RECORDING", blob, audioURL: blobUrl });
    },
  });

  const startRecording = useCallback(() => {
    if (error) {
      logger.error("Error accessing microphone:", error);
      openAlertDialog(
        "Microphone Access Error",
        "Could not access your microphone. Please check your permissions and try again."
      );
      return;
    }
    startMediaRecording();
    dispatch({ type: "START_RECORDING", startedAt: Date.now() });
  }, [startMediaRecording, error, openAlertDialog]);

  const pauseRecording = useCallback(() => {
    pauseMediaRecording();
    dispatch({ type: "PAUSE_RECORDING", pausedAt: Date.now() });
  }, [pauseMediaRecording]);

  const resumeRecording = useCallback(() => {
    resumeMediaRecording();
    dispatch({ type: "RESUME_RECORDING" });
  }, [resumeMediaRecording]);

  const stopRecording = useCallback(() => {
    stopMediaRecording();
  }, [stopMediaRecording]);

  const handleSubmit = useCallback(async () => {
    try {
      if (recorderState.status !== "stopped") {
        dispatch({ type: "ERROR", message: "No audio recorded." });
        openAlertDialog("Error", "No audio recorded.");
        return;
      }
      const audioBlob = recorderState.blob;
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = reader.result;

        if (
          typeof base64Audio !== "string" ||
          selectedLesson?.id === undefined
        ) {
          dispatch({ type: "ERROR", message: "Invalid audio data." });
          openAlertDialog("Error", "Invalid audio data.");
          return;
        }

        try {
          // First, upload audio to Azure
          const uploadResponse = await triggerUploadAudio({
            audioData: base64Audio,
            lessonId: selectedLesson.id,
          });

          if (!uploadResponse) {
            dispatch({ type: "ERROR", message: "Error uploading audio" });
            openAlertDialog(
              "Error",
              "Failed to upload audio. Please try again."
            );
            return;
          }

          const response = await triggerUpdateLesson({
            audio_file: uploadResponse.audioUrl,
          });

          if (!response) {
            dispatch({ type: "ERROR", message: "Error saving audio URL" });
            openAlertDialog(
              "Error",
              "Failed to save recording. Please try again."
            );
            return;
          }

          dispatch({ type: "UPLOAD_SUCCESS" });
          openAlertDialog(
            "Submission Successful",
            "Your recording has been successfully submitted for review."
          );
          await mutate(API_PATHS.LESSON(selectedLesson.id));
          clearBlobUrl();
          dispatch({ type: "RESET" });
          router.push("/student/lessons");
        } catch (error) {
          logger.error("Error submitting audio:", error);
          dispatch({ type: "ERROR", message: "Error submitting audio." });
          openAlertDialog(
            "Error",
            "Failed to submit recording. Please try again."
          );
        }
      };
    } catch (error) {
      logger.error("Error processing audio:", error);
      dispatch({
        type: "ERROR",
        message: "An error occurred while processing your audio.",
      });
      openAlertDialog(
        "Error",
        "An error occurred while processing your audio."
      );
    }
  }, [
    recorderState,
    openAlertDialog,
    triggerUploadAudio,
    triggerUpdateLesson,
    selectedLesson,
    router,
    clearBlobUrl,
  ]);

  const value = useMemo(
    () => ({
      recorderState,
      dispatch,
      startRecording,
      pauseRecording,
      resumeRecording,
      stopRecording,
      handleSubmit,
      isAudioMutating,
      isLessonMutating,
    }),
    [
      recorderState,
      startRecording,
      pauseRecording,
      resumeRecording,
      stopRecording,
      handleSubmit,
      isAudioMutating,
      isLessonMutating,
    ]
  );

  return (
    <RecorderPanelContext.Provider value={value}>
      {children}
    </RecorderPanelContext.Provider>
  );
}

export function useRecorderPanelContext() {
  return useContext(RecorderPanelContext);
}
