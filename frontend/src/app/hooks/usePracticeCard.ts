import { useTranslations } from "next-intl";
import {
  CoachResponse,
  EvaluationResult,
  PracticeCardProps,
} from "../components/ui/PracticeCard";
import { useState, useRef, useCallback } from "react";
import { useSpeakMutation } from "./useSpeakMutation";
import { useSWRMutationHook } from "./useSWRMutation";
import { API_PATHS } from "../constants/apiKeys";
import { useReactMediaRecorder } from "react-media-recorder";
import api from "../helpers/axiosFetch";

export default function usePracticeCard({
  text,
  nativeLanguage,
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

  // Ref for audio segment playback (real teacher audio)
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

  const {
    trigger: getCoachHelp,
    isMutating: isLoadingCoach,
    data: coachData,
    reset: resetCoach,
  } = useSWRMutationHook<
    CoachResponse,
    {
      referenceText: string;
      evaluation: EvaluationResult;
      nativeLanguage?: string;
    }
  >(API_PATHS.SPEECH_COACH, { method: "POST" }, { throwOnError: false });

  // Play real audio segment from lesson video
  const listenToSegment = useCallback(() => {
    if (!audioSegment) return;

    // Stop any currently playing segment
    if (segmentAudioRef.current) {
      segmentAudioRef.current.pause();
      segmentAudioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
    }

    const audio = new Audio(audioSegment.audioUrl);
    segmentAudioRef.current = audio;
    audio.playbackRate = speechRate;
    audio.currentTime = audioSegment.startTime;

    function handleTimeUpdate() {
      if (audio.currentTime >= audioSegment!.endTime) {
        audio.pause();
        audio.removeEventListener("timeupdate", handleTimeUpdate);
      }
    }

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.play();
  }, [audioSegment, speechRate]);

  async function handleRecordingStop(_blobUrl: string, blob: Blob) {
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    const result = await evaluate({
      audioData: base64,
      referenceText: text,
    });

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
        } catch {
          // Save failure is non-blocking — the user still sees the evaluation
        }
      }
    }
  }

  const error = evalError ? t("evaluationFailed") : null;

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({
      audio: true,
      onStop: handleRecordingStop,
    });

  function handleSpeak() {
    if (status === "recording") {
      stopRecording();
    } else {
      resetEvaluation();
      resetCoach();
      setDisplayedEvaluation(null);
      startRecording();
    }
  }

  function handleGetHelp() {
    if (displayedEvaluation) {
      getCoachHelp({
        referenceText: text,
        evaluation: displayedEvaluation,
        nativeLanguage: nativeLanguage || undefined,
      });
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
    isLoadingCoach,
    displayedEvaluation,
    handleGetHelp,
    handleSpeak,
    updateSpeechRate,
    coachData,
    t,
    speechRate,
    speak,
    // Only return listenToSegment if we have a real audio segment
    listenToSegment: audioSegment ? listenToSegment : undefined,
  };
}
