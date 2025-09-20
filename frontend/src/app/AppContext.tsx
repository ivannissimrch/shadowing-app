"use client";
import React, { createContext, useContext, useState } from "react";
import { AppContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";

export const lessonsContext = createContext<AppContextType>({
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

  return (
    <lessonsContext.Provider
      value={{
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
