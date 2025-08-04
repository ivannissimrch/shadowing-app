"use client";
import React, { createContext, useContext, useState } from "react";
import { Lesson, LessonsContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";
//TODO update this to get lessons from API
const lessons: Lesson[] = [
  {
    title: "Suits week 110",
    image: "110",
    videoId: "ImEnWAVRLU0",
    lessonId: "110",
    status: "completed",
    audioFile: "",
  },
  {
    title: "Suits week 111",
    image: "111",
    videoId: "jjeLzr1JR4o",
    lessonId: "111",
    status: "completed",
    audioFile: "",
  },
  {
    title: "Suits week 112",
    image: "112",
    videoId: "jjeLzr1JR4o",
    lessonId: "112",
    status: "new",
    audioFile: "",
  },
];

export const lessonsContext = createContext<LessonsContextType>({
  lessons: undefined,
  addAudioToLesson: () => {},
  openSnackBar: () => {},
  closeSnackBar: () => {},
  isSnackBarOpen: false,
});

export default function StocksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [eslLessons, setEslLessons] = usePersistedState<Lesson[]>(
    "lessons",
    lessons
  );

  function openSnackBar() {
    setIsSnackBarOpen(true);
  }

  function closeSnackBar() {
    setIsSnackBarOpen(false);
  }

  function addAudioToLesson(id: string, audioFile: string) {
    setEslLessons((prevLessons) => {
      return prevLessons.map((lesson) => {
        if (lesson.lessonId === id) {
          return { ...lesson, status: "completed", audioFile: audioFile };
        }
        return lesson;
      });
    });
  }

  return (
    <lessonsContext.Provider
      value={{
        lessons: eslLessons,
        addAudioToLesson,
        isSnackBarOpen,
        openSnackBar,
        closeSnackBar,
      }}
    >
      {children}
    </lessonsContext.Provider>
  );
}

export function useAppContext() {
  return useContext(lessonsContext);
}
