"use client";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { AlertContextType } from "./Types";

export const AlertContext = createContext<AlertContextType>({
  openAlertDialog: () => {},
  closeAlertDialog: () => {},
  isAlertDialogOpen: false,
  alertDialogTitle: "",
  alertDialogMessage: "",
});

export default function AlertContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [alertDialogTitle, setAlertDialogTitle] = useState("");
  const [alertDialogMessage, setAlertDialogMessage] = useState("");

  const openAlertDialog = useCallback((title: string, message: string) => {
    setAlertDialogTitle(title);
    setAlertDialogMessage(message);
    setIsAlertDialogOpen(true);
  }, []);

  const closeAlertDialog = useCallback(() => {
    setIsAlertDialogOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isAlertDialogOpen,
      openAlertDialog,
      closeAlertDialog,
      alertDialogTitle,
      alertDialogMessage,
    }),
    [isAlertDialogOpen, openAlertDialog, closeAlertDialog, alertDialogTitle, alertDialogMessage]
  );

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() {
  return useContext(AlertContext);
}
