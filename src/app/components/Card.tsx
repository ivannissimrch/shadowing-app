import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  video: {
    title: string;
    topic: string;
    duration: string;
  };
}

export default function Card({ video }: CardProps) {
  const { title, topic, duration } = video;
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <span className={styles.camera}>🎥</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.tags}>
          <span className={styles.tag}>{topic}</span>
        </div>
        <p className={styles.duration}>Duration: {duration}</p>
        <button className={styles.button}>Start Practicing</button>
      </div>
    </div>
  );
}
