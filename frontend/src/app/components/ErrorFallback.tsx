import styles from "./ErrorFallback.module.css";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  title?: string;
}

export default function ErrorFallback({
  error,
  resetErrorBoundary,
  title = "Something went wrong",
}: ErrorFallbackProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <h1 className={styles.errorTitle}>{title}</h1>
        <p className={styles.errorMessage}>{error.message}</p>
        <button className={styles.errorButton} onClick={resetErrorBoundary}>
          Try Again
        </button>
      </div>
    </div>
  );
}
