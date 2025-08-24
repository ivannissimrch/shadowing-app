"use client";
import React, { createContext, useContext, useState } from "react";
import { Lesson, LessonsContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";

//TODO update this to get lessons from API

export const lessonsContext = createContext<LessonsContextType>({
  lessons: undefined,
  addAudioToLesson: () => {},
  openSnackBar: () => {},
  closeSnackBar: () => {},
  isSnackBarOpen: false,
  token: null,
  updateToken: () => {},
});

export default function StocksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSnackBarOpen, setIsSnackBarOpen] = useState(false);
  const [eslLessons, setEslLessons] = usePersistedState<Lesson[] | undefined>(
    "lessons",
    undefined
  );
  const [token, setToken] = usePersistedState<string | null>("token", null);

  function updateToken(newToken: string) {
    setToken(newToken);
  }

  function openSnackBar() {
    setIsSnackBarOpen(true);
  }

  function closeSnackBar() {
    setIsSnackBarOpen(false);
  }

  function addAudioToLesson(id: string, audioFile: string) {
    setEslLessons((prevLessons) => {
      return prevLessons?.map((lesson) => {
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
        token,
        updateToken,
      }}
    >
      {children}
    </lessonsContext.Provider>
  );
}

export function useAppContext() {
  return useContext(lessonsContext);
}
