"use client";
// components/SegmentPlayer.tsx
import React, { useState } from "react";
import styles from "./SegmetPlayer.module.css";
import YouTubePlayer from "./YouTubePlayer";

const SegmentPlayer = () => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(15);
  const [loop, setLoop] = useState(true);

  return (
    <div className={styles.card}>
      <div className={styles.videoBox}>
        <YouTubePlayer />
        {/* <span className={styles.icon}>📺</span>
        <p>Daily Conversation - At the Coffee Shop</p>
        <p className={styles.segment}>
          Segment: {start}s – {end}s
        </p> */}
      </div>

      <div className={styles.controls}>
        <button className={styles.restart}>↻ Restart</button>
        <button className={styles.play}>▶ Play</button>
        <button
          className={`${styles.loop} ${loop ? styles.on : ""}`}
          onClick={() => setLoop(!loop)}
        >
          Loop: {loop ? "ON" : "OFF"}
        </button>
      </div>

      <div className={styles.sliderGroup}>
        <label>Segment Start: {start}s</label>
        <input
          type="range"
          min={0}
          max={end}
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
        />
        <label>Segment End: {end}s</label>
        <input
          type="range"
          min={start}
          max={60}
          value={end}
          onChange={(e) => setEnd(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default SegmentPlayer;
