"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../components/SegmentPlayer";
import RecorderPanel from "../components/RecorderPanel";
import Image from "next/image";
import Link from "next/link";

export default function Practice() {
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
            src={`/images/${"112"}.png`}
            alt="ESL lesson"
            quality={100}
            width={710}
            height={426}
            // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <RecorderPanel />
      </div>
    </main>
  );
}
