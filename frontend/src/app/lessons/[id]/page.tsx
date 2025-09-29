import styles from "./Practice.module.css";
import { PracticeComponents } from "@/app/components/PracticeComponents";
import { ErrorBoundary } from "react-error-boundary";
import SkeletonLoader from "@/app/components/SkeletonLoader";
import { Suspense } from "react";

export default async function Practice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <ErrorBoundary
      fallback={
        <div className={styles.grid}>
          <h1>No lesson found.</h1>
        </div>
      }
    >
      <Suspense fallback={<SkeletonLoader />}>
        <PracticeComponents id={id} />
      </Suspense>
    </ErrorBoundary>
  );
}