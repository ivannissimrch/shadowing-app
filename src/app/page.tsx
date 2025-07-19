import styles from "./page.module.css";
import Card from "./components/Card";

const videos = [
  {
    title: "Daily Conversation - At the Coffee Shop",
    topic: "Daily Life",
    duration: "2:00",
  },
  {
    title: "Job Interview Tips and Phrases",
    topic: "Business",
    duration: "3:00",
  },
  {
    title: "Academic Presentation Skills",
    topic: "Academic",
    duration: "4:00",
  },
  {
    title: "Ordering Food at a Restaurant",
    topic: "Daily Life",
    duration: "1:30",
  },
  {
    title: "Discussing Weather and Small Talk",
    topic: "Social",
    duration: "2:30",
  },
  {
    title: "Technical Product Presentation",
    topic: "Technology",
    duration: "5:00",
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

        <div className={styles.grid}>
          {videos.map((video) => (
            <Card key={video.title} video={video} />
          ))}
        </div>
      </div>
    </main>
  );
}
