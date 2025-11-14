import Skeleton from "@mui/material/Skeleton";
import styles from "./SkeletonLoader.module.css";

export default function SkeletonLoader() {
  return (
    <div className={styles.skeletonGrid}>
      {[1, 2, 3, 4, 5, 6].map((skeletonCard) => (
        <div key={skeletonCard} className={styles.skeletonCard}>
          {/* Card header area */}
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={80}
            sx={{ borderRadius: 0 }}
          />
          {/* Card content area */}
          <div className={styles.skeletonContent}>
            <Skeleton animation="wave" width="80%" height={24} />
            <Skeleton animation="wave" width="40%" height={20} />
          </div>
          {/* Card button area */}
          <Skeleton
            animation="wave"
            variant="rectangular"
            height={48}
            sx={{ borderRadius: 0 }}
          />
        </div>
      ))}
    </div>
  );
}
