import styles from "./FeedBack.module.css";
import { useState } from "react";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { API_PATHS } from "@/app/constants/apiKeys";
import { mutate } from "swr";
import { Lesson } from "@/app/Types";
import { Button } from "../ui/Button";

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
      <section className={styles["feedback-container"]}>
        <label>{selectedLesson?.feedback}</label>
      </section>
    );
  }

  return (
    <form className={styles["feedback-container"]} onSubmit={handleSubmit}>
      <textarea
        rows={4}
        className={styles["feedback-input"]}
        placeholder="Leave your feedback here..."
        onChange={(event) => {
          setFeedback(event.target.value);
          setErrorMessage("");
        }}
      />
      <Button
        type="submit"
        variant="primary"
        className={styles["feedback-button"]}
        disabled={isMutating}
      >
        {isMutating ? "Submitting..." : "Submit Feedback"}
      </Button>
      {errorMessage && (
        <p className={styles["error-message"]} role="alert">
          {errorMessage}
        </p>
      )}
    </form>
  );
}
