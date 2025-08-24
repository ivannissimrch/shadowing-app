"use client";
import styles from "./Practice.module.css";
import SegmentPlayer from "../../components/SegmentPlayer";
import RecorderPanel from "../../components/RecorderPanel";
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useAppContext } from "../../AppContext";
import { useEffect, useState } from "react";
import { Lesson, User } from "@/app/Types";
import Logout from "@/app/components/Logout";

export default function Practice({
  params,
}: {
  params: Promise<{ user: string; id: string }>;
}) {
  const { token } = useAppContext();
  const [selectedLesson, setSelectedLesson] = useState<Lesson | undefined>();
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      const resolvedParams = await params;
      const response = await fetch(
        `${API_URL}/api/users/${resolvedParams.user}/lessons/${resolvedParams.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const responseData = await response.json();
      setSelectedLesson(responseData.data);

      const response2 = await fetch(
        `${API_URL}/api/users/${resolvedParams.user}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response2Data = await response2.json();
      setCurrentUser(response2Data.data);
    }
    loadData();
  }, [token, params]);

  return (
    <main className={styles.main}>
      <Logout />
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>

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
          currentUser={currentUser}
          selectedLesson={selectedLesson}
        />
      </div>
    </main>
  );
}
