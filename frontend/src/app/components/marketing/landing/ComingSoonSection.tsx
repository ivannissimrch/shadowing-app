"use client";

/**
 * ANALYSIS — Coming Soon
 *
 * Was working: the dark treatment set it apart, and the shimmer plus staggered
 * card offsets gave it more life than a plain grid.
 *
 * Was weak:
 *  - each card showed a progress bar filled to `55 + index * 12` percent. That
 *    is a made-up number presented as real launch progress. Removed rather than
 *    restyled — it implies a commitment that is not being tracked anywhere.
 *  - the same padlock icon was repeated on all three cards, so the only visual
 *    difference between them was the text.
 *  - the section was otherwise text-only, with nothing to look at.
 *  - it sat directly after another dark section, so the page went dark-on-dark.
 *
 * Plan: this is the second Spline moment. Flip the section to light so the page
 * alternates tone, put the 3D accent (or the soundwave fallback) behind the
 * cards, and float genuinely frosted glass tiles over it — the one place on the
 * page where glassmorphism is doing its actual job of layering over artwork.
 * Each course keeps its own icon and accent, and the padlock is replaced by an
 * honest "tell Lyn you want this" mailto.
 */

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  FiActivity,
  FiArrowUpRight,
  FiClock,
  FiLayers,
  FiMic,
} from "react-icons/fi";

import SplineAccent, { SPLINE_SCENES } from "./SplineAccent";
import { mailto } from "./links";
import {
  AccentIcon,
  GrainOverlay,
  MeshBlob,
  SectionHeading,
  Shell,
} from "./primitives";
import {
  accentStyles,
  BRAND,
  displayFont,
  fadeUp,
  glassLight,
  GOLD,
  hoverLiftSx,
  INK,
  SHADOW,
  stagger,
  SURFACE,
  TEXT,
  sectionPy,
  type AccentTone,
} from "./tokens";

const MotionBox = motion.create(Box);

const MINI: Array<{
  key: string;
  icon: React.ReactNode;
  tone: AccentTone;
  offset: number;
}> = [
  {
    key: "vowelsConsonants",
    icon: <FiMic size={22} />,
    tone: "violet",
    offset: 0,
  },
  { key: "ipaSymbols", icon: <FiLayers size={22} />, tone: "cyan", offset: 42 },
  {
    key: "diphthongsTriphthongs",
    icon: <FiActivity size={22} />,
    tone: "coral",
    offset: 16,
  },
];

export default function ComingSoonSection() {
  const t = useTranslations("landing.miniCourses");
  const reduce = useReducedMotion();

  return (
    <Box
      id="soon"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: sectionPy,
        background: `linear-gradient(170deg, ${SURFACE.tinted} 0%, #E7EEF9 40%, ${SURFACE.base} 100%)`,
      }}
    >
      {/* The 3D accent sits behind the glass, which is the point of the glass. */}
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: { xs: "auto", md: "50%" },
          bottom: { xs: -80, md: "auto" },
          right: { xs: "-30%", md: "-8%" },
          transform: { md: "translateY(-50%)" },
          zIndex: 0,
          opacity: { xs: 0.5, md: 0.85 },
          pointerEvents: "none",
        }}
      >
        <SplineAccent
          scene={SPLINE_SCENES.comingSoon}
          fallbackSize={520}
          fallbackVariant="light"
          fallbackSpeed={0.6}
          sx={{
            width: { xs: 380, md: 520 },
            height: { xs: 380, md: 520 },
          }}
        />
      </Box>

      <MeshBlob
        top="-8%"
        left="-6%"
        size={{ xs: 280, md: 460 }}
        color={`${BRAND.violet}24`}
      />
      <MeshBlob
        bottom="-14%"
        left="24%"
        size={{ xs: 240, md: 380 }}
        color={`${GOLD.main}1C`}
        delay={2}
      />
      <GrainOverlay opacity={0.03} />

      <Shell>
        <Box sx={{ maxWidth: 620 }}>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            highlight={t("titleHighlight")}
            subtitle={t("subtitle")}
            tone="violet"
          />
        </Box>

        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={stagger}
          sx={{
            display: "flex",
            gap: { xs: 2, md: 3 },
            overflowX: { xs: "auto", md: "visible" },
            scrollSnapType: { xs: "x mandatory", md: "none" },
            alignItems: { md: "flex-start" },
            pb: { xs: 2, md: 0 },
            mx: { xs: -2.5, md: 0 },
            px: { xs: 2.5, md: 0 },
            // Hide the scrollbar on the mobile snap rail without disabling it.
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {MINI.map((item) => {
            const a = accentStyles[item.tone];
            return (
              <MotionBox
                key={item.key}
                className="lift-group"
                variants={fadeUp}
                whileHover={reduce ? undefined : { y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                sx={{
                  flex: { xs: "0 0 82%", sm: "0 0 320px", md: "1 1 0" },
                  minWidth: { md: 0 },
                  scrollSnapAlign: { xs: "center", md: "none" },
                  mt: { xs: 0, md: `${item.offset}px` },
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  p: { xs: 3, md: 3.5 },
                  display: "flex",
                  flexDirection: "column",
                  // Heavier frost than elsewhere — it has real artwork to sit on.
                  ...glassLight,
                  bgcolor: "rgba(255,255,255,0.62)",
                  backdropFilter: "blur(26px) saturate(190%)",
                  WebkitBackdropFilter: "blur(26px) saturate(190%)",
                  boxShadow: SHADOW.medium,
                  ...hoverLiftSx,
                  "&:hover": { boxShadow: SHADOW.lift },
                }}
              >
                {/* Shimmer sweep — kept, it reads as "not ready yet". */}
                <Box
                  aria-hidden
                  sx={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    background:
                      "linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)",
                    backgroundSize: "220% 100%",
                    animation: "comingSoonShimmer 5s ease-in-out infinite",
                    "@keyframes comingSoonShimmer": {
                      "0%": { backgroundPosition: "220% 0" },
                      "100%": { backgroundPosition: "-220% 0" },
                    },
                    "@media (prefers-reduced-motion: reduce)": {
                      animation: "none",
                      opacity: 0,
                    },
                  }}
                />

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ position: "relative", zIndex: 1, mb: 2.5 }}
                >
                  <AccentIcon icon={item.icon} tone={item.tone} size={46} />
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{
                      px: 1.25,
                      py: 0.5,
                      borderRadius: 999,
                      bgcolor: a.bg,
                      border: `1px solid ${a.border}`,
                      color: a.color,
                    }}
                  >
                    <FiClock size={11} />
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      {t("comingSoon")}
                    </Typography>
                  </Stack>
                </Stack>

                <Box sx={{ position: "relative", zIndex: 1, flexGrow: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: displayFont,
                      fontWeight: 700,
                      fontSize: "1.2rem",
                      color: INK[800],
                      lineHeight: 1.25,
                      mb: 1.25,
                    }}
                  >
                    {t(`${item.key}.title`)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.88rem",
                      color: TEXT.secondary,
                      lineHeight: 1.7,
                      mb: 2.5,
                    }}
                  >
                    {t(`${item.key}.description`)}
                  </Typography>
                </Box>

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  spacing={2}
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    pt: 2,
                    borderTop: `1px solid ${a.border}`,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: displayFont,
                      fontWeight: 800,
                      fontSize: "1.5rem",
                      letterSpacing: "-0.03em",
                      color: a.color,
                      lineHeight: 1,
                    }}
                  >
                    {t(`${item.key}.price`)}
                  </Typography>
                  <Stack
                    component="a"
                    href={mailto(
                      `${t("notifyCta")} — ${t(`${item.key}.title`)}`
                    )}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{
                      color: a.color,
                      textDecoration: "none",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      transition: "gap 0.25s ease, opacity 0.25s ease",
                      "&:hover": { opacity: 0.75 },
                      "&:focus-visible": {
                        outline: `2px solid ${a.color}`,
                        outlineOffset: 3,
                      },
                    }}
                  >
                    <Box component="span" sx={{ textAlign: "right" }}>
                      {t("notifyCta")}
                    </Box>
                    <FiArrowUpRight size={15} />
                  </Stack>
                </Stack>
              </MotionBox>
            );
          })}
        </MotionBox>
      </Shell>
    </Box>
  );
}
