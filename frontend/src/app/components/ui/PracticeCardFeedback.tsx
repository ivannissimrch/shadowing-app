import toIpa from "@/app/helpers/toIpa";
import {
  Alert,
  Box,
  Button,
  Chip,
  Divider,
  LinearProgress,
  Tooltip,
  Typography,
} from "@mui/material";
import getScoreColor from "@/app/helpers/getScoreColor";
import { FiHelpCircle } from "react-icons/fi";
import { CoachResponse, EvaluationResult } from "./PracticeCard";

interface PracticeCardFeedbackProps {
  status: string;
  isEvaluating: boolean;
  error: string | null;
  displayedEvaluation: EvaluationResult | null;
  isLoadingCoach: boolean;
  handleGetHelp: () => void;
  coachData: CoachResponse | null | undefined;
  mediaBlobUrl: string | null | undefined;
  t: (key: string) => string;
}

export default function PracticeCardFeedback({
  status,
  isEvaluating,
  error,
  displayedEvaluation,
  isLoadingCoach,
  handleGetHelp,
  coachData,
  mediaBlobUrl,
  t,
}: PracticeCardFeedbackProps) {
  return (
    <Box sx={{ minHeight: 60 }}>
      {status === "recording" && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {t("recordingSpeakNow")}
        </Alert>
      )}
      {isEvaluating && <LinearProgress sx={{ mb: 2 }} />}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {displayedEvaluation && (
        <Box>
          <Divider sx={{ my: 2 }} />

          {/* Scores */}
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip
              label={`${t("accuracy")}: ${Math.round(displayedEvaluation.accuracyScore)}%`}
              color={getScoreColor(displayedEvaluation.accuracyScore)}
              size="small"
            />
            <Chip
              label={`${t("fluency")}: ${Math.round(displayedEvaluation.fluencyScore)}%`}
              color={getScoreColor(displayedEvaluation.fluencyScore)}
              size="small"
            />
            <Chip
              label={`${t("overall")}: ${Math.round(displayedEvaluation.pronunciationScore)}%`}
              color={getScoreColor(displayedEvaluation.pronunciationScore)}
              size="small"
              variant="filled"
            />
          </Box>

          {/* Word breakdown */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 2 }}>
            {displayedEvaluation.words.map((word, i) => (
              <Box key={i} sx={{ textAlign: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {word.word}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      word.accuracyScore >= 80
                        ? "success.main"
                        : word.accuracyScore >= 50
                          ? "warning.main"
                          : "error.main",
                    fontWeight: 600,
                  }}
                >
                  {Math.round(word.accuracyScore)}%
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.5,
                    justifyContent: "center",
                    mt: 0.5,
                  }}
                >
                  {word.phonemes?.map((p, j) => (
                    <Tooltip key={j} title={`${Math.round(p.accuracyScore)}%`}>
                      <Box
                        sx={{
                          px: 0.75,
                          py: 0.25,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          bgcolor:
                            p.accuracyScore >= 80
                              ? "success.main"
                              : p.accuracyScore >= 50
                                ? "warning.main"
                                : "error.main",
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

      {!mediaBlobUrl &&
        !isEvaluating &&
        !displayedEvaluation &&
        status !== "recording" && (
          <Typography variant="body2" color="text.secondary">
            {t("feedbackWillAppear")}
          </Typography>
        )}
    </Box>
  );
}
