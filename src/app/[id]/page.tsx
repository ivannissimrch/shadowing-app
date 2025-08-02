"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../components/SegmentPlayer";
import RecorderPanel from "../components/RecorderPanel";
import Image from "next/image";
import Link from "next/link";
import useSelectedLesson from "../hooks/useSelectedLesson";

export default function Practice() {
  const selectedLesson = useSelectedLesson();

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
            src={`/images/${selectedLesson?.image}.png`}
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
