"use client";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { mutate } from "swr";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { Lesson, ListWithLessons } from "@/app/Types";

interface AddLessonsToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  listId: string;
  existingLessonIds: string[];
}

export default function AddLessonsToListModal({
  isOpen,
  onClose,
  listId,
  existingLessonIds,
}: AddLessonsToListModalProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  // Fetch all lessons
  const { data: lessons, isLoading } = useSWRAxios<Lesson[]>(
    isOpen ? API_PATHS.ALL_LESSONS : null
  );

  const { trigger, isMutating } = useSWRMutationHook<
    ListWithLessons,
    { lessonIds: string[] }
  >(API_PATHS.LIST_LESSONS(listId), { method: "POST" });

  // Reset selection when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedLessons([]);
      setError(null);
    }
  }, [isOpen]);

  // Filter out lessons already in the list
  const availableLessons = lessons?.filter(
    (lesson) => !existingLessonIds.includes(lesson.id)
  );

  const handleToggle = (lessonId: string) => {
    setSelectedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleSubmit = async () => {
    if (selectedLessons.length === 0) return;

    setError(null);
    try {
      await trigger({ lessonIds: selectedLessons });
      mutate(API_PATHS.LIST(listId));
      mutate(API_PATHS.ALL_LISTS);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : tErrors("failedToSave"));
    }
  };

  return (
    <StyledDialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="add-lessons-dialog-title"
      aria-modal="true"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle
        id="add-lessons-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("addLessonsToList")}
      </DialogTitle>
      <StyledDialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : availableLessons && availableLessons.length > 0 ? (
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {availableLessons.map((lesson) => (
              <ListItem key={lesson.id} disablePadding>
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(lesson.id)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedLessons.includes(lesson.id)}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": `lesson-${lesson.id}` }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={`lesson-${lesson.id}`}
                    primary={lesson.title}
                    secondary={lesson.category || undefined}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
            {t("noAvailableLessons")}
          </Typography>
        )}

        {error && (
          <Typography
            color="error"
            sx={{ mt: 2, fontSize: "0.875rem" }}
            role="alert"
          >
            {error}
          </Typography>
        )}

        {selectedLessons.length > 0 && (
          <Typography
            color="text.secondary"
            sx={{ mt: 2, fontSize: "0.875rem" }}
          >
            {t("lessonsSelected", { count: selectedLessons.length })}
          </Typography>
        )}
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={onClose}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isMutating || selectedLessons.length === 0}
        >
          {isMutating ? tCommon("adding") : tCommon("add")}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
