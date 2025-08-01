"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../components/SegmentPlayer";
import RecorderPanel from "../components/RecorderPanel";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "../AppContext";

export default function Practice() {
  const { getActiveLesson } = useAppContext();
  const activeLesson = getActiveLesson();
  if (!activeLesson) {
    return <main className={styles.main}>Loading</main>;
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>
        <div className={styles.headerRow}>
          <Link href="/" className={styles.backBtn}>
            ← Back to Lessons
          </Link>
        </div>
        <div className={styles.grid}>
          <SegmentPlayer />
          <Image
            src={`/images/${activeLesson.image}.png`}
            alt="ESL lesson"
            quality={100}
            width={710}
            height={426}
          />
        </div>
        <RecorderPanel />
      </div>
    </main>
  );
}
