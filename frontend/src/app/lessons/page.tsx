"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Card from "../components/Card";
import { Lesson } from "../Types";
import { useAppContext } from "../AppContext";
import Logout from "../components/Logout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Lessons({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { token } = useAppContext();

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      const response = await fetch(`${API_URL}/api/lessons`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      setLessons(result.data);
    }

    loadData();
  }, [params, token]);

  if (!lessons) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
          <Logout />
        </p>
        <h2 className={styles.heading}>Choose a Video to Practice</h2>
        <p className={styles.description}>
          Select a video that matches your level and interests
        </p>
        <div className={styles["cards-container"]}>
          {lessons.map((currentLesson) => (
            <Card key={currentLesson.title} currentLesson={currentLesson} />
          ))}
        </div>
      </div>
    </main>
  );
}
