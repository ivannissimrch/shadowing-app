import styles from "./page.module.css";
import Card from "./components/Card";

const videos = [
  {
    title: "Suits week 109",
    image: "109",
    videoId: "",
  },
  {
    title: "Suits week 110",
    image: "110",
    videoId: "",
  },
  {
    title: "Suits week 111",
    image: "111",
    videoId: "",
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
          {videos.map((video) => (
            <Card key={video.title} video={video} />
          ))}
        </div>
      </div>
    </main>
  );
}
