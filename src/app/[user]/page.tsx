import styles from "./page.module.css";
import Card from "../components/Card";
import { fetchUsers } from "../data/mock_data";

export default async function User({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const users = await fetchUsers();
  const resolvedParams = await params;
  const user = resolvedParams.user;
  const currentUser = users.find((currentUser) => currentUser.name === user);

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
          {currentUser?.lessons.map((lesson) => (
            <Card
              key={lesson.title}
              lesson={lesson}
              user={resolvedParams.user}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
