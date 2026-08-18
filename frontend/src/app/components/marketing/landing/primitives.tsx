"use client";

/**
 * Landing-only presentational primitives.
 *
 * These deliberately do NOT reuse `components/ui/*` (Card, AnimateButton, …)
 * because those are shared with the authenticated app. Everything here is a
 * landing-scoped variant so the marketing restyle cannot regress the product UI.
 */

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import type { SxProps, Theme } from "@mui/material/styles";
import {
  motion,
  useInView,
  useReducedMotion,
  animate,
  type Variants,
} from "framer-motion";

import {
  accentStyles,
  brandGradient,
  buttonLiftSx,
  BRAND,
  displayFont,
  EASE,
  fadeIn,
  fadeUp,
  GOLD,
  INK,
  revealOnce,
  shellSx,
  SHADOW,
  stagger,
  TEXT,
  type AccentTone,
} from "./tokens";

const MotionBox = motion.create(Box);

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

/** Consistent max-width + gutters for every section body. */
export function Shell({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box sx={{ ...shellSx, position: "relative", zIndex: 1, ...sx }}>
      {children}
    </Box>
  );
}

/**
 * Soft gradient mesh blob. Several of these per section replace flat colour
 * blocks with layered depth. Purely decorative, so it is aria-hidden and
 * frozen under reduced-motion.
 */
export function MeshBlob({
  top,
  left,
  right,
  bottom,
  size,
  color,
  blur = 100,
  delay = 0,
  opacity = 1,
}: {
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  size: number | Record<string, number>;
  color: string;
  blur?: number;
  delay?: number;
  opacity?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <MotionBox
      aria-hidden
      animate={reduce ? undefined : { y: [0, -18, 0], scale: [1, 1.05, 1] }}
      transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay }}
      sx={{
        position: "absolute",
        top,
        left,
        right,
        bottom,
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        filter: `blur(${blur}px)`,
        opacity,
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

/** Fine grain overlay — keeps large flat areas from banding. */
export function GrainOverlay({ opacity = 0.035 }: { opacity?: number }) {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        opacity,
        pointerEvents: "none",
        zIndex: 0,
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

/** Hairline gradient rule used between light sections. */
export function HairlineDivider() {
  return (
    <Box
      aria-hidden
      sx={{
        height: 1,
        background:
          "linear-gradient(90deg, transparent, rgba(10,37,64,0.12), transparent)",
        mx: { xs: 3, md: 8 },
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Typography                                                          */
/* ------------------------------------------------------------------ */

/** Small uppercase label above a section title. */
export function Eyebrow({
  children,
  light = false,
  tone = "blue",
}: {
  children: React.ReactNode;
  light?: boolean;
  tone?: AccentTone;
}) {
  const a = accentStyles[tone];
  return (
    <Stack
      component={motion.span}
      variants={fadeUp}
      direction="row"
      spacing={1}
      alignItems="center"
      sx={{
        display: "inline-flex",
        px: 1.5,
        py: 0.6,
        borderRadius: 999,
        bgcolor: light ? "rgba(255,255,255,0.08)" : a.bg,
        border: `1px solid ${light ? "rgba(255,255,255,0.18)" : a.border}`,
        backdropFilter: light ? "blur(10px)" : undefined,
        mb: 2,
      }}
    >
      <Box
        aria-hidden
        sx={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          bgcolor: light ? a.onDark : a.color,
          flexShrink: 0,
        }}
      />
      <Typography
        component="span"
        sx={{
          fontSize: "0.66rem",
          fontWeight: 700,
          letterSpacing: 1.6,
          textTransform: "uppercase",
          color: light ? a.onDark : a.color,
          lineHeight: 1,
        }}
      >
        {children}
      </Typography>
    </Stack>
  );
}

/**
 * Section heading block. `highlight` renders the trailing words in the brand
 * gradient so headings carry the logo colours without a flat colour fill.
 */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  subtitle,
  align = "left",
  light = false,
  tone = "blue",
  maxWidth = 620,
  sx,
}: {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  align?: "left" | "center";
  light?: boolean;
  tone?: AccentTone;
  maxWidth?: number;
  sx?: SxProps<Theme>;
}) {
  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={revealOnce}
      variants={stagger}
      sx={{
        textAlign: align,
        mb: { xs: 5, md: 7 },
        ...(align === "center" ? { mx: "auto", maxWidth: maxWidth + 60 } : {}),
        ...sx,
      }}
    >
      {eyebrow && (
        <Eyebrow light={light} tone={tone}>
          {eyebrow}
        </Eyebrow>
      )}
      <Typography
        component={motion.h2}
        variants={fadeUp}
        sx={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem" },
          color: light ? TEXT.onDark : INK[800],
          lineHeight: 1.06,
          letterSpacing: "-0.035em",
          mb: subtitle ? 2 : 0,
          textWrap: "balance",
        }}
      >
        {title}
        {highlight && (
          <>
            {" "}
            <Box
              component="span"
              sx={{
                background: light
                  ? `linear-gradient(120deg, ${GOLD.light}, ${BRAND.violet})`
                  : brandGradient,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                // Safari needs an explicit fallback if background-clip fails.
                WebkitTextFillColor: "transparent",
              }}
            >
              {highlight}
            </Box>
          </>
        )}
      </Typography>
      {subtitle && (
        <Typography
          component={motion.p}
          variants={fadeUp}
          sx={{
            color: light ? TEXT.onDarkMuted : TEXT.secondary,
            fontSize: { xs: "1rem", md: "1.075rem" },
            lineHeight: 1.7,
            maxWidth,
            mx: align === "center" ? "auto" : 0,
            textWrap: "pretty",
          }}
        >
          {subtitle}
        </Typography>
      )}
    </MotionBox>
  );
}

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

/**
 * Topic icon in a soft tinted well matching its own accent colour.
 * Scales and tilts when an ancestor with `.lift-group` is hovered.
 */
export function AccentIcon({
  icon,
  tone,
  size = 52,
  shape = "rounded",
  light = false,
}: {
  icon: React.ReactNode;
  tone: AccentTone;
  size?: number;
  shape?: "rounded" | "circle";
  light?: boolean;
}) {
  const a = accentStyles[tone];
  return (
    <Box
      aria-hidden
      sx={{
        width: size,
        height: size,
        borderRadius: shape === "circle" ? "50%" : `${size * 0.3}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: light ? a.bgDark : a.bg,
        color: light ? a.onDark : a.color,
        border: `1px solid ${a.border}`,
        boxShadow: light ? "none" : "inset 0 1px 0 rgba(255,255,255,0.6)",
        transition:
          "transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease",
        ".lift-group:hover &": {
          transform: "scale(1.09) rotate(-4deg)",
          boxShadow: a.glow,
        },
        "@media (prefers-reduced-motion: reduce)": {
          ".lift-group:hover &": { transform: "none" },
        },
      }}
    >
      {icon}
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Buttons                                                             */
/* ------------------------------------------------------------------ */

/**
 * Fill-transition sweep shared by the landing CTAs: a lighter panel wipes in
 * from the left on hover rather than a flat colour swap.
 */
const fillSweep = (from: string) =>
  ({
    position: "relative",
    overflow: "hidden",
    isolation: "isolate",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      zIndex: -1,
      background: from,
      transform: "translateX(-101%)",
      transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)",
    },
    "&:hover::before": { transform: "translateX(0)" },
    "@media (prefers-reduced-motion: reduce)": {
      "&::before": { transition: "none" },
    },
  }) as const;

export type LandingButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  target?: string;
  rel?: string;
  "aria-label"?: string;
  sx?: SxProps<Theme>;
};

const sizeSx = {
  sm: { px: 2.25, py: 0.85, fontSize: "0.74rem" },
  md: { px: 3, py: 1.2, fontSize: "0.84rem" },
  lg: { px: 3.75, py: 1.5, fontSize: "0.92rem" },
} as const;

/** Primary CTA — gold, with a lighter gold sweep on hover. */
export function GoldButton({
  children,
  size = "md",
  sx,
  ...rest
}: LandingButtonProps) {
  return (
    <Button
      {...rest}
      variant="contained"
      disableElevation
      sx={{
        bgcolor: GOLD.main,
        color: INK[900],
        borderRadius: 999,
        fontWeight: 700,
        textTransform: "none",
        letterSpacing: 0.1,
        boxShadow: SHADOW.glow,
        ...sizeSx[size],
        ...fillSweep(`linear-gradient(90deg, ${GOLD.light}, ${GOLD.main})`),
        "&:hover": { bgcolor: GOLD.main, boxShadow: SHADOW.glow },
        ...buttonLiftSx,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

/** Secondary CTA — brand gradient, for "explore" style actions. */
export function BrandButton({
  children,
  size = "md",
  sx,
  ...rest
}: LandingButtonProps) {
  return (
    <Button
      {...rest}
      variant="contained"
      disableElevation
      sx={{
        background: brandGradient,
        color: "#fff",
        borderRadius: 999,
        fontWeight: 700,
        textTransform: "none",
        boxShadow: SHADOW.brandGlow,
        ...sizeSx[size],
        ...fillSweep(`linear-gradient(90deg, ${BRAND.violet}, ${BRAND.blue})`),
        "&:hover": { boxShadow: SHADOW.brandGlow },
        ...buttonLiftSx,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

/** Tertiary CTA — glass outline that fills with ink tint on hover. */
export function GhostButton({
  children,
  size = "md",
  light = false,
  sx,
  ...rest
}: LandingButtonProps & { light?: boolean }) {
  return (
    <Button
      {...rest}
      variant="outlined"
      sx={{
        borderColor: light ? "rgba(255,255,255,0.35)" : "rgba(10,37,64,0.22)",
        color: light ? "#fff" : INK[800],
        bgcolor: light ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: 999,
        fontWeight: 700,
        textTransform: "none",
        ...sizeSx[size],
        "&:hover": {
          borderColor: light ? "rgba(255,255,255,0.6)" : BRAND.blue,
          bgcolor: light ? "rgba(255,255,255,0.12)" : "rgba(43,127,255,0.07)",
        },
        ...buttonLiftSx,
        ...sx,
      }}
    >
      {children}
    </Button>
  );
}

/**
 * Wraps a CTA so it drifts a few pixels toward the cursor — the "magnetic"
 * effect from the brief. Pointer-only (no-op on touch) and disabled under
 * reduced-motion.
 */
export function Magnetic({
  children,
  strength = 0.28,
  sx,
}: {
  children: React.ReactNode;
  strength?: number;
  sx?: SxProps<Theme>;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  const handleMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || event.pointerType !== "mouse" || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setOffset({
        x: (event.clientX - (rect.left + rect.width / 2)) * strength,
        y: (event.clientY - (rect.top + rect.height / 2)) * strength,
      });
    },
    [reduce, strength]
  );

  return (
    <MotionBox
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={offset}
      transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.4 }}
      sx={{ display: "inline-flex", ...sx }}
    >
      {children}
    </MotionBox>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee                                                             */
/* ------------------------------------------------------------------ */

/**
 * Infinite horizontal marquee. Children must already be duplicated by the
 * caller (render the list twice) so the -50% translate loops seamlessly.
 * Pauses on hover and on keyboard focus, and falls back to a static wrapped
 * row under reduced-motion.
 */
export function Marquee({
  children,
  duration = 60,
  reverse = false,
  fadeColor,
  fadeWidth = { xs: 40, md: 140 },
  sx,
}: {
  children: React.ReactNode;
  duration?: number;
  reverse?: boolean;
  fadeColor?: string;
  fadeWidth?: Record<string, number>;
  sx?: SxProps<Theme>;
}) {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        "&:hover .marquee-track, &:focus-within .marquee-track": {
          animationPlayState: "paused",
        },
        ...(fadeColor
          ? {
              "&::before, &::after": {
                content: '""',
                position: "absolute",
                top: 0,
                bottom: 0,
                width: fadeWidth,
                zIndex: 2,
                pointerEvents: "none",
              },
              "&::before": {
                left: 0,
                background: `linear-gradient(to right, ${fadeColor}, transparent)`,
              },
              "&::after": {
                right: 0,
                background: `linear-gradient(to left, ${fadeColor}, transparent)`,
              },
            }
          : {}),
        ...sx,
      }}
    >
      <Box
        className="marquee-track"
        sx={{
          display: "flex",
          alignItems: "stretch",
          width: "max-content",
          animation: `landingMarquee ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          "@keyframes landingMarquee": {
            from: { transform: "translate3d(0,0,0)" },
            to: { transform: "translate3d(-50%,0,0)" },
          },
          "@media (prefers-reduced-motion: reduce)": {
            animation: "none",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "center",
          },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

/** A motion.div preset for staggered children entering on scroll. */
export function Reveal({
  children,
  variants = fadeUp,
  className,
  sx,
}: {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  sx?: SxProps<Theme>;
}) {
  return (
    <MotionBox className={className} variants={variants} sx={sx}>
      {children}
    </MotionBox>
  );
}

/** Container that fades + staggers its `Reveal` children when scrolled into view. */
export function RevealGroup({
  children,
  amount = 0.15,
  variants = stagger,
  sx,
}: {
  children: React.ReactNode;
  amount?: number;
  variants?: Variants;
  sx?: SxProps<Theme>;
}) {
  return (
    <MotionBox
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      sx={sx}
    >
      {children}
    </MotionBox>
  );
}

export { fadeIn, fadeUp, EASE };

/** Split a stat string like "10+", "50 min", or "50분" into animatable parts. */
function parseStatValue(value: string) {
  const match = value.match(/^(\D*)(\d+(?:\.\d+)?)(.*)$/u);
  if (!match) return { prefix: "", number: 0, suffix: value };
  return {
    prefix: match[1],
    number: Number(match[2]),
    suffix: match[3],
  };
}

/** Counts up to a numeric stat when scrolled into view. */
export function CountUpStat({
  value,
  sx,
}: {
  value: string;
  sx?: SxProps<Theme>;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const { prefix, number, suffix } = React.useMemo(
    () => parseStatValue(value),
    [value]
  );
  const [display, setDisplay] = React.useState(reduce ? number : 0);

  React.useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setDisplay(number);
      return;
    }
    setDisplay(0);
    const controls = animate(0, number, {
      duration: 1.6,
      ease: EASE,
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduce, number]);

  return (
    <Typography ref={ref} component="span" sx={{ display: "block", ...sx }}>
      {prefix}
      {display}
      {suffix}
    </Typography>
  );
}
