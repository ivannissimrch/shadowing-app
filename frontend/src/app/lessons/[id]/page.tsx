"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../../components/SegmentPlayer";
import RecorderPanel from "../../components/RecorderPanel";
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useAppContext } from "../../AppContext";
import { useEffect, useState } from "react";
import { Lesson } from "@/app/Types";

export default function Practice({
  params,
}: {
  params: Promise<{ user: string; id: string }>;
}) {
  const { token } = useAppContext();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();

  function updateSelectedLesson(updatedLesson: Lesson) {
    setSelectedLesson(updatedLesson);
  }

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      const resolvedParams = await params;
      const response = await fetch(
        `${API_URL}/api/lessons/${resolvedParams.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      setSelectedLesson(responseData.data);
    }
    loadData();
  }, [token, params]);

  return (
    <>
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
      <RecorderPanel
        selectedLesson={selectedLesson}
        updateSelectedLesson={updateSelectedLesson}
      />
    </>
  );
}
