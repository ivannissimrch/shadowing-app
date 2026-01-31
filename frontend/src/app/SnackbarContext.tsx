"use client";
import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { SnackbarContextType, SnackbarSeverity } from "./Types";
import AppSnackbar from "./components/ui/AppSnackbar";

export const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
  hideSnackbar: () => {},
});

export default function SnackbarContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<SnackbarSeverity>("success");

  const showSnackbar = useCallback((msg: string, sev: SnackbarSeverity = "success") => {
    setMessage(msg);
    setSeverity(sev);
    setOpen(true);
  }, []);

  const hideSnackbar = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ showSnackbar, hideSnackbar }),
    [showSnackbar, hideSnackbar]
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <AppSnackbar
        open={open}
        message={message}
        severity={severity}
        onClose={hideSnackbar}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  return useContext(SnackbarContext);
}
