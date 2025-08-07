import styles from "./page.module.css";
import Card from "../components/Card";
import { User } from "../Types";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function Users({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const resolvedParams = await params;
  const userName = resolvedParams.user;
  const response = await fetch(`${API_URL}/api/users/${userName}`);
  const result = await response.json();
  const currentUser: User = result.data;

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
          {currentUser?.lessons.map((currentLesson) => (
            <Card
              key={currentLesson.title}
              currentLesson={currentLesson}
              userName={userName}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
