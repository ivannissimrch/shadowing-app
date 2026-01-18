"use client";
import { useState } from "react";
import { mutate } from "swr";
import styles from "./page.module.css";
import api from "../../helpers/axiosFetch";
import { API_PATHS } from "../../constants/apiKeys";
import PracticeCard from "@/app/components/ui/PracticeCard";
import { useSWRAxios } from "../../hooks/useSWRAxios";

interface PracticeWord {
  id: number;
  word: string;
  created_at: string;
}

export default function PracticeWordsList() {
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
      setDeleteError("Failed to delete word");
    }
  }

  if (!words || words.length === 0) {
    return (
      <p className={styles.emptyMessage}>
        No practice words yet. Add some above!
      </p>
    );
  }

  return (
    <>
      {deleteError && <p className={styles.errorMessage}>{deleteError}</p>}
      <div className={styles.practiceList}>
        {words.map((word) => (
          <PracticeCard
            key={word.id}
            text={word.word}
            onDelete={() => handleDeleteWord(word.id)}
          />
        ))}
      </div>
    </>
  );
}
