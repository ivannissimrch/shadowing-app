"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { mutate } from "swr";
import api from "../../../helpers/axiosFetch";
import { API_PATHS } from "../../../constants/apiKeys";
import PracticeCard from "@/app/components/ui/PracticeCard";
import type { EvaluationResult } from "@/app/components/ui/PracticeCard";
import { useSWRAxios } from "../../../hooks/useSWRAxios";
import { useAuthContext } from "../../../AuthContext";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

interface PracticeResultDB {
  id: number;
  practice_word_id: number;
  accuracy_score: number;
  fluency_score: number;
  completeness_score: number;
  pronunciation_score: number;
  words_breakdown: {
    word: string;
    accuracyScore: number;
    errorType: string;
    phonemes: { phoneme: string; accuracyScore: number }[];
  }[] | null;
  created_at: string;
}

interface PracticeWord {
  id: number;
  word: string;
  created_at: string;
  latest_result: PracticeResultDB | null;
}

interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  native_language: string | null;
  role: string;
}

function toEvaluationResult(
  word: string,
  r: PracticeResultDB
): EvaluationResult {
  return {
    text: word,
    accuracyScore: Number(r.accuracy_score),
    fluencyScore: Number(r.fluency_score),
    completenessScore: Number(r.completeness_score),
    pronunciationScore: Number(r.pronunciation_score),
    words: r.words_breakdown || [],
  };
}

export default function PracticeWordsList() {
  const t = useTranslations("student");
  const tErrors = useTranslations("errors");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data: words } = useSWRAxios<PracticeWord[]>(API_PATHS.PRACTICE_WORDS);

  // Fetch user profile to get native_language
  const { token } = useAuthContext();
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const { data: profile } = useSWRAxios<UserProfile>(
    user?.id ? API_PATHS.USER_PROFILE(user.id) : null
  );

  async function handleDeleteWord(wordId: number) {
    setDeleteError(null);
    try {
      await api.delete(API_PATHS.PRACTICE_WORD(wordId));
      mutate(
        API_PATHS.PRACTICE_WORDS,
        (current: PracticeWord[] | undefined) =>
          current?.filter((w) => w.id !== wordId),
        false
      );
    } catch {
      setDeleteError(tErrors("failedToDelete"));
    }
  }

  if (!words || words.length === 0) {
    return (
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ textAlign: "center", py: 4 }}
      >
        {t("noPracticeWords")}
      </Typography>
    );
  }

  return (
    <>
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError}
        </Alert>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {words.map((word) => (
          <PracticeCard
            key={word.id}
            text={word.word}
            wordId={word.id}
            initialEvaluation={
              word.latest_result
                ? toEvaluationResult(word.word, word.latest_result)
                : null
            }
            onDelete={() => handleDeleteWord(word.id)}
            onEvaluationSaved={() => mutate(API_PATHS.PRACTICE_WORDS)}
            nativeLanguage={profile?.native_language}
          />
        ))}
      </Box>
    </>
  );
}
