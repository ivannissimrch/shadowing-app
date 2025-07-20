import React from "react";
import styles from "./Practice.module.css";
import SegmentPlayer from "../components/SegmentPlayer";
import RecorderPanel from "../components/RecorderPanel";

export default function Practice() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>

        <div className={styles.headerRow}>
          <button className={styles.backBtn}>← Back to Videos</button>
          <div className={styles.meta}>
            <h2>Daily Conversation - At the Coffee Shop</h2>
            <p>Beginner · Daily Life</p>
          </div>
        </div>

        <div className={styles.grid}>
          <SegmentPlayer />
          <RecorderPanel />
        </div>
      </div>
    </main>
  );
}
