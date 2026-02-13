"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import DOMPurify from "dompurify";
import { useSWRAxios } from "@/app/hooks/useSWRAxios";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import api from "@/app/helpers/axiosFetch";
import { FeedbackReply } from "@/app/Types";
import RichTextEditor from "@/app/components/ui/RichTextEditor";
import {
  StyledDialog,
  StyledDialogContent,
  StyledDialogActions,
  StyledButton,
  StyledErrorButton,
} from "@/app/hooks/useAlertMessageStyles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import IconButton from "@mui/material/IconButton";
import DialogTitle from "@mui/material/DialogTitle";
import Tooltip from "@mui/material/Tooltip";
import { FiSend, FiEdit2, FiTrash2, FiCheck, FiX } from "react-icons/fi";

interface FeedbackReplyThreadProps {
  repliesEndpoint: string;
  currentUserId?: string;
}

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p", "br", "strong", "b", "em", "i", "u", "s", "span",
    "ul", "ol", "li", "h1", "h2", "h3", "mark",
  ],
  ALLOWED_ATTR: ["style", "data-color"],
};

export default function FeedbackReplyThread({
  repliesEndpoint,
  currentUserId,
}: FeedbackReplyThreadProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [replyContent, setReplyContent] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Edit state
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isEditSaving, setIsEditSaving] = useState(false);

  // Delete state
  const [deleteReplyId, setDeleteReplyId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    data: replies,
    isLoading,
    mutate: refreshReplies,
  } = useSWRAxios<FeedbackReply[]>(repliesEndpoint);

  const { trigger, isMutating } = useSWRMutationHook(repliesEndpoint, {
    method: "POST",
  });

  const handleSubmitReply = async () => {
    setErrorMessage("");

    try {
      await trigger({ content: replyContent });
      setReplyContent("");
      refreshReplies();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : tErrors("failedToSave")
      );
    }
  };

  const handleEditStart = (reply: FeedbackReply) => {
    setEditingReplyId(reply.id);
    setEditContent(reply.content);
    setErrorMessage("");
  };

  const handleEditCancel = () => {
    setEditingReplyId(null);
    setEditContent("");
    setErrorMessage("");
  };

  const handleEditSave = async () => {
    if (!editingReplyId) return;
    setErrorMessage("");
    setIsEditSaving(true);

    try {
      await api.patch(`${repliesEndpoint}/${editingReplyId}`, {
        content: editContent,
      });
      setEditingReplyId(null);
      setEditContent("");
      refreshReplies();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : tErrors("failedToSave")
      );
    } finally {
      setIsEditSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteReplyId) return;
    setErrorMessage("");
    setIsDeleting(true);

    try {
      await api.delete(`${repliesEndpoint}/${deleteReplyId}`);
      setDeleteReplyId(null);
      refreshReplies();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : tErrors("failedToDelete")
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const hasContent = replyContent.replace(/<[^>]*>/g, "").trim().length > 0;
  const hasEditContent = editContent.replace(/<[^>]*>/g, "").trim().length > 0;

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}
      >
        {t("replies")}
      </Typography>

      {isLoading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      {!isLoading && (!replies || replies.length === 0) && (
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", mb: 2, fontStyle: "italic" }}
        >
          {t("noRepliesYet")}
        </Typography>
      )}

      {replies && replies.length > 0 && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mb: 2 }}>
          {replies.map((reply) => {
            const isOwner = currentUserId === reply.user_id;
            const isEditing = editingReplyId === reply.id;

            return (
              <Box
                key={reply.id}
                sx={{
                  p: 2,
                  borderRadius: 1,
                  bgcolor:
                    reply.role === "teacher"
                      ? "primary.light"
                      : "grey.100",
                  borderLeft: "3px solid",
                  borderColor:
                    reply.role === "teacher"
                      ? "primary.main"
                      : "grey.400",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    mb: 0.5,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {reply.username}
                  </Typography>
                  <Chip
                    label={reply.role}
                    size="small"
                    color={reply.role === "teacher" ? "primary" : "default"}
                    sx={{ height: 20, fontSize: "0.7rem" }}
                  />
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary", ml: "auto" }}
                  >
                    {new Date(reply.created_at).toLocaleString()}
                  </Typography>
                  {isOwner && !isEditing && (
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title={t("editReply")}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditStart(reply)}
                          sx={{ color: "primary.main", p: 0.5 }}
                        >
                          <FiEdit2 size={14} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("deleteReply")}>
                        <IconButton
                          size="small"
                          onClick={() => setDeleteReplyId(reply.id)}
                          sx={{ color: "error.main", p: 0.5 }}
                        >
                          <FiTrash2 size={14} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}
                </Box>

                {isEditing ? (
                  <Box>
                    <RichTextEditor
                      value={editContent}
                      onChange={setEditContent}
                      placeholder={t("writeReply")}
                      compact
                    />
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={isEditSaving || !hasEditContent}
                        onClick={handleEditSave}
                        startIcon={<FiCheck size={14} />}
                        sx={{ textTransform: "none", fontWeight: 500 }}
                      >
                        {isEditSaving ? tCommon("saving") : tCommon("save")}
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={handleEditCancel}
                        disabled={isEditSaving}
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
                      "& p": { mb: 0.5, mt: 0 },
                      "& p:last-child": { mb: 0 },
                      "& ul, & ol": { pl: 3 },
                      "& strong, & b": { fontWeight: 600 },
                      "& s": { textDecoration: "line-through" },
                      "& mark": { borderRadius: "2px", padding: "0 2px" },
                    }}
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(
                        reply.content,
                        SANITIZE_CONFIG
                      ),
                    }}
                  />
                )}
              </Box>
            );
          })}
        </Box>
      )}

      <Box>
        <RichTextEditor
          value={replyContent}
          onChange={setReplyContent}
          placeholder={t("writeReply")}
          compact
        />
        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={isMutating || !hasContent}
          onClick={handleSubmitReply}
          startIcon={<FiSend size={14} />}
          sx={{ mt: 1, textTransform: "none", fontWeight: 500 }}
        >
          {isMutating ? t("sending") : t("sendReply")}
        </Button>
      </Box>

      {errorMessage && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Delete Confirmation Dialog */}
      <StyledDialog
        open={deleteReplyId !== null}
        onClose={() => !isDeleting && setDeleteReplyId(null)}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          {t("deleteReply")}
        </DialogTitle>
        <StyledDialogContent>
          <Typography>{t("confirmDeleteReply")}</Typography>
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton
            variant="outlined"
            onClick={() => setDeleteReplyId(null)}
            disabled={isDeleting}
          >
            {tCommon("cancel")}
          </StyledButton>
          <StyledErrorButton
            variant="contained"
            onClick={handleDeleteConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? tCommon("deleting") : tCommon("delete")}
          </StyledErrorButton>
        </StyledDialogActions>
      </StyledDialog>
    </Box>
  );
}
