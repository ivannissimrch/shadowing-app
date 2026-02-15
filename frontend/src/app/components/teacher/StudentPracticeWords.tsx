"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { mutate } from "swr";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import PracticeCard from "../ui/PracticeCard";
import type { EvaluationResult } from "../ui/PracticeCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { FiPlus } from "react-icons/fi";

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

export default function StudentPracticeWords({
  studentId,
}: {
  studentId: string;
}) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [newWord, setNewWord] = useState("");
  const [addError, setAddError] = useState<string | null>(null);
  const [addSuccess, setAddSuccess] = useState<string | null>(null);

  const endpoint = API_PATHS.TEACHER_STUDENT_PRACTICE_WORDS(studentId);

  const { data: words, isLoading } = useSWRAxios<PracticeWord[]>(endpoint);

  const { trigger: addWord, isMutating: isAdding } = useSWRMutationHook<
    PracticeWord,
    { word: string }
  >(endpoint, { method: "POST" }, { throwOnError: false });

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault();
    if (!newWord.trim() || isAdding) return;
    setAddError(null);
    setAddSuccess(null);

    try {
      const newPracticeWord = await addWord({ word: newWord.trim() });
      if (newPracticeWord) {
        mutate(
          endpoint,
          (current: PracticeWord[] | undefined) => [
            newPracticeWord,
            ...(current || []),
          ],
          false
        );
        setNewWord("");
        setAddSuccess(t("wordAdded"));
        setTimeout(() => setAddSuccess(null), 3000);
      }
    } catch {
      setAddError(tErrors("failedToAdd"));
    }
  }

  return (
    <>
      <Box
        component="form"
        onSubmit={handleAddWord}
        sx={{ display: "flex", gap: 2, mb: 2 }}
      >
        <TextField
          fullWidth
          placeholder={t("addPracticeWord")}
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          disabled={isAdding}
          size="small"
        />
        <Button
          type="submit"
          variant="contained"
          disabled={isAdding || !newWord.trim()}
          startIcon={
            isAdding ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FiPlus size={16} />
            )
          }
          sx={{ textTransform: "none", fontWeight: 500, whiteSpace: "nowrap" }}
        >
          {isAdding ? tCommon("adding") : tCommon("add")}
        </Button>
      </Box>

      {addError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {addError}
        </Alert>
      )}

      {addSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {addSuccess}
        </Alert>
      )}

      {!isLoading && words && words.length === 0 && (
        <Typography color="text.secondary" sx={{ py: 2 }}>
          {t("noPracticeWords")}
        </Typography>
      )}

      {words && words.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {words.map((pw) => (
            <PracticeCard
              key={pw.id}
              text={pw.word}
              initialEvaluation={
                pw.latest_result
                  ? toEvaluationResult(pw.word, pw.latest_result)
                  : null
              }
            />
          ))}
        </Box>
      )}
    </>
  );
}
