"use client";

import { useRouter } from "next/navigation";
import styles from "../components/ui/ErrorFallback.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  function handleRetry() {
    reset();
    router.refresh();
  }

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <h1 className={styles.errorTitle}>Error Loading Lesson</h1>
        <p className={styles.errorMessage}>
          {error.message || "Unable to load lesson content"}
        </p>
        <button className={styles.errorButton} onClick={handleRetry}>
          Try Again
        </button>
      </div>
    </div>
  );
}
