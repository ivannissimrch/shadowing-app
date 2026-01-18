"use client";
import { Suspense, useState } from "react";
import { mutate } from "swr";
import { ErrorBoundary } from "react-error-boundary";
import styles from "./page.module.css";
import { API_PATHS } from "../../constants/apiKeys";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import PracticeWordsList from "./PracticeWordsList";

interface PracticeWord {
  id: number;
  word: string;
  created_at: string;
}

export default function PracticePage() {
  const [newWord, setNewWord] = useState("");
  const [addError, setAddError] = useState<string | null>(null);

  // Add word mutation
  const { trigger: addWord, isMutating: isAdding } = useSWRMutationHook<
    PracticeWord,
    { word: string }
  >(API_PATHS.PRACTICE_WORDS, { method: "POST" }, { throwOnError: false });

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault();
    if (!newWord.trim() || isAdding) return;
    setAddError(null);

    try {
      const newPracticeWord = await addWord({ word: newWord.trim() });
      if (newPracticeWord) {
        // Update SWR cache globally
        mutate(
          API_PATHS.PRACTICE_WORDS,
          (current: PracticeWord[] | undefined) => [
            newPracticeWord,
            ...(current || []),
          ],
          false
        );
        setNewWord("");
      }
    } catch {
      setAddError("Failed to add word");
    }
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Practice</h1>
      </header>

      {/* Add new word form */}
      <form className={styles.addForm} onSubmit={handleAddWord}>
        <input
          type="text"
          className={styles.addInput}
          placeholder="Add a word or phrase to practice..."
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          disabled={isAdding}
        />
        <button
          type="submit"
          className={styles.addButton}
          disabled={isAdding || !newWord.trim()}
        >
          {isAdding ? "Adding..." : "Add"}
        </button>
      </form>

      {addError && <p className={styles.errorMessage}>{addError}</p>}

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className={styles.errorContainer}>
            <p className={styles.errorMessage}>
              Failed to load practice words: {error.message}
            </p>
            <button onClick={resetErrorBoundary} className={styles.retryButton}>
              Try again
            </button>
          </div>
        )}
        onReset={() => mutate(API_PATHS.PRACTICE_WORDS)}
      >
        <Suspense fallback={<p>Loading practice words...</p>}>
          <PracticeWordsList />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
