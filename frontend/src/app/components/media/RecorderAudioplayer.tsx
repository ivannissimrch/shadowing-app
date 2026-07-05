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

  return (
    <Box>
      <AudioPlayer
        src={selectedLesson?.audio_file || audioURL || ""}
        showJumpControls={false}
      />
      <RecorderAudioButtons selectedLesson={selectedLesson} />
    </Box>
  );
}
