import { FaMicrophone } from "react-icons/fa";
import styles from "./RecorderPanel.module.css";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import { Button } from "../ui/Button/Button";

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
      <div className={styles.mic}>
        <div className={styles.icon}>
          <FaMicrophone />
        </div>
        {isIdle ? <p>Tap to record</p> : <p>Recording...</p>}
        <div className={styles.buttonGroup}>
          {isIdle && (
            <Button variant="primary" onClick={startRecording}>
              Start Recording
            </Button>
          )}
          {isRecording && (
            <Button variant="secondary" onClick={pauseRecording}>
              Pause
            </Button>
          )}
          {isPaused && (
            <Button variant="primary" onClick={resumeRecording}>
              Resume
            </Button>
          )}
          {(isRecording || isPaused) && (
            <Button variant="danger" onClick={stopRecording}>
              Stop
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
