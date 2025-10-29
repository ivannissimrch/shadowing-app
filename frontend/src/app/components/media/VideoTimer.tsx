import styles from "./YouTubePlayer.module.css";
import getFormattedTime from "../../helpers/getFormattedTime";

export default function VideoTimer({ currentTime }: { currentTime: number }) {
  return (
    <div className={styles.currentTime}>
      Current time: <strong>{getFormattedTime(currentTime)}</strong>
    </div>
  );
}
