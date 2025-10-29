import styles from "./YouTubePlayer.module.css";
import getFormattedTime from "../../helpers/getFormattedTime";

interface LoopButtonsProps {
  startTime: number | null;
  endTime: number | null;
  isLooping: boolean;
  updateStartAtCurrentTime: () => void;
  updateEndAtCurrentTime: () => void;
  toggleLoop: () => void;
  clearLoop: () => void;
}

export default function LoopButtons({
  startTime,
  endTime,
  isLooping,
  updateStartAtCurrentTime,
  updateEndAtCurrentTime,
  toggleLoop,
  clearLoop,
}: LoopButtonsProps) {
  return (
    <div className={styles.buttonsContainer}>
      <button
        onClick={updateStartAtCurrentTime}
        className={`${styles.button} ${styles.setStartButton}`}
      >
        Set Start {startTime !== null && `(${getFormattedTime(startTime)})`}
      </button>

      <button
        onClick={updateEndAtCurrentTime}
        className={`${styles.button} ${styles.setEndButton}`}
      >
        Set End {endTime !== null && `(${getFormattedTime(endTime)})`}
      </button>

      {startTime !== null && endTime !== null && (
        <>
          <button
            onClick={toggleLoop}
            className={`${styles.button} ${styles.loopButton} ${
              isLooping ? styles.active : ""
            }`}
          >
            {isLooping ? "🔁 Loop ON" : "▶️ Start Loop"}
          </button>

          <button
            onClick={clearLoop}
            className={`${styles.button} ${styles.clearButton}`}
          >
            Clear
          </button>
        </>
      )}
    </div>
  );
}
