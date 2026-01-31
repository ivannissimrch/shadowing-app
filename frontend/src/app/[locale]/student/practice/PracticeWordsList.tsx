"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { mutate } from "swr";
import api from "../../../helpers/axiosFetch";
import { API_PATHS } from "../../../constants/apiKeys";
import PracticeCard from "@/app/components/ui/PracticeCard";
import { useSWRAxios } from "../../../hooks/useSWRAxios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";

interface PracticeWord {
  id: number;
  word: string;
  created_at: string;
}

export default function PracticeWordsList() {
  const t = useTranslations("student");
  const tErrors = useTranslations("errors");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { data: words } = useSWRAxios<PracticeWord[]>(API_PATHS.PRACTICE_WORDS);

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
            onDelete={() => handleDeleteWord(word.id)}
          />
        ))}
      </Box>
    </>
  );
}
