import { FaMicrophone } from "react-icons/fa";
import styles from "./RecorderPanel.module.css";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";

export default function RecorderVoiceRecorder() {
  const {
    recorderState,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecorderPanelContext();

  const isRecording = recorderState.status === "recording";
  const isPaused = recorderState.status === "paused";
  const isIdle = recorderState.status === "idle";

  return (
    <>
      {" "}
      <div className={styles.mic}>
        <div className={styles.icon}>
          <FaMicrophone />
        </div>
        {isIdle ? <p>Tap to record</p> : <p>Recording...</p>}
        <div>
          {isIdle && (
            <button onClick={startRecording} className={styles.recordBtn}>
              Start Recording
            </button>
          )}
          {isRecording && (
            <button className={styles.recordBtn} onClick={pauseRecording}>
              Pause
            </button>
          )}
          {isPaused && (
            <button onClick={resumeRecording} className={styles.recordBtn}>
              Resume
            </button>
          )}
          {(isRecording || isPaused) && (
            <button onClick={stopRecording} className={styles.recordBtn}>
              Stop
            </button>
          )}
        </div>
      </div>
    </>
  );
}
