import styles from "./page.module.css";
import YouTubePlayer from "./components/YouTubePlayer";

export default function Home() {
  return (
    <>
      <div className={styles.page}>
        <main className={styles.main}>
          <YouTubePlayer />
          <div>Record</div>
          <section>Results</section>
        </main>
      </div>
    </>
  );
}
