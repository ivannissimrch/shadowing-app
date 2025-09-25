"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../../components/SegmentPlayer";
import RecorderPanel from "../../components/RecorderPanel";
import Image from "next/image";
import useGetSelectedLesson from "../../hooks/useGetSelectedLesson";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { useAppContext } from "@/app/AppContext";

export default function Practice() {
  const { selectedLesson, error, loading } = useGetSelectedLesson();
  const { openAlertDialog } = useAppContext();

  if (loading) {
    return <SkeletonLoader />;
  }

  if (error) {
    openAlertDialog("Error", "Error");
  }

  if (!selectedLesson) {
    return <div className={styles.grid}>No lesson found.</div>;
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
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
