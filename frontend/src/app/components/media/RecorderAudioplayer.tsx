import { useRef } from "react";
import { Lesson } from "@/app/Types";
import AudioPlayer from "react-h5-audio-player";
import RecorderAudioButtons from "./RecorderAudioButtons";
import { useRecorderPanelContext } from "@/app/RecorderpanelContext";
import Box from "@mui/material/Box";

export default function RecorderAudioPlayer({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  const { recorderState } = useRecorderPanelContext();
  const audioURL =
    recorderState.status === "stopped" ? recorderState.audioURL : null;

  const playerRef = useRef<AudioPlayer>(null);

  // Raw MediaRecorder .webm recordings are uploaded without duration metadata,
  // so the browser reports `duration === Infinity` and the file is not seekable —
  // clicking the progress bar snaps playback back to 0. Force the browser to scan
  // to the end once so it learns the real duration, then reset to the start; after
  // that the file seeks normally. This is a no-op for recordings that already have
  // a finite duration (e.g. Safari .mp4), so existing recordings are untouched.
  function handleLoadedMetadata() {
    const audio = playerRef.current?.audio.current;
    if (!audio || Number.isFinite(audio.duration)) return;

    const resolveDuration = () => {
      if (Number.isFinite(audio.duration)) {
        audio.removeEventListener("durationchange", resolveDuration);
        audio.currentTime = 0;
      }
    };

    audio.addEventListener("durationchange", resolveDuration);
    audio.currentTime = 1e101;
  }

  return (
    <Box>
      <AudioPlayer
        ref={playerRef}
        src={selectedLesson?.audio_file || audioURL || ""}
        showJumpControls={false}
        onLoadedMetaData={handleLoadedMetadata}
      />
      <RecorderAudioButtons selectedLesson={selectedLesson} />
    </Box>
  );
}
