import styles from "./YouTubePlayer.module.css";
import getFormattedTime from "../../helpers/getFormattedTime";
import { MdLoop, MdPlayArrow } from "react-icons/md";
import { LoopState } from "./loopTypes";
import { memo } from "react";

interface LoopButtonsProps {
  startTime: number | null;
  endTime: number | null;
  isLooping: boolean;
  updateStartAtCurrentTime: () => void;
  updateEndAtCurrentTime: () => void;
  toggleLoop: () => void;
  clearLoop: () => void;
  state: LoopState;
}

function LoopButtons({
  startTime,
  endTime,
  isLooping,
  updateStartAtCurrentTime,
  updateEndAtCurrentTime,
  toggleLoop,
  clearLoop,
  state,
}: LoopButtonsProps) {
  return (
    <div className={styles.buttonsContainer}>
      {state.status === "idle" && (
        <button
          onClick={updateStartAtCurrentTime}
          className={`${styles.button} ${styles.setStartButton}`}
        >
          Set Start {startTime !== null && `(${getFormattedTime(startTime)})`}
        </button>
      )}
      {state.status === "start_set" && (
        <button
          onClick={updateEndAtCurrentTime}
          className={`${styles.button} ${styles.setEndButton}`}
        >
          Set End {endTime !== null && `(${getFormattedTime(endTime)})`}
        </button>
      )}

      {startTime !== null && endTime !== null && (
        <>
          <button
            onClick={toggleLoop}
            className={`${styles.button} ${styles.loopButton} ${
              isLooping ? styles.active : ""
            }`}
          >
            {isLooping ? (
              <>
                <MdLoop /> Loop ON
              </>
            ) : (
              <>
                <MdPlayArrow /> Start Loop
              </>
            )}
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

export default memo(LoopButtons);
