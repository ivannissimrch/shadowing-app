import { FaMicrophone } from "react-icons/fa";
import styles from "./RecorderPanel.module.css";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";

export default function RecorderVoiceRecorder() {
  const {
    recording,
    paused,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
  } = useRecorderPanelContext();

  return (
    <>
      {" "}
      <div className={styles.mic}>
        <div className={styles.icon}>
          <FaMicrophone />
        </div>
        {!recording ? <p>Tap to record</p> : <p>Recording...</p>}
        <div>
          {!recording && (
            <button onClick={startRecording} className={styles.recordBtn}>
              Start Recording
            </button>
          )}
          {recording && !paused && (
            <button className={styles.recordBtn} onClick={pauseRecording}>
              Pause
            </button>
          )}
          {recording && paused && (
            <button onClick={resumeRecording} className={styles.recordBtn}>
              Resume
            </button>
          )}
          {recording && (
            <button onClick={stopRecording} className={styles.recordBtn}>
              Stop
            </button>
          )}
        </div>
      </div>
    </>
  );
}
