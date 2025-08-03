"use client";
import styles from "./page.module.css";
import Card from "./components/Card";
import { useAppContext } from "./AppContext";

export default function Home() {
  const { lessons } = useAppContext();
  console.log("Lessons in Home:", lessons);

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>
        <h2 className={styles.heading}>Choose a Video to Practice</h2>
        <p className={styles.description}>
          Select a video that matches your level and interests
        </p>
        <div className={styles["cards-container"]}>
          {lessons?.map((lesson) => (
            <Card key={lesson.title} lesson={lesson} />
          ))}
        </div>
      </div>
    </main>
  );
}
