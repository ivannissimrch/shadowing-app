"use client";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { PronunciationWord } from "@/app/Types";

interface PronunciationBreakdownProps {
  words: PronunciationWord[];
}

const GOOD_THRESHOLD = 90;
const OK_THRESHOLD = 75;

function scoreColor(score: number | undefined) {
  if (score === undefined) return "text.disabled";
  if (score >= GOOD_THRESHOLD) return "success.main";
  if (score >= OK_THRESHOLD) return "warning.dark";
  return "error.main";
}

function scoreBg(score: number | undefined) {
  if (score === undefined) return "action.hover";
  if (score >= GOOD_THRESHOLD) return "success.light";
  if (score >= OK_THRESHOLD) return "warning.light";
  return "error.light";
}

function wordTooltip(word: PronunciationWord) {
  const parts: string[] = [];
  if (typeof word.accuracyScore === "number") {
    parts.push(`${Math.round(word.accuracyScore)}/100`);
  }
  if (word.errorType && word.errorType !== "None") {
    parts.push(word.errorType);
  }
  const weakPhonemes = (word.phonemes ?? [])
    .filter(
      (p) =>
        typeof p.accuracyScore === "number" && p.accuracyScore < OK_THRESHOLD
    )
    .map((p) => `${p.phoneme} (${Math.round(p.accuracyScore ?? 0)})`);
  if (weakPhonemes.length > 0) {
    parts.push(weakPhonemes.join(", "));
  }
  return parts.join(" · ");
}

// Renders the reference script with each word colored by how well the student
// pronounced it, so the teacher can visually verify the AI draft against the
// actual per-word/phoneme scores instead of just trusting the summary.
export default function PronunciationBreakdown({
  words,
}: PronunciationBreakdownProps) {
  const t = useTranslations("teacher");

  if (!words || words.length === 0) return null;

  // Scripts can include teaching notes typed after the dialogue (never meant
  // to be read aloud). Azure only scores what it can actually align to the
  // recording, so anything past the last scored word is just unattempted
  // reference text, not real signal, drop it instead of rendering a wall of
  // uncolored words.
  let lastScoredIndex = -1;
  words.forEach((word, index) => {
    if (typeof word.accuracyScore === "number") lastScoredIndex = index;
  });
  const relevantWords =
    lastScoredIndex >= 0 ? words.slice(0, lastScoredIndex + 1) : [];

  if (relevantWords.length === 0) return null;

  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.default",
      }}
    >
      <Typography
        variant="caption"
        fontWeight={600}
        color="text.secondary"
        sx={{ display: "block", mb: 1 }}
      >
        {t("pronunciationBreakdown")}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {relevantWords.map((word, index) => {
          const tooltip = wordTooltip(word);
          const isOmission = word.errorType === "Omission";
          return (
            <Tooltip
              key={`${word.word}-${index}`}
              title={tooltip}
              arrow
              disableHoverListener={!tooltip}
            >
              <Box
                component="span"
                sx={{
                  color: scoreColor(word.accuracyScore),
                  bgcolor: scoreBg(word.accuracyScore),
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: isOmission ? "line-through" : "none",
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                  cursor: tooltip ? "help" : "default",
                }}
              >
                {word.word}
              </Box>
            </Tooltip>
          );
        })}
      </Box>
      <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "success.main",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {t("pronunciationGood")}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "warning.dark",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {t("pronunciationOk")}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              bgcolor: "error.main",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {t("pronunciationWeak")}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
