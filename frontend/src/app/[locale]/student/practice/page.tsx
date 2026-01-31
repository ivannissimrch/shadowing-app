"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { mutate } from "swr";
import { ErrorBoundary } from "react-error-boundary";
import { API_PATHS } from "../../../constants/apiKeys";
import { useSWRMutationHook } from "../../../hooks/useSWRMutation";
import PracticeWordsList from "./PracticeWordsList";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { FiPlus } from "react-icons/fi";
import Transitions from "../../../components/ui/Transitions";

interface PracticeWord {
  id: number;
  word: string;
  created_at: string;
}

export default function PracticePage() {
  const t = useTranslations("navigation");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const tPractice = useTranslations("practiceWords");
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
      setAddError(tErrors("failedToAdd"));
    }
  }

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("practice")}
      </Typography>
      <Transitions type="fade">
        <Box
          component="form"
          onSubmit={handleAddWord}
          sx={{ display: "flex", gap: 2, mb: 3 }}
        >
        <TextField
          fullWidth
          placeholder={tPractice("addWord")}
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
        <Alert severity="error" sx={{ mb: 3 }}>
          {addError}
        </Alert>
      )}

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {tErrors("failedToLoadPracticeWords")}: {error.message}
            </Alert>
            <Button variant="contained" onClick={resetErrorBoundary}>
              {tErrors("tryAgainButton")}
            </Button>
          </Box>
        )}
        onReset={() => mutate(API_PATHS.PRACTICE_WORDS)}
      >
        <PracticeWordsList />
      </ErrorBoundary>
      </Transitions>
    </Box>
  );
}
