"use client";
import { ReactNode } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./index";
import darkTheme from "./darkTheme";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useTheme();
  const currentTheme = mode === "dark" ? darkTheme : theme;

  return (
    <StyledEngineProvider injectFirst>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </StyledEngineProvider>
  );
}
