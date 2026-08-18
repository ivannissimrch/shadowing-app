/**
 * Landing-page-only design tokens.
 *
 * SCOPE: these values are consumed exclusively by components under
 * `components/marketing/landing/**` and `components/marketing/LandingPage.tsx`.
 * They intentionally do NOT touch the MUI theme, global CSS, or any shared UI
 * component, so nothing here can leak into the authenticated app.
 *
 * Palette rationale: the ShadowSpeak logo is a blue -> violet gradient around a
 * soundwave motif, so the brand expression here is that gradient, grounded on a
 * deep navy ink and warmed by a single gold accent reserved for CTAs. Supporting
 * accents exist so icons can be individually coloured by topic instead of
 * repeating one flat brand colour everywhere.
 */

/** Deep navy — text, dark surfaces, and the "ink" end of the brand ramp. */
export const INK = {
  900: "#071528",
  800: "#0A2540",
  700: "#123456",
  600: "#1E3A8A",
} as const;

/** Logo-derived brand ramp: electric blue -> violet. */
export const BRAND = {
  blue: "#2B7FFF",
  blueDeep: "#1D5FD8",
  indigo: "#5B5BF0",
  violet: "#8B5CF6",
  violetDeep: "#6D34E0",
} as const;

/** The single warm accent. Reserved for primary CTAs and highlight rules. */
export const GOLD = {
  main: "#F5A623",
  light: "#FBBF24",
  dark: "#C97F0B",
} as const;

/** Page surfaces, light -> tinted. */
export const SURFACE = {
  white: "#FFFFFF",
  base: "#F7FAFD",
  tinted: "#EFF4FA",
  edge: "#E3EBF4",
} as const;

export const TEXT = {
  primary: "#0A2540",
  secondary: "#546A85",
  muted: "#8FA3B8",
  onDark: "#FFFFFF",
  onDarkMuted: "rgba(255,255,255,0.72)",
} as const;

export const BORDER = {
  light: "#E3EBF4",
  soft: "rgba(10,37,64,0.08)",
  dashed: "#C6D4E3",
  onDark: "rgba(255,255,255,0.14)",
} as const;

/** Layered shadow scale — depth comes from stacking, not one hard drop shadow. */
export const SHADOW = {
  soft: "0 1px 2px rgba(10,37,64,0.04), 0 8px 24px rgba(10,37,64,0.06)",
  medium:
    "0 1px 2px rgba(10,37,64,0.05), 0 12px 32px rgba(10,37,64,0.08), 0 32px 64px -24px rgba(10,37,64,0.12)",
  lift: "0 2px 4px rgba(10,37,64,0.06), 0 20px 48px rgba(10,37,64,0.12), 0 48px 96px -32px rgba(10,37,64,0.2)",
  glow: "0 8px 28px rgba(245,166,35,0.32)",
  brandGlow: "0 8px 28px rgba(43,127,255,0.28)",
  onDark: "0 24px 64px rgba(0,0,0,0.36)",
} as const;

/** Frosted glass over light surfaces. Use only where the panel floats over art. */
export const glassLight = {
  bgcolor: "rgba(255,255,255,0.72)",
  backdropFilter: "blur(20px) saturate(180%)",
  WebkitBackdropFilter: "blur(20px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.9)",
  boxShadow: `${SHADOW.medium}, inset 0 1px 0 rgba(255,255,255,0.95)`,
} as const;

/** Frosted glass over dark surfaces. */
export const glassDark = {
  bgcolor: "rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px) saturate(160%)",
  WebkitBackdropFilter: "blur(18px) saturate(160%)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: `${SHADOW.onDark}, inset 0 1px 0 rgba(255,255,255,0.1)`,
} as const;

export const brandGradient = `linear-gradient(120deg, ${BRAND.blue} 0%, ${BRAND.indigo} 52%, ${BRAND.violet} 100%)`;
export const inkGradient = `linear-gradient(160deg, ${INK[900]} 0%, ${INK[800]} 55%, ${INK[700]} 100%)`;

export const displayFont =
  '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif';

/** Shared horizontal rhythm for every landing section. */
export const shellSx = {
  px: { xs: "20px", sm: "32px", md: "40px", xl: "56px" },
  width: "100%",
  maxWidth: 1440,
  mx: "auto",
} as const;

export const sectionPy = { xs: 9, md: 14 } as const;

/* ------------------------------------------------------------------ */
/* Topic accents — icons are coloured by what they mean, not by brand. */
/* ------------------------------------------------------------------ */

export type AccentTone =
  | "blue"
  | "violet"
  | "cyan"
  | "gold"
  | "coral"
  | "emerald";

export const accentStyles: Record<
  AccentTone,
  {
    color: string;
    onDark: string;
    bg: string;
    bgDark: string;
    border: string;
    glow: string;
  }
> = {
  blue: {
    color: "#1D5FD8",
    onDark: "#7FB2FF",
    bg: "rgba(43,127,255,0.12)",
    bgDark: "rgba(43,127,255,0.18)",
    border: "rgba(43,127,255,0.28)",
    glow: "0 8px 24px rgba(43,127,255,0.28)",
  },
  violet: {
    color: "#6D34E0",
    onDark: "#C4A6FF",
    bg: "rgba(139,92,246,0.12)",
    bgDark: "rgba(139,92,246,0.2)",
    border: "rgba(139,92,246,0.3)",
    glow: "0 8px 24px rgba(139,92,246,0.28)",
  },
  cyan: {
    color: "#0E8FA8",
    onDark: "#67E0F5",
    bg: "rgba(14,165,196,0.12)",
    bgDark: "rgba(14,165,196,0.2)",
    border: "rgba(14,165,196,0.28)",
    glow: "0 8px 24px rgba(14,165,196,0.26)",
  },
  gold: {
    color: "#C97F0B",
    onDark: "#FBBF24",
    bg: "rgba(245,166,35,0.14)",
    bgDark: "rgba(245,166,35,0.2)",
    border: "rgba(245,166,35,0.32)",
    glow: "0 8px 24px rgba(245,166,35,0.3)",
  },
  coral: {
    color: "#D6455F",
    onDark: "#FF9DAF",
    bg: "rgba(236,72,101,0.12)",
    bgDark: "rgba(236,72,101,0.2)",
    border: "rgba(236,72,101,0.28)",
    glow: "0 8px 24px rgba(236,72,101,0.26)",
  },
  emerald: {
    color: "#0F8A5F",
    onDark: "#5FE0A8",
    bg: "rgba(16,185,129,0.12)",
    bgDark: "rgba(16,185,129,0.2)",
    border: "rgba(16,185,129,0.28)",
    glow: "0 8px 24px rgba(16,185,129,0.26)",
  },
};

/* ------------------------------------------------------------------ */
/* Motion                                                              */
/* ------------------------------------------------------------------ */

export const EASE = [0.22, 1, 0.36, 1] as const;

/** Reveal once, when the element is ~18% on screen. */
export const revealOnce = { once: true, amount: 0.18 } as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.62, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
};

export const slideIn = (fromLeft: boolean) => ({
  hidden: { opacity: 0, x: fromLeft ? -34 : 34 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE } },
});

/** ~90ms stagger, per the brief. */
export const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
};

export const staggerFast = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
};

/** Card hover: lift + shadow growth. Suppressed under reduced-motion. */
export const hoverLiftSx = {
  transition:
    "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, border-color 0.4s ease, background-color 0.4s ease",
  "@media (prefers-reduced-motion: no-preference)": {
    "&:hover": { transform: "translateY(-6px)" },
  },
  "&:focus-within": {
    outline: `2px solid ${BRAND.blue}`,
    outlineOffset: 3,
  },
} as const;

/** Button hover: subtle rise + shadow bloom. */
export const buttonLiftSx = {
  transition:
    "transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
  "@media (prefers-reduced-motion: no-preference)": {
    "&:hover": { transform: "translateY(-2px)" },
  },
  "&:focus-visible": {
    outline: `2px solid ${GOLD.main}`,
    outlineOffset: 3,
  },
} as const;
