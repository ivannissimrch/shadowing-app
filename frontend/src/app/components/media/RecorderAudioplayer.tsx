import { Lesson } from "@/app/Types";
import AudioPlayer from "react-h5-audio-player";
import styles from "./RecorderPanel.module.css";
import RecorderAudioButtons from "./RecorderAudioButtons";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";

export default function RecorderAudioPlayer({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  const { recorderState } = useRecorderPanelContext();
  const audioURL =
    recorderState.status === "stopped" ? recorderState.audioURL : null;

  return (
    <section className={styles.MediaRecorder}>
      <AudioPlayer
        src={selectedLesson?.audio_file || audioURL || ""}
        showJumpControls={false}
      />
      <RecorderAudioButtons selectedLesson={selectedLesson} />
    </section>
  );
}
