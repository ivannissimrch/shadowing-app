import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { API_PATHS } from "../../constants/apiKeys";
import toIpa from "@/app/helpers/toIpa";
import styles from "./PracticeCard.module.css";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { useSpeakMutation } from "../../hooks/useSpeakMutation";

interface CoachResponse {
  feedback: string;
}

interface EvaluationResult {
  text: string;
  accuracyScore: number;
  fluencyScore: number;
  completenessScore: number;
  pronunciationScore: number;
  words: {
    word: string;
    accuracyScore: number;
    errorType: string;
    phonemes: { phoneme: string; accuracyScore: number }[];
  }[];
}

export default function PracticeCard({
  text,
  onDelete,
}: {
  text: string;
  onDelete?: () => void;
}) {
  const [speechRate, setSpeechRate] = useState(0.9);

  // Text-to-speech mutation
  const { speak } = useSpeakMutation();

  // Speech evaluation mutation
  const {
    trigger: evaluate,
    isMutating: isEvaluating,
    error: evalError,
    data: evaluation,
    reset: resetEvaluation,
  } = useSWRMutationHook<
    EvaluationResult,
    { audioData: string; referenceText: string }
  >(API_PATHS.SPEECH_EVALUATE, { method: "POST" }, { throwOnError: false });

  // ESL Coach mutation
  const {
    trigger: getCoachHelp,
    isMutating: isLoadingCoach,
    data: coachData,
    reset: resetCoach,
  } = useSWRMutationHook<
    CoachResponse,
    { referenceText: string; evaluation: EvaluationResult }
  >(API_PATHS.SPEECH_COACH, { method: "POST" }, { throwOnError: false });

  async function handleRecordingStop(_blobUrl: string, blob: Blob) {
    // Convert blob to base64
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
      console.log("Evaluation response:", result);
    }
  }

  const error = evalError ? "Evaluation failed" : null;

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
      startRecording();
    }
  }

  function handleGetHelp() {
    if (evaluation) {
      getCoachHelp({ referenceText: text, evaluation });
    }
  }

  return (
    <div className={styles.practiceCard}>
      <div className={styles.cardContent}>
        <div className={styles.promptRow}>
          <p className={styles.prompt}>{text}</p>
          {onDelete && (
            <button
              className={styles.deleteButton}
              onClick={onDelete}
              title="Remove word"
            >
              X
            </button>
          )}
        </div>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.button} ${styles.listenButton}`}
            onClick={() => speak(text, speechRate)}
          >
            Listen
          </button>
          <button
            className={`${styles.button} ${styles.speakButton}`}
            onClick={handleSpeak}
            disabled={isEvaluating}
          >
            {status === "recording" ? "Stop" : isEvaluating ? "..." : "Speak"}
          </button>
          {mediaBlobUrl && status !== "recording" && (
            <audio src={mediaBlobUrl} controls />
          )}
        </div>
        <div className={styles.speedControl}>
          <span className={styles.speedLabel}>
            Speed: {speechRate.toFixed(1)}x
          </span>
          <input
            type="range"
            min="0.5"
            max="1"
            step="0.1"
            value={speechRate}
            onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
            className={styles.speedSlider}
          />
        </div>
        <div className={styles.feedback}>
          {status === "recording" && "Recording..."}
          {isEvaluating && "Evaluating pronunciation..."}
          {error && <span className={styles.error}>{error}</span>}

          {evaluation && (
            <div className={styles.evaluation}>
              <div className={styles.scores}>
                <span>Accuracy: {Math.round(evaluation.accuracyScore)}%</span>
                <span>Fluency: {Math.round(evaluation.fluencyScore)}%</span>
                <span>
                  Overall: {Math.round(evaluation.pronunciationScore)}%
                </span>
              </div>
              <div className={styles.wordsDetail}>
                {evaluation.words.map((word, i) => (
                  <div key={i} className={styles.wordBlock}>
                    <div className={styles.wordHeader}>
                      <span className={styles.wordText}>{word.word}</span>
                      <span
                        className={styles.wordScore}
                        style={{
                          color:
                            word.accuracyScore >= 80
                              ? "green"
                              : word.accuracyScore >= 50
                                ? "orange"
                                : "red",
                        }}
                      >
                        {Math.round(word.accuracyScore)}%
                      </span>
                    </div>
                    <div className={styles.phonemes}>
                      {word.phonemes?.map((p, j) => (
                        <span
                          key={j}
                          className={styles.phoneme}
                          title={`${toIpa(p.phoneme)}: ${Math.round(p.accuracyScore)}%`}
                          style={{
                            backgroundColor:
                              p.accuracyScore >= 80
                                ? "#22c55e"
                                : p.accuracyScore >= 50
                                  ? "#eab308"
                                  : "#ef4444",
                            color: "#ffffff",
                          }}
                        >
                          {toIpa(p.phoneme)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className={styles.helpButton}
                onClick={handleGetHelp}
                disabled={isLoadingCoach}
              >
                {isLoadingCoach ? "Getting help..." : "Help me improve"}
              </button>
              {coachData && (
                <div className={styles.coachFeedback}>
                  <div className={styles.coachHeader}>ESL Coach</div>
                  <div className={styles.coachText}>{coachData.feedback}</div>
                </div>
              )}
            </div>
          )}
          {!mediaBlobUrl &&
            !isEvaluating &&
            !evaluation &&
            status !== "recording" &&
            "Feedback will appear here"}
        </div>
      </div>
    </div>
  );
}
