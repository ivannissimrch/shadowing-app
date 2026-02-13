"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { API_PATHS } from "@/app/constants/apiKeys";
import { mutate } from "swr";
import { Lesson } from "@/app/Types";
import DOMPurify from "dompurify";
import RichTextEditor from "@/app/components/ui/RichTextEditor";
import FeedbackReplyThread from "@/app/components/feedback/FeedbackReplyThread";
import { useAuthContext } from "@/app/AuthContext";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { FiSend, FiEdit2, FiX, FiCheck } from "react-icons/fi";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "s", "span",
    "ul", "ol", "li", "h1", "h2", "h3", "mark",
  ],
  ALLOWED_ATTR: ["style", "data-color"],
};

interface FeedBackProps {
  idsInfo: { studentId: string; lessonId: string };
  selectedLesson?: Lesson;
}

export default function FeedBack({ idsInfo, selectedLesson }: FeedBackProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const { token } = useAuthContext();
  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : undefined;
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

  const handleSubmit = async () => {
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

  const hasFeedbackContent = feedback.replace(/<[^>]*>/g, "").trim().length > 0;
  const hasEditedContent = editedFeedback.replace(/<[^>]*>/g, "").trim().length > 0;

  const repliesEndpoint = API_PATHS.TEACHER_FEEDBACK_REPLIES(studentId, lessonId);

  if (selectedLesson?.feedback != null) {
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
            <RichTextEditor
              value={editedFeedback}
              onChange={(html) => {
                setEditedFeedback(html);
                setErrorMessage("");
              }}
              placeholder={t("leaveFeedbackPlaceholder")}
            />
            <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="small"
                disabled={isMutating || !hasEditedContent}
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
          <Box
            sx={{
              color: "grey.800",
              fontWeight: 600,
              fontSize: "0.875rem",
              "& p": { mb: 0.5, mt: 0 },
              "& p:last-child": { mb: 0 },
              "& ul, & ol": { pl: 3 },
              "& strong, & b": { fontWeight: 600 },
              "& s": { textDecoration: "line-through" },
              "& mark": { borderRadius: "2px", padding: "0 2px" },
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(
                selectedLesson?.feedback || "",
                SANITIZE_CONFIG
              ),
            }}
          />
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <FeedbackReplyThread repliesEndpoint={repliesEndpoint} currentUserId={currentUserId} />
      </Paper>
    );
  }

  return (
    <Box>
      <RichTextEditor
        value={feedback}
        onChange={(html) => {
          setFeedback(html);
          setErrorMessage("");
        }}
        placeholder={t("leaveFeedbackPlaceholder")}
      />
      <Button
        variant="contained"
        color="primary"
        disabled={isMutating || !hasFeedbackContent}
        onClick={handleSubmit}
        startIcon={<FiSend size={16} />}
        sx={{ mt: 2, textTransform: "none", fontWeight: 500 }}
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
