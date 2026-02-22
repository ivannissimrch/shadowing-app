"use client";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import PracticeCardSpeedControl from "./PracticeCardSpeedControl";
import PracticeCardHeader from "./PracticeCardHeader";
import PracticeCardFeedback from "./PracticeCardFeedback";
import usePracticeCard from "@/app/hooks/usePracticeCard";
import PracticeCardActions from "./PracticeCardActions";

export interface CoachResponse {
  feedback: string;
}

export interface EvaluationResult {
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
export interface PracticeCardProps {
  text: string;
  onDelete?: () => void;
  nativeLanguage?: string | null;
  wordId?: number;
  initialEvaluation?: EvaluationResult | null;
  onEvaluationSaved?: () => void;
}

export default function PracticeCard({
  text,
  onDelete,
  nativeLanguage,
  wordId,
  initialEvaluation,
  onEvaluationSaved,
}: PracticeCardProps) {
  const {
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
    t,
    coachData,
    speechRate,
    speak,
  } = usePracticeCard({
    text,
    nativeLanguage,
    wordId,
    initialEvaluation,
    onEvaluationSaved,
  });

  return (
    <MuiCard sx={{ mb: 2 }}>
      <CardContent>
        <PracticeCardHeader
          text={text}
          onDelete={onDelete}
          tPracticeWords={tPracticeWords}
        />

        <PracticeCardActions
          text={text}
          speechRate={speechRate}
          speak={speak}
          status={status}
          isEvaluating={isEvaluating}
          handleSpeak={handleSpeak}
          t={t}
          mediaBlobUrl={mediaBlobUrl}
        />

        <PracticeCardSpeedControl
          speechRate={speechRate}
          updateSpeechRate={updateSpeechRate}
          t={t}
        />
        <PracticeCardFeedback
          status={status}
          isEvaluating={isEvaluating}
          error={error}
          displayedEvaluation={displayedEvaluation}
          isLoadingCoach={isLoadingCoach}
          handleGetHelp={handleGetHelp}
          coachData={coachData}
          mediaBlobUrl={mediaBlobUrl}
          t={t}
        />
      </CardContent>
    </MuiCard>
  );
}
