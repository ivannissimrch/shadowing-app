import React from "react";
import styles from "./Card.module.css";

interface CardProps {
  title: string;
  level: "beginner" | "intermediate" | "advanced";
  topic: string;
  duration: string;
}

const levelColors = {
  beginner: styles.beginner,
  intermediate: styles.intermediate,
  advanced: styles.advanced,
};

export default function Card({ title, level, topic, duration }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <span className={styles.camera}>🎥</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.tags}>
          <span className={`${styles.tag} ${levelColors[level]}`}>{level}</span>
          <span className={styles.tag}>{topic}</span>
        </div>
        <p className={styles.duration}>Duration: {duration}</p>
        <button className={styles.button}>Start Practicing</button>
      </div>
    </div>
  );
}
