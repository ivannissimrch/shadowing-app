import styles from "./page.module.css";

export default function Loading() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Loading...</h1>
      </div>
    </main>
  );
}
