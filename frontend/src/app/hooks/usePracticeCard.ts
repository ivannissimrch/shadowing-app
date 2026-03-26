import { useTranslations } from "next-intl";
import {
  EvaluationResult,
  PracticeCardProps,
} from "../components/ui/PracticeCard";
import { useState, useRef, useCallback } from "react";
import { useSpeakMutation } from "./useSpeakMutation";
import { useSWRMutationHook } from "./useSWRMutation";
import { API_PATHS } from "../constants/apiKeys";
import { useReactMediaRecorder } from "react-media-recorder";
import api from "../helpers/axiosFetch";
import { useRecorderPanelContext } from "../RecorderpanelContext";
import { getMediaRecorderOptions, getBlobPropertyBag, resumeAudioContextForIOS } from "../helpers/audioMimeTypes";

export default function usePracticeCard({
  text,
  wordId,
  initialEvaluation,
  onEvaluationSaved,
  audioSegment,
}: PracticeCardProps) {
  const t = useTranslations("practice");
  const tPracticeWords = useTranslations("practiceWords");
  const [speechRate, setSpeechRate] = useState(0.9);
  const [displayedEvaluation, setDisplayedEvaluation] =
    useState<EvaluationResult | null>(initialEvaluation ?? null);
  const [recordingCountdown, setRecordingCountdown] = useState<number | null>(null);

  const segmentAudioRef = useRef<HTMLAudioElement | null>(null);
  const { speak } = useSpeakMutation();
  const {
    trigger: evaluate,
    isMutating: isEvaluating,
    error: evalError,
    reset: resetEvaluation,
  } = useSWRMutationHook<
    EvaluationResult,
    { audioData: string; referenceText: string }
  >(API_PATHS.SPEECH_EVALUATE, { method: "POST" }, { throwOnError: false });

  const listenToSegment = useCallback(() => {
    if (!audioSegment) return;
    if (segmentAudioRef.current) {
      segmentAudioRef.current.pause();
      segmentAudioRef.current = null;
    }

    const audio = new Audio(audioSegment.audioUrl);
    segmentAudioRef.current = audio;
    audio.playbackRate = speechRate;

    function handleTimeUpdate() {
      if (audio.currentTime >= audioSegment!.endTime) {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = audioSegment.startTime;

      function onSeeked() {
        audio.removeEventListener("seeked", onSeeked);
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.play();
      }

      audio.addEventListener("seeked", onSeeked);
    });
  }, [audioSegment, speechRate]);

  async function handleRecordingStop(_blobUrl: string, blob: Blob) {
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    let result;
    try {
      result = await evaluate({
        audioData: base64,
        referenceText: text,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      throw err;
    }

    if (result) {
      setDisplayedEvaluation(result);
      if (wordId) {
        try {
          await api.post(API_PATHS.PRACTICE_WORD_RESULTS(wordId), {
            accuracyScore: result.accuracyScore,
            fluencyScore: result.fluencyScore,
            completenessScore: result.completenessScore,
            pronunciationScore: result.pronunciationScore,
            words: result.words,
          });
          onEvaluationSaved?.();
        } catch {}
      }
    }
  }

  const error = evalError ? t("evaluationFailed") : null;

  const { recorderState, setIsPracticeRecording } = useRecorderPanelContext();
  const isLessonRecording =
    recorderState.status === "recording" || recorderState.status === "paused";

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: handleRecordingStop,
      blobPropertyBag: getBlobPropertyBag(),
      mediaRecorderOptions: getMediaRecorderOptions(),
    });

  async function handleSpeak() {
    if (status === "recording") {
      stopRecording();
      setIsPracticeRecording(false);
      setRecordingCountdown(null);
    } else {
      // iOS Safari fix: Resume audio context on user gesture
      try {
        await resumeAudioContextForIOS();
      } catch (error) {
        console.warn("Could not resume audio context:", error);
      }

      resetEvaluation();
      setDisplayedEvaluation(null);
      setIsPracticeRecording(true);

      // Start recording immediately but show countdown for when to speak
      startRecording();

      // Start countdown to tell user when to speak
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
    }
  }

  function updateSpeechRate(value: number) {
    setSpeechRate(value);
  }

  return {
    tPracticeWords,
    status,
    error,
    mediaBlobUrl,
    isEvaluating,
    displayedEvaluation,
    handleSpeak,
    updateSpeechRate,
    t,
    speechRate,
    speak,
    listenToSegment: audioSegment ? listenToSegment : undefined,
    isLessonRecording,
    recordingCountdown,
  };
}
