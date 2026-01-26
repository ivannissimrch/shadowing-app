'use client';

import { ReactNode } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './index';

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
 */
export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      {/* CssBaseline provides consistent base styles across browsers */}
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
