import { Lesson } from "../../Types";
import styles from "@/styles/components/media/SegmentPlayer.module.css";
import YouTubePlayer from "./YouTubePlayer";

interface SegmentPlayerProps {
  selectedLesson: Lesson | undefined;
}

export default function SegmentPlayer({ selectedLesson }: SegmentPlayerProps) {
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
