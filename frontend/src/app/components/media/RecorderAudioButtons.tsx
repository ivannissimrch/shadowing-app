import { Lesson } from "@/app/Types";
import styles from "./RecorderPanel.module.css";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import { Button } from "../ui/Button";

export default function RecorderAudioButtons({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  const { dispatch, handleSubmit, isAudioMutating, isLessonMutating } =
    useRecorderPanelContext();
  const isSubmitting = isAudioMutating || isLessonMutating;

  if (selectedLesson?.status === "completed") {
    return null;
  } else {
    return (
      <div className={styles.buttonGroup}>
        <Button
          variant="danger"
          className={styles.recordBtn}
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
          disabled={isSubmitting}
        >
          Delete
        </Button>
        <Button
          variant="primary"
          className={styles.recordBtn}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    );
  }
}
