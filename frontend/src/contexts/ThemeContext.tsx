"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeContextProviderProps {
  children: ReactNode;
}

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  // Always start with "light" to match server render and avoid hydration mismatch
  const [mode, setMode] = useState<ThemeMode>("light");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved theme after hydration
  useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode === "dark") {
      setMode("dark");
    }
    setIsHydrated(true);
  }, []);

  // Save theme changes (but not the initial hydration load)
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("themeMode", mode);
    }
  }, [mode, isHydrated]);

  const toggleMode = useCallback(() => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);

  const value = useMemo(() => ({ mode, toggleMode }), [mode, toggleMode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeContextProvider");
  }
  return context;
}
