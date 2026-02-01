"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";
import { API_PATHS } from "../../constants/apiKeys";
import toIpa from "@/app/helpers/toIpa";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { useSpeakMutation } from "../../hooks/useSpeakMutation";

import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Slider from "@mui/material/Slider";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import LinearProgress from "@mui/material/LinearProgress";
import Tooltip from "@mui/material/Tooltip";
import { FiVolume2, FiMic, FiSquare, FiX, FiHelpCircle } from "react-icons/fi";

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
  nativeLanguage,
}: {
  text: string;
  onDelete?: () => void;
  nativeLanguage?: string | null;
}) {
  const t = useTranslations("practice");
  const tPracticeWords = useTranslations("practiceWords");
  const [speechRate, setSpeechRate] = useState(0.9);

  const { speak } = useSpeakMutation();

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

  const {
    trigger: getCoachHelp,
    isMutating: isLoadingCoach,
    data: coachData,
    reset: resetCoach,
  } = useSWRMutationHook<
    CoachResponse,
    { referenceText: string; evaluation: EvaluationResult; nativeLanguage?: string }
  >(API_PATHS.SPEECH_COACH, { method: "POST" }, { throwOnError: false });

  async function handleRecordingStop(_blobUrl: string, blob: Blob) {
    const reader = new FileReader();
    const base64 = await new Promise<string>((resolve) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });

    await evaluate({
      audioData: base64,
      referenceText: text,
    });
  }

  const error = evalError ? t("evaluationFailed") : null;

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
      getCoachHelp({ referenceText: text, evaluation, nativeLanguage: nativeLanguage || undefined });
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 50) return "warning";
    return "error";
  };

  return (
    <MuiCard sx={{ mb: 2 }}>
      <CardContent>
        {/* Header with text and delete button */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary", flex: 1 }}>
            {text}
          </Typography>
          {onDelete && (
            <Tooltip title={tPracticeWords("deleteWord")}>
              <IconButton onClick={onDelete} size="small" color="error">
                <FiX size={18} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
          <Button
            variant="outlined"
            startIcon={<FiVolume2 />}
            onClick={() => speak(text, speechRate)}
            sx={{ textTransform: "none" }}
          >
            {t("listen")}
          </Button>
          <Button
            variant={status === "recording" ? "contained" : "contained"}
            color={status === "recording" ? "error" : "primary"}
            startIcon={status === "recording" ? <FiSquare /> : <FiMic />}
            onClick={handleSpeak}
            disabled={isEvaluating}
            sx={{ textTransform: "none" }}
          >
            {status === "recording" ? t("stop") : isEvaluating ? t("evaluating") : t("speak")}
          </Button>
          {mediaBlobUrl && status !== "recording" && (
            <Box component="audio" src={mediaBlobUrl} controls sx={{ height: 36 }} />
          )}
        </Box>

        {/* Speed control */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {t("speed")}: {speechRate.toFixed(1)}x
          </Typography>
          <Slider
            value={speechRate}
            onChange={(_, val) => setSpeechRate(val as number)}
            min={0.5}
            max={1}
            step={0.1}
            size="small"
            sx={{ width: 200 }}
          />
        </Box>

        {/* Feedback section */}
        <Box sx={{ minHeight: 60 }}>
          {status === "recording" && (
            <Alert severity="info" sx={{ mb: 2 }}>{t("recordingSpeakNow")}</Alert>
          )}
          {isEvaluating && <LinearProgress sx={{ mb: 2 }} />}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {evaluation && (
            <Box>
              <Divider sx={{ my: 2 }} />

              {/* Scores */}
              <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
                <Chip
                  label={`${t("accuracy")}: ${Math.round(evaluation.accuracyScore)}%`}
                  color={getScoreColor(evaluation.accuracyScore)}
                  size="small"
                />
                <Chip
                  label={`${t("fluency")}: ${Math.round(evaluation.fluencyScore)}%`}
                  color={getScoreColor(evaluation.fluencyScore)}
                  size="small"
                />
                <Chip
                  label={`${t("overall")}: ${Math.round(evaluation.pronunciationScore)}%`}
                  color={getScoreColor(evaluation.pronunciationScore)}
                  size="small"
                  variant="filled"
                />
              </Box>

              {/* Word breakdown */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
                {evaluation.words.map((word, i) => (
                  <Box key={i} sx={{ textAlign: "center" }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {word.word}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: word.accuracyScore >= 80 ? "success.main" : word.accuracyScore >= 50 ? "warning.main" : "error.main",
                        fontWeight: 600,
                      }}
                    >
                      {Math.round(word.accuracyScore)}%
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, justifyContent: "center", mt: 0.5 }}>
                      {word.phonemes?.map((p, j) => (
                        <Tooltip key={j} title={`${Math.round(p.accuracyScore)}%`}>
                          <Box
                            sx={{
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 1,
                              fontSize: "0.75rem",
                              fontWeight: 500,
                              bgcolor: p.accuracyScore >= 80 ? "success.main" : p.accuracyScore >= 50 ? "warning.main" : "error.main",
                              color: "white",
                            }}
                          >
                            {toIpa(p.phoneme)}
                          </Box>
                        </Tooltip>
                      ))}
                    </Box>
                  </Box>
                ))}
              </Box>

              {/* Help button */}
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<FiHelpCircle />}
                onClick={handleGetHelp}
                disabled={isLoadingCoach}
                sx={{ textTransform: "none", mb: 2 }}
              >
                {isLoadingCoach ? t("gettingHelp") : t("helpMeImprove")}
              </Button>

              {/* Coach feedback */}
              {coachData && (
                <Alert severity="info" icon={false} sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {t("eslCoach")}
                  </Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {coachData.feedback}
                  </Typography>
                </Alert>
              )}
            </Box>
          )}

          {!mediaBlobUrl && !isEvaluating && !evaluation && status !== "recording" && (
            <Typography variant="body2" color="text.secondary">
              {t("feedbackWillAppear")}
            </Typography>
          )}
        </Box>
      </CardContent>
    </MuiCard>
  );
}
