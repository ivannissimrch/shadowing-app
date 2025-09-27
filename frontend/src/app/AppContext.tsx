"use client";
import React, { createContext, useContext, useState } from "react";
import { AppContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";

export const AppContext = createContext<AppContextType>({
  openAlertDialog: () => {},
  closeAlertDialog: () => {},
  isAlertDialogOpen: false,
  alertDialogTitle: "",
  alertDialogMessage: "",
  token: null,
  updateToken: () => {},
});

export default function AppContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");
  const [token, setToken] = usePersistedState<string | null>("token", null);

  function updateToken(newToken: string) {
    setToken(newToken);
  }

  function openAlertDialog(title: string, message: string) {
    setAlertDialogTitle(title);
    setAlertDialogMessage(message);
    setIsAlertDialogOpen(true);
  }

  function closeAlertDialog() {
    setIsAlertDialogOpen(false);
  }

  return (
    <AppContext.Provider
      value={{
        isAlertDialogOpen,
        openAlertDialog,
        closeAlertDialog,
        alertDialogTitle,
        alertDialogMessage,
        token,
        updateToken,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
