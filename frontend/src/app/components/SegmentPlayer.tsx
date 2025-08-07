import { Lesson } from "../Types";
import styles from "./SegmetPlayer.module.css";
import YouTubePlayer from "./YouTubePlayer";
export default function SegmentPlayer({
  selectedLesson,
}: {
  selectedLesson: Lesson | undefined;
}) {
  console.log(selectedLesson);
  if (!selectedLesson) {
    return <div>Lesson not found</div>;
  }

  return (
    <div className={styles.card}>
      <div className={styles.videoBox}>
        <YouTubePlayer selectedLesson={selectedLesson} />
      </div>
    </div>
  );
}
