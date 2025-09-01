"use client";
import React, { createContext, useContext, useState } from "react";
import { Lesson, LessonsContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";

//TODO update this to get lessons from API

export const lessonsContext = createContext<LessonsContextType>({
  lessons: undefined,
  addAudioToLesson: () => {},
  openAlertDialog: () => {},
  closeAlertDialog: () => {},
  isAlertDialogOpen: false,
  token: null,
  updateToken: () => {},
});

export default function StocksContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [eslLessons, setEslLessons] = usePersistedState<Lesson[] | undefined>(
    "lessons",
    undefined
  );
  const [token, setToken] = usePersistedState<string | null>("token", null);

  function updateToken(newToken: string) {
    setToken(newToken);
  }

  function openAlertDialog() {
    setIsAlertDialogOpen(true);
  }

  function closeAlertDialog() {
    setIsAlertDialogOpen(false);
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
        isAlertDialogOpen,
        openAlertDialog,
        closeAlertDialog,
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
