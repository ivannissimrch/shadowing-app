import styles from "./page.module.css";
import Card from "./components/Card";

const lessons = [
  {
    title: "Suits week 110",
    image: "110",
    lessonId: "ImEnWAVRLU0",
  },
  {
    title: "Suits week 111",
    image: "111",
    lessonId: "jjeLzr1JR4o",
  },
  {
    title: "Suits week 112",
    image: "112",
    lessonId: "jjeLzr1JR4o",
  },
];

export default function Home() {
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
          {lessons.map((lesson) => (
            <Card key={lesson.title} lesson={lesson} />
          ))}
        </div>
      </div>
    </main>
  );
}
