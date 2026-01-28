import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { API_PATHS } from "@/app/constants/apiKeys";
import { mutate } from "swr";
import { Lesson } from "@/app/Types";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { FiSend, FiEdit2, FiX, FiCheck } from "react-icons/fi";

interface FeedBackProps {
  idsInfo: { studentId: string; lessonId: string };
  selectedLesson?: Lesson;
}

export default function FeedBack({ idsInfo, selectedLesson }: FeedBackProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { studentId, lessonId } = idsInfo;
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedFeedback, setEditedFeedback] = useState("");
  const { trigger, isMutating } = useSWRMutationHook(
    API_PATHS.TEACHER_STUDENT_LESSON_FEEDBACK(studentId, lessonId),
    {
      method: "PATCH",
    },
    {
      onSuccess: () => {
        mutate(API_PATHS.TEACHER_STUDENT_LESSON(studentId, lessonId));
      },
    }
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      await trigger({ feedback });
      setFeedback("");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : tErrors("failedToSave")
      );
    }
  };

  const handleEditClick = () => {
    setEditedFeedback(selectedLesson?.feedback || "");
    setIsEditing(true);
    setErrorMessage("");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedFeedback("");
    setErrorMessage("");
  };

  const handleSaveEdit = async () => {
    setErrorMessage("");

    try {
      await trigger({ feedback: editedFeedback });
      setIsEditing(false);
      setEditedFeedback("");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : tErrors("failedToSave")
      );
    }
  };

  if (selectedLesson?.feedback !== null) {
    return (
      <Paper sx={{ p: 3, bgcolor: "primary.light" }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.dark" }}>
            {t("yourFeedback")}
          </Typography>
          {!isEditing && (
            <IconButton
              size="small"
              onClick={handleEditClick}
              sx={{ color: "primary.dark" }}
            >
              <FiEdit2 size={16} />
            </IconButton>
          )}
        </Box>

        {isEditing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={editedFeedback}
              onChange={(event) => {
                setEditedFeedback(event.target.value);
                setErrorMessage("");
              }}
              sx={{ mb: 2, bgcolor: "background.paper" }}
            />
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={isMutating || !editedFeedback.trim()}
                onClick={handleSaveEdit}
                startIcon={<FiCheck size={14} />}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {isMutating ? tCommon("saving") : tCommon("save")}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="small"
                onClick={handleCancelEdit}
                disabled={isMutating}
                startIcon={<FiX size={14} />}
                sx={{ textTransform: "none", fontWeight: 500 }}
              >
                {tCommon("cancel")}
              </Button>
            </Box>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "grey.800", fontWeight: 600 }}>
            {selectedLesson?.feedback}
          </Typography>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}
      </Paper>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder={t("leaveFeedbackPlaceholder")}
        value={feedback}
        onChange={(event) => {
          setFeedback(event.target.value);
          setErrorMessage("");
        }}
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isMutating || !feedback.trim()}
        startIcon={<FiSend size={16} />}
        sx={{ textTransform: "none", fontWeight: 500 }}
      >
        {isMutating ? tCommon("submitting") : t("submitFeedback")}
      </Button>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
}
