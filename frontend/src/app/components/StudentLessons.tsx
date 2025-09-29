"use client";
import styles from "./StudentLessons.module.css";
import Card from "../components/Card";
import SkeletonLoader from "../components/SkeletonLoader";
import { Lesson } from "../Types";
import { use } from "react";
import fetchData from "../helpers/fetchData";
import { useAppContext } from "../AppContext";

export default function StudentLessons() {
  const { token } = useAppContext();
  // If no token, show loader or message or redirect to login or return?
  if (!token) {
    return <SkeletonLoader />;
  }
  const data = use(fetchData("/api/lessons", token));
  const lessons: Lesson[] = Array.isArray(data) ? data : [];
  return (
    <div className={styles["cards-container"]}>
      {lessons.map((currentLesson) => (
        <Card key={currentLesson.title} currentLesson={currentLesson} />
      ))}
    </div>
  );
}
