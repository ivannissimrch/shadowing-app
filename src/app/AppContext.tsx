"use client";
import React, { createContext, useContext, useState } from "react";
import { Lesson, LessonsContextType } from "./Types";
const lessons: Lesson[] = [
  {
    title: "Suits week 110",
    image: "110",
    videoId: "ImEnWAVRLU0",
    lessonId: "110",
    status: "completed",
  },
  {
    title: "Suits week 111",
    image: "111",
    videoId: "jjeLzr1JR4o",
    lessonId: "111",
    status: "completed",
  },
  {
    title: "Suits week 112",
    image: "112",
    videoId: "jjeLzr1JR4o",
    lessonId: "112",
    status: "active",
  },
];

export const lessonsContext = createContext<LessonsContextType>({
  lessons: undefined,
  setActiveLesson: () => {},
  getActiveLesson: () => {},
});

export default function StocksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [eslLessons, seEslLessons] = useState<Lesson[]>(lessons);

  function setActiveLesson(id: string) {
    seEslLessons((prevLessons) => {
      return prevLessons.map((lesson) => {
        if (lesson.lessonId === id) {
          return { ...lesson, status: "active" };
        }
        return { ...lesson, status: "completed" };
      });
    });
  }

  function getActiveLesson() {
    const result = eslLessons.find((lesson) => lesson.status === "active");
    return result;
  }

  return (
    <lessonsContext.Provider
      value={{ lessons: eslLessons, setActiveLesson, getActiveLesson }}
    >
      {children}s
    </lessonsContext.Provider>
  );
}

export function useAppContext() {
  return useContext(lessonsContext);
}
