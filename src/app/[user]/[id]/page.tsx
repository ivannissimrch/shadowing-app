import styles from "./Practice.module.css";
import SegmentPlayer from "../../components/SegmentPlayer";
import RecorderPanel from "../../components/RecorderPanel";
import Image from "next/image";
import Link from "next/link";
import { fetchUsers } from "@/app/data/mock_data";

export default async function Practice({
  params,
}: {
  params: Promise<{ user: string; id: string }>;
}) {
  const users = await fetchUsers();
  const resolvedParams = await params;
  const currentUser = users.find((user) => user.name === resolvedParams.user);
  const selectedLesson = currentUser?.lessons.find(
    (lesson) => lesson.lessonId === resolvedParams.id
  );
  if (!selectedLesson) {
    <div>Lesson not found</div>;
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
          <SegmentPlayer selectedLesson={selectedLesson} />
          <Image
            src={`/images/${selectedLesson?.image}.png`}
            alt="ESL lesson"
            quality={100}
            width={625}
            height={390}
            priority
          />
        </div>
        <RecorderPanel
          currentUser={currentUser}
          selectedLesson={selectedLesson}
        />
      </div>
    </main>
  );
}
