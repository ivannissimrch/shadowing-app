"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AppContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";

export const AppContext = createContext<AppContextType>({
  openAlertDialog: () => {},
  closeAlertDialog: () => {},
  isAlertDialogOpen: false,
  token: null,
  updateToken: () => {},
  isTokenLoading: false,
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [token, setToken] = usePersistedState<string | null>("token", null);
  const [isTokenLoading, setIsTokenLoading] = useState(true);

  function updateToken(newToken: string) {
    setToken(newToken);
  }

  function openAlertDialog() {
    setIsAlertDialogOpen(true);
  }

  function closeAlertDialog() {
    setIsAlertDialogOpen(false);
  }

  useEffect(() => {
    setIsTokenLoading(false);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isAlertDialogOpen,
        openAlertDialog,
        closeAlertDialog,
        token,
        updateToken,
        isTokenLoading,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
