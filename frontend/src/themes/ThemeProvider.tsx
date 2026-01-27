'use client';

import { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './index';
import darkTheme from './darkTheme';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * Berry Theme Provider
 *
 * Wraps your app with MUI's ThemeProvider and applies:
 * - Berry color palette (blue primary, purple secondary)
 * - Professional typography (Roboto font)
 * - Clean component styles (rounded corners, nice shadows)
 * - CssBaseline for consistent cross-browser styling
 * - Dark/Light mode switching
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const { mode } = useTheme();
  const currentTheme = mode === 'dark' ? darkTheme : theme;

  return (
    <MuiThemeProvider theme={currentTheme}>
      {/* CssBaseline provides consistent base styles across browsers */}
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
