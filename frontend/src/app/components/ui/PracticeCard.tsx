"use client";
import { useState } from "react";
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
export interface AudioSegmentPlayback {
  audioUrl: string;
  startTime: number;
  endTime: number;
}

export interface PracticeCardProps {
  text: string;
  onDelete?: () => void;
  nativeLanguage?: string | null;
  wordId?: number;
  initialEvaluation?: EvaluationResult | null;
  onEvaluationSaved?: () => void;
  audioSegment?: AudioSegmentPlayback;
}

export default function PracticeCard({
  text,
  onDelete,
  nativeLanguage,
  wordId,
  initialEvaluation,
  onEvaluationSaved,
  audioSegment,
}: PracticeCardProps) {
  const plainText = (() => {
    const doc = new DOMParser().parseFromString(text, "text/html");
    return (doc.body.textContent ?? "")
      .replace(/\/+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  })();

  const {
    tPracticeWords,
    status,
    error,
    mediaBlobUrl,
    isEvaluating,
    isLessonRecording,
    displayedEvaluation,
    handleSpeak,
    updateSpeechRate,
    t,
    speechRate,
    speak,
    listenToSegment,
  } = usePracticeCard({
    text: plainText,
    nativeLanguage,
    wordId,
    initialEvaluation,
    onEvaluationSaved,
    audioSegment,
  });

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <MuiCard sx={{
      mb: 2,
      width: "100%",
      maxWidth: { xs: "100vw", sm: "100%" },
      minWidth: 0,
      overflow: "hidden"
    }}>
      <CardContent sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 3 },
        "&:last-child": { pb: { xs: 2, sm: 3 } }
      }}>
        <PracticeCardHeader
          text={text}
          onDelete={onDelete}
          tPracticeWords={tPracticeWords}
        />

        <PracticeCardActions
          text={plainText}
          speechRate={speechRate}
          speak={speak}
          listenToSegment={listenToSegment}
          status={status}
          isEvaluating={isEvaluating}
          isLessonRecording={isLessonRecording}
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
          mediaBlobUrl={mediaBlobUrl}
          t={t}
          isExpanded={isExpanded}
          onToggleExpand={() => setIsExpanded((prev) => !prev)}
        />
      </CardContent>
    </MuiCard>
  );
}
