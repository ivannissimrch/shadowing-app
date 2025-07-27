"use client";
import styles from "./SegmetPlayer.module.css";
import YouTubePlayer from "./YouTubePlayer";
export default function SegmentPlayer() {
  return (
    <div className={styles.card}>
      <div className={styles.videoBox}>
        <YouTubePlayer />
      </div>
    </div>
  );
}
