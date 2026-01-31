import { TypographyVariantsOptions } from "@mui/material/styles";

export const typography = (fontFamily: string): TypographyVariantsOptions => ({
  fontFamily,

  h1: {
    fontSize: "2.125rem", // 34px
    fontWeight: 700,
    lineHeight: 1.2,
  },
  h2: {
    fontSize: "1.5rem", // 24px
    fontWeight: 700,
    lineHeight: 1.3,
  },
  h3: {
    fontSize: "1.25rem", // 20px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h4: {
    fontSize: "1rem", // 16px
    fontWeight: 600,
    lineHeight: 1.4,
  },
  h5: {
    fontSize: "0.875rem", // 14px
    fontWeight: 500,
    lineHeight: 1.5,
  },
  h6: {
    fontSize: "0.75rem", // 12px
    fontWeight: 500,
    lineHeight: 1.5,
  },

  subtitle1: {
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.5,
  },
  subtitle2: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },

  body1: {
    fontSize: "0.875rem", // 14px - Berry uses smaller base font
    fontWeight: 400,
    lineHeight: 1.5,
  },
  body2: {
    fontSize: "0.75rem", // 12px
    fontWeight: 400,
    lineHeight: 1.5,
  },

  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.5,
  },
  overline: {
    fontSize: "0.75rem",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  button: {
    textTransform: "capitalize",
    fontWeight: 500,
  },
});

export default typography;
