"use client";
import {
  createContext,
  useContext,
  useReducer,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
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
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
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

  const startRecording = useCallback(async () => {
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
        dispatch({ type: "STOP_RECORDING", blob, audioURL: url });
      };

      mediaRecorder.start();
      dispatch({ type: "START_RECORDING", startedAt: Date.now() });
    } catch (error) {
      logger.error("Error accessing microphone:", error);
      openAlertDialog(
        "Microphone Access Error",
        "Could not access your microphone. Please check your permissions and try again."
      );
    }
  }, [openAlertDialog]);

  const pauseRecording = useCallback(() => {
    mediaRecorderRef.current?.pause();
    dispatch({ type: "PAUSE_RECORDING", pausedAt: Date.now() });
  }, []);

  const resumeRecording = useCallback(() => {
    mediaRecorderRef.current?.resume();
    dispatch({ type: "RESUME_RECORDING" });
  }, []);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
  }, []);

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
          dispatch({ type: "RESET" });
          router.push("/lessons");
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
  }, [recorderState, openAlertDialog, triggerUploadAudio, triggerUpdateLesson, selectedLesson, router]);

  useEffect(() => {
    if (selectedLesson?.audio_file) {
      try {
        dispatch({
          type: "LOAD_EXISTING_AUDIO",
          audioURL: selectedLesson.audio_file,
        });
      } catch (error) {
        logger.error("Error loading audio:", error);
        dispatch({
          type: "ERROR",
          message: "Error loading existing audio recording.",
        });
      }
    }
    return () => {
      if (
        recorderState.status === "stopped" &&
        recorderState.audioURL.startsWith("blob:")
      ) {
        URL.revokeObjectURL(recorderState.audioURL);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLesson?.audio_file]);

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
