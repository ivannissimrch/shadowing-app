"use client";
import { createContext, useContext, useMemo, useCallback } from "react";
import { AuthContextType } from "./Types";
import { usePersistedState } from "./hooks/usePersistedState";

export const AuthContext = createContext<AuthContextType>({
  token: undefined,
  updateToken: () => {},
});

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [token, setToken] = usePersistedState<string | null>("token", null);

  const updateToken = useCallback(
    (newToken: string | null) => {
      setToken(newToken);
    },
    [setToken]
  );

  const value = useMemo(
    () => ({
      token,
      updateToken,
    }),
    [token, updateToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
