import { Lesson } from "../Types";
// import styles from "./SegmetPlayer.module.css";
import YouTubePlayer from "./YouTubePlayer";
// import ReactPlayer from "react-player";
export default function SegmentPlayer({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  if (!selectedLesson) {
    return <div>Lesson not found</div>;
  }

  return (
    // <div className={styles.card}>
    // <div className={styles.videoBox}>
    <YouTubePlayer selectedLesson={selectedLesson} />
    // <ReactPlayer
    //   src="/video/115Video.mp4"
    //   controls={true}
    //   style={{ width: "100%", height: "100%" }}
    // />

    // </div>
    // </div>
  );
}
