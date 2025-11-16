import Skeleton from "@mui/material/Skeleton";
import styles from "./PracticePageSkeleton.module.css";

export default function PracticePageSkeleton() {
  return (
    <>
      <div className={styles.grid}>
        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: "100%",
            aspectRatio: "16 / 9",
            borderRadius: "var(--radius-sm)",
          }}
        />

        <Skeleton
          animation="wave"
          variant="rectangular"
          sx={{
            width: "100%",
            aspectRatio: "16 / 10",
            borderRadius: "var(--radius-sm)",
          }}
        />

        <div className={styles.toggleButtons}>
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: "var(--radius-sm)" }}
          />
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={120}
            height={36}
            sx={{ borderRadius: "var(--radius-sm)" }}
          />
        </div>
      </div>

      <Skeleton
        animation="wave"
        variant="rectangular"
        height={200}
        sx={{
          width: "100%",
          borderRadius: "var(--radius-sm)",
          marginTop: "var(--spacing-15)",
        }}
      />
    </>
  );
}
