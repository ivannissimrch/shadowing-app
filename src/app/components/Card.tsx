import Image from "next/image";
import styles from "./Card.module.css";
import Link from "next/link";

interface CardProps {
  lesson: {
    title: string;
    image: string;
    lessonId: string;
  };
}

export default function Card({ lesson }: CardProps) {
  const { title, image } = lesson;
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <Image
          src={`/images/${image}.png`}
          alt="ESL lesson"
          quality={100}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <Link href={`${lesson.lessonId}`} className={styles.button}>
          Start Practicing
        </Link>
      </div>
    </div>
  );
}
