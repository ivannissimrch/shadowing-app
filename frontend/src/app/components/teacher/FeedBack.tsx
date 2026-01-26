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
import { FiSend } from "react-icons/fi";

interface FeedBackProps {
  idsInfo: { studentId: string; lessonId: string };
  selectedLesson?: Lesson;
}

export default function FeedBack({ idsInfo, selectedLesson }: FeedBackProps) {
  const { studentId, lessonId } = idsInfo;
  const [feedback, setFeedback] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
        err instanceof Error ? err.message : "Failed to submit feedback"
      );
    }
  };

  if (selectedLesson?.feedback !== null) {
    return (
      <Paper sx={{ p: 3, bgcolor: "primary.light" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}>
          Your Feedback
        </Typography>
        <Typography variant="body2" color="text.primary">
          {selectedLesson?.feedback}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        multiline
        rows={4}
        placeholder="Leave your feedback here..."
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
        {isMutating ? "Submitting..." : "Submit Feedback"}
      </Button>
      {errorMessage && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errorMessage}
        </Alert>
      )}
    </Box>
  );
}
