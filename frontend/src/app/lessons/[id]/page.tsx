"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../../components/SegmentPlayer";
import RecorderPanel from "../../components/RecorderPanel";
import Image from "next/image";
import useGetSelectedLesson from "../../hooks/useGetSelectedLesson";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "@/app/components/SkeletonLoader";

export default function Practice() {
  const { selectedLesson, error, loading } = useGetSelectedLesson();

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <div className={styles.grid}>
        <h1>Error Loading Lesson</h1>
      </div>
    );
  }

  if (!selectedLesson) {
    return (
      <div className={styles.grid}>
        <h1>No lesson found.</h1>
      </div>
    );
  }

  return (
    <ErrorBoundary
      fallback={
        <div className={styles.grid}>
          <h1>No lesson found.</h1>
        </div>
      }
    >
      <div className={styles.grid}>
        <SegmentPlayer selectedLesson={selectedLesson} />
        {selectedLesson?.image && (
          <Image
            src={`/images/${selectedLesson?.image}.png`}
            alt="ESL lesson"
            quality={100}
            width={625}
            height={390}
            priority
          />
        )}
      </div>
      <RecorderPanel selectedLesson={selectedLesson} />
    </ErrorBoundary>
  );
}
