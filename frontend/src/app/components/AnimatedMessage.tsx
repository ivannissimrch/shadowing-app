"use client";
import styles from "./AnimatedMessage.module.css";
import useAnimatedText from "../hooks/useAnimatedText";

export default function AnimatedMessage() {
  return (
    <h1 className={styles.message}>
      {useAnimatedText("Let's talk! Ready to repeat after me?")}
    </h1>
  );
}
