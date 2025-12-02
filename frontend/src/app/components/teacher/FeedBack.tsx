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
  const { trigger, isMutating, error } = useSWRMutationHook(
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
    await trigger({ feedback });
    setFeedback("");
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
      {error ? (
        <p className={styles["error-message"]}>
          {"An error occurred while submitting feedback. Try again."}
        </p>
      ) : null}
    </form>
  );
}
