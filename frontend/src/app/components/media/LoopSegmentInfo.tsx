import getFormattedTime from "@/app/helpers/getFormattedTime";
import styles from "./YouTubePlayer.module.css";

interface LoopTimerProps {
  startTime: number;
  endTime: number;
}

export default function LoopSegmentInfo({
  startTime,
  endTime,
}: LoopTimerProps) {
  return (
    <div className={styles.segmentInfo}>
      Loop segment: {getFormattedTime(startTime)} → {getFormattedTime(endTime)}{" "}
      ({endTime - startTime}s)
    </div>
  );
}
