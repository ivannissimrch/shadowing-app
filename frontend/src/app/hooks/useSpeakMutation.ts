import { useSWRMutationHook } from "./useSWRMutation";
import { API_PATHS } from "../constants/apiKeys";
import { useRef, useCallback } from "react";

interface SpeechResponse {
  audio: string;
}

export function useSpeakMutation() {
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const { trigger, isMutating, error } = useSWRMutationHook<
    SpeechResponse,
    { text: string; rate: number }
  >(API_PATHS.SPEECH_SYNTHESIZE, { method: "POST" }, { throwOnError: false });

  const speak = useCallback(
    async (text: string, rate: number = 1.0) => {
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }

      try {
        const result = await trigger({ text, rate });
        if (result?.audio) {
          currentAudioRef.current = new Audio(result.audio);
          await currentAudioRef.current.play();
        }
      } catch {
        // Fallback to browser TTS if Azure fails
        console.warn("Azure TTS failed, falling back to browser TTS");
        if (typeof window !== "undefined" && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = "en-US";
          utterance.rate = rate;
          window.speechSynthesis.speak(utterance);
        }
      }
    },
    [trigger]
  );

  return { speak, isSpeaking: isMutating, error };
}
