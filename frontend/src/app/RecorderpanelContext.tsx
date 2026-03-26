"use client";
import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
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
import { useSnackbar } from "@/app/SnackbarContext";
import { recorderReducer } from "./helpers/recorderReducer";
import { getMediaRecorderOptions, getBlobPropertyBag, resumeAudioContextForIOS, createAudioBlobUrl } from "./helpers/audioMimeTypes";

export const RecorderPanelContext = createContext<RecorderPanelContextType>({
  recorderState: { status: "idle" },
  dispatch: () => {},
  startRecording: () => {},
  pauseRecording: () => {},
  resumeRecording: () => {},
  stopRecording: () => {},
  handleSubmit: async () => {},
  handleDeleteSubmission: async () => {},
  isAudioMutating: false,
  isLessonMutating: false,
  isDeleting: false,
  isPracticeRecording: false,
  setIsPracticeRecording: () => {},
  recordingCountdown: null,
});

interface RecorderPanelContextProviderProps {
  children: React.ReactNode;
  selectedLesson: Lesson | null;
}

export default function RecorderPanelContextProvider({
  children,
  selectedLesson,
}: RecorderPanelContextProviderProps) {
  const t = useTranslations("media");
  const { openAlertDialog } = useAlertContext();
  const { showSnackbar } = useSnackbar();
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
  const { trigger: triggerDeleteSubmission, isMutating: isDeleting } =
    useSWRMutationHook<LessonResponse, undefined>(
      selectedLesson?.id ? API_PATHS.DELETE_SUBMISSION(selectedLesson.id) : null,
      { method: "DELETE" }
    );
  const [recorderState, dispatch] = useReducer(recorderReducer, {
    status: "idle",
  });
  const [isPracticeRecording, setIsPracticeRecording] = useState(false);
  const [recordingCountdown, setRecordingCountdown] = useState<number | null>(null);

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
    blobPropertyBag: getBlobPropertyBag(),
    mediaRecorderOptions: getMediaRecorderOptions(),
    onStop: (blobUrl, blob) => {
      // Create iPhone-compatible blob URL with proper MIME type
      const compatibleBlobUrl = blob ? createAudioBlobUrl(blob) : blobUrl;
      dispatch({ type: "STOP_RECORDING", blob, audioURL: compatibleBlobUrl });
    },
  });

  const startRecording = useCallback(async () => {
    if (error) {
      logger.error("Error accessing microphone:", error);
      openAlertDialog(t("microphoneError"), t("microphoneErrorMessage"));
      return;
    }

    // iOS Safari fix: Resume audio context on user gesture
    try {
      await resumeAudioContextForIOS();
    } catch (error) {
      console.warn("Could not resume audio context:", error);
    }

    // Start recording immediately but show countdown for when to speak
    startMediaRecording();
    dispatch({ type: "START_RECORDING", startedAt: Date.now() });

    // Start countdown to tell user when to speak (Safari/iPhone needs time)
    setRecordingCountdown(1);
    const countdownTimer = setInterval(() => {
      setRecordingCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownTimer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, [startMediaRecording, error, openAlertDialog, t]);

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
    setRecordingCountdown(null);
  }, [stopMediaRecording]);

  const handleSubmit = useCallback(async () => {
    try {
      if (recorderState.status !== "stopped") {
        dispatch({ type: "ERROR", message: t("noAudioRecorded") });
        showSnackbar(t("noAudioRecorded"), "error");
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
          dispatch({ type: "ERROR", message: t("invalidAudioData") });
          showSnackbar(t("invalidAudioData"), "error");
          return;
        }

        try {
          const uploadResponse = await triggerUploadAudio({
            audioData: base64Audio,
            lessonId: selectedLesson.id,
          });

          if (!uploadResponse) {
            dispatch({ type: "ERROR", message: t("failedToUploadAudio") });
            showSnackbar(t("failedToUploadAudio"), "error");
            return;
          }

          const response = await triggerUpdateLesson({
            audio_file: uploadResponse.audioUrl,
          });

          if (!response) {
            dispatch({ type: "ERROR", message: t("failedToSaveRecording") });
            showSnackbar(t("failedToSaveRecording"), "error");
            return;
          }

          dispatch({ type: "UPLOAD_SUCCESS" });
          showSnackbar(t("submissionSuccessful"), "success");
          await mutate(API_PATHS.LESSON(selectedLesson.id));
          clearBlobUrl();
          dispatch({ type: "RESET" });
          router.push("/student/lessons");
        } catch (error) {
          logger.error("Error submitting audio:", error);
          dispatch({ type: "ERROR", message: t("failedToSubmitRecording") });
          showSnackbar(t("failedToSubmitRecording"), "error");
        }
      };
    } catch (error) {
      logger.error("Error processing audio:", error);
      dispatch({
        type: "ERROR",
        message: t("audioProcessingError"),
      });
      showSnackbar(t("audioProcessingError"), "error");
    }
  }, [
    recorderState,
    showSnackbar,
    triggerUploadAudio,
    triggerUpdateLesson,
    selectedLesson,
    router,
    clearBlobUrl,
    t,
  ]);

  const handleDeleteSubmission = useCallback(async () => {
    try {
      const response = await triggerDeleteSubmission(undefined);
      if (!response) {
        showSnackbar(t("failedToDeleteSubmission"), "error");
        return;
      }
      showSnackbar(t("submissionDeleted"), "success");
      if (selectedLesson?.id) {
        await mutate(API_PATHS.LESSON(selectedLesson.id));
      }
    } catch (error) {
      logger.error("Error deleting submission:", error);
      showSnackbar(t("failedToDeleteSubmission"), "error");
    }
  }, [triggerDeleteSubmission, showSnackbar, selectedLesson, t]);

  const value = useMemo(
    () => ({
      recorderState,
      dispatch,
      startRecording,
      pauseRecording,
      resumeRecording,
      stopRecording,
      handleSubmit,
      handleDeleteSubmission,
      isAudioMutating,
      isLessonMutating,
      isDeleting,
      isPracticeRecording,
      setIsPracticeRecording,
      recordingCountdown,
    }),
    [
      recorderState,
      startRecording,
      pauseRecording,
      resumeRecording,
      stopRecording,
      handleSubmit,
      handleDeleteSubmission,
      isAudioMutating,
      isLessonMutating,
      isDeleting,
      isPracticeRecording,
      recordingCountdown,
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
