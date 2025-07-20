import Image from "next/image";
import styles from "./Card.module.css";

interface CardProps {
  video: {
    title: string;
    image: string;
    videoId: string;
  };
}

export default function Card({ video }: CardProps) {
  const { title, image } = video;
  return (
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <Image
          src={`/images/${image}.png`}
          alt="ESL lesson"
          fill
          quality={100}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        <button className={styles.button}>Start Practicing</button>
      </div>
    </div>
  );
}
