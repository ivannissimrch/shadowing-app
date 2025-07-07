import React from "react";
import styles from "./RecorderPanel.module.css";

const RecorderPanel = () => {
  return (
    <div className={styles.panel}>
      <div className={styles.mic}>
        <span className={styles.icon}>🎙️</span>
        <p>Ready to record</p>
        <button className={styles.recordBtn}>Start Recording</button>
      </div>
    </div>
  );
};

export default RecorderPanel;
