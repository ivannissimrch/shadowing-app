"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Card from "../components/Card";
import { Lesson } from "../Types";
import { useAppContext } from "../AppContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Lessons() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { token, isTokenLoading } = useAppContext();

  useEffect(() => {
    async function loadData() {
      if (isTokenLoading || !token) return;
      try {
        const response = await fetch(`${API_URL}/api/lessons`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setLessons(result.data);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    }

    loadData();
  }, [token, isTokenLoading]);

  if (!lessons.length) return <div>Loading...</div>;

  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <div className={styles["cards-container"]}>
        {lessons.map((currentLesson) => (
          <Card key={currentLesson.title} currentLesson={currentLesson} />
        ))}
      </div>
    </>
  );
}
