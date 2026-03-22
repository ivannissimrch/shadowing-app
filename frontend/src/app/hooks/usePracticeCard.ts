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
import api from "../helpers/axiosFetch";

function useAudioRecorder(onStop: (blobUrl: string, blob: Blob) => void) {
  const [status, setStatus] = useState<"idle" | "recording">("idle");
  const [mediaBlobUrl, setMediaBlobUrl] = useState<string | undefined>();
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const onStopRef = useRef(onStop);
  onStopRef.current = onStop;

  const startRecording = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const preferredTypes = [
      "audio/mp4;codecs=mp4a.40.2",
      "audio/mp4",
      "audio/webm;codecs=opus",
      "audio/webm",
    ];
    const mimeType = preferredTypes.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";

    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    } catch {
      recorder = new MediaRecorder(stream);
    }

    recorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || mimeType || "audio/mp4",
      });
      const url = URL.createObjectURL(blob);
      setMediaBlobUrl(url);
      setStatus("idle");
      onStopRef.current(url, blob);
    };

    recorder.start(250);
    setStatus("recording");
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  }, []);

  return { status, startRecording, stopRecording, mediaBlobUrl };
}

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

  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useAudioRecorder(handleRecordingStop);

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
    listenToSegment: audioSegment ? listenToSegment : undefined,
  };
}
