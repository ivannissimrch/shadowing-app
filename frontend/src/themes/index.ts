"use client";
import { createTheme, ThemeOptions, Theme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";
import { componentOverrides } from "./componentOverrides";

const BORDER_RADIUS = 8;
const FONT_FAMILY = '"Roboto", "Helvetica", "Arial", sans-serif';

const themeOptions: ThemeOptions = {
  direction: "ltr",
  palette: {
    mode: "light",
    primary: {
      light: palette.primary.light,
      main: palette.primary.main,
      dark: palette.primary.dark,
      contrastText: "#ffffff",
    },
    secondary: {
      light: palette.secondary.light,
      main: palette.secondary.main,
      dark: palette.secondary.dark,
      contrastText: "#ffffff",
    },
    error: {
      light: palette.error.light,
      main: palette.error.main,
      dark: palette.error.dark,
    },
    warning: {
      light: palette.warning.light,
      main: palette.warning.main,
      dark: palette.warning.dark,
      contrastText: palette.grey[700],
    },
    success: {
      light: palette.success.light,
      main: palette.success.main,
      dark: palette.success.dark,
    },
    grey: palette.grey,
    text: {
      primary: palette.text.primary,
      secondary: palette.text.secondary,
      disabled: palette.text.disabled,
    },
    background: {
      paper: palette.background.paper,
      default: palette.background.default,
    },
    divider: palette.divider,
  },

  typography: typography(FONT_FAMILY),

  shape: {
    borderRadius: BORDER_RADIUS,
  },

  mixins: {
    toolbar: {
      minHeight: 48,
      padding: "16px",
      "@media (min-width: 600px)": {
        minHeight: 48,
      },
    },
  },

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
};

const baseTheme = createTheme(themeOptions);

const theme: Theme = createTheme(baseTheme, {
  components: componentOverrides(baseTheme, BORDER_RADIUS),
});

export default theme;
