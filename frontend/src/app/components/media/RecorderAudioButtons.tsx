import { Lesson } from "@/app/Types";
import styles from "./RecorderPanel.module.css";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";

export default function RecorderAudioButtons({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  const { dispatch, handleSubmit } = useRecorderPanelContext();

  if (selectedLesson?.status === "completed") {
    return null;
  } else {
    return (
      <>
        <button
          className={styles.recordBtn}
          onClick={() => {
            dispatch({ type: "RESET" });
          }}
        >
          Delete
        </button>
        <button className={styles.recordBtn} onClick={handleSubmit}>
          Submit
        </button>
      </>
    );
  }
}
