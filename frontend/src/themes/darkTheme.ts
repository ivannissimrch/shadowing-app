"use client";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";
import { componentOverrides } from "./componentOverrides";

const BORDER_RADIUS = 8;
const FONT_FAMILY = '"Roboto", "Helvetica", "Arial", sans-serif';

const darkThemeOptions: ThemeOptions = {
  direction: "ltr",

  palette: {
    mode: "dark",
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
      contrastText: palette.warning.contrastText,
    },
    success: {
      light: palette.success.light,
      main: palette.success.main,
      dark: palette.success.dark,
    },
    grey: palette.grey,
    text: {
      primary: palette.dark.textPrimary,
      secondary: palette.dark.textSecondary,
      disabled: palette.grey[500],
    },
    background: {
      default: palette.dark.background,
      paper: palette.dark.paper,
    },
    divider: palette.dark.level1,
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

const baseDarkTheme = createTheme(darkThemeOptions);

const darkTheme = createTheme(baseDarkTheme, {
  components: componentOverrides(baseDarkTheme, BORDER_RADIUS),
});

export default darkTheme;
