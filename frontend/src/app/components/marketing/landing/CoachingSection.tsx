"use client";

/**
 * ANALYSIS — 1-on-1 Coaching Packages
 *
 * Was working: a distinct background tint and diagonal texture separated it from
 * the section above, and the cancellation policy was surfaced honestly.
 *
 * Was weak:
 *  - it rendered the *same* `PricingPackageCard` in the *same* three-column grid
 *    as Lyn's Courses, immediately above it. Back-to-back identical patterns.
 *  - a real bug: `features={[t(...description)]}` meant each card printed its
 *    description twice — once as the subtitle and again as its only bullet.
 *  - "4 classes" was squeezed in as a price suffix, competing with the price
 *    itself instead of reading as what you get.
 *
 * Plan: drop the card grid entirely. This becomes a dark split: a sticky pitch
 * panel on the left explaining what live coaching actually is, and three stacked
 * comparison rows on the right — tier, sessions, what's inside, price — with the
 * middle tier raised. Each tier now has its own three benefits, so nothing is
 * printed twice.
 */

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  FiArrowRight,
  FiCheck,
  FiClock,
  FiInfo,
  FiMessageSquare,
  FiTarget,
  FiUser,
} from "react-icons/fi";

import { mailto } from "./links";
import { GoldButton, GrainOverlay, MeshBlob, Shell } from "./primitives";
import {
  accentStyles,
  BRAND,
  displayFont,
  fadeUp,
  glassDark,
  GOLD,
  INK,
  SHADOW,
  slideIn,
  stagger,
  sectionPy,
  type AccentTone,
} from "./tokens";

const MotionBox = motion.create(Box);

type TierKey = "starter" | "intermediate" | "advanced";

const TIERS: Array<{ key: TierKey; tone: AccentTone; featured?: boolean }> = [
  { key: "starter", tone: "cyan" },
  { key: "intermediate", tone: "gold", featured: true },
  { key: "advanced", tone: "violet" },
];

const PITCH_POINTS = [
  { key: "pitchPoint1", icon: <FiClock size={16} /> },
  { key: "pitchPoint2", icon: <FiTarget size={16} /> },
  { key: "pitchPoint3", icon: <FiMessageSquare size={16} /> },
] as const;

export default function CoachingSection() {
  const t = useTranslations("landing.coachingPackages");
  const reduce = useReducedMotion();

  return (
    <Box
      id="coaching"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: sectionPy,
        color: "#fff",
        background: `linear-gradient(165deg, ${INK[900]} 0%, ${INK[800]} 45%, ${INK[700]} 100%)`,
      }}
    >
      <MeshBlob
        top="-10%"
        left="-6%"
        size={{ xs: 300, md: 520 }}
        color={`${BRAND.blue}33`}
      />
      <MeshBlob
        bottom="-12%"
        right="-8%"
        size={{ xs: 280, md: 460 }}
        color={`${BRAND.violet}30`}
        delay={2.5}
      />
      <GrainOverlay opacity={0.05} />

      <Shell>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "0.85fr 1.15fr" },
            gap: { xs: 5, lg: 8 },
            alignItems: "start",
          }}
        >
          {/* Pitch panel — sticks while the tiers scroll past on desktop */}
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            sx={{ position: { lg: "sticky" }, top: { lg: 140 } }}
          >
            <MotionBox variants={fadeUp}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{
                  display: "inline-flex",
                  px: 1.5,
                  py: 0.6,
                  mb: 2.5,
                  borderRadius: 999,
                  bgcolor: "rgba(245,166,35,0.12)",
                  border: `1px solid rgba(245,166,35,0.3)`,
                }}
              >
                <FiUser size={12} color={GOLD.main} />
                <Typography
                  sx={{
                    fontSize: "0.66rem",
                    fontWeight: 700,
                    letterSpacing: 1.5,
                    textTransform: "uppercase",
                    color: GOLD.main,
                  }}
                >
                  {t("eyebrow")}
                </Typography>
              </Stack>
            </MotionBox>

            <Typography
              component={motion.h2}
              variants={fadeUp}
              sx={{
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: { xs: "2rem", md: "2.9rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                mb: 2,
              }}
            >
              {t("title")}{" "}
              <Box
                component="span"
                sx={{
                  background: `linear-gradient(120deg, ${GOLD.light}, ${BRAND.violet})`,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {t("titleHighlight")}
              </Box>
            </Typography>

            <Typography
              component={motion.p}
              variants={fadeUp}
              sx={{
                fontSize: { xs: "1rem", md: "1.05rem" },
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.72)",
                mb: 4,
                maxWidth: 460,
              }}
            >
              {t("subtitle")}
            </Typography>

            <MotionBox
              variants={fadeUp}
              sx={{ ...glassDark, borderRadius: 3.5, p: { xs: 2.5, md: 3 } }}
            >
              <Typography
                sx={{
                  fontFamily: displayFont,
                  fontWeight: 700,
                  fontSize: "1.05rem",
                  lineHeight: 1.35,
                  mb: 1.25,
                }}
              >
                {t("pitchTitle")}
              </Typography>
              <Typography
                sx={{
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  color: "rgba(255,255,255,0.68)",
                  mb: 2.5,
                }}
              >
                {t("pitchBody")}
              </Typography>
              <Stack spacing={1.5}>
                {PITCH_POINTS.map((point) => (
                  <Stack
                    key={point.key}
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        color: GOLD.main,
                        bgcolor: "rgba(245,166,35,0.14)",
                        border: "1px solid rgba(245,166,35,0.26)",
                      }}
                    >
                      {point.icon}
                    </Box>
                    <Typography sx={{ fontSize: "0.88rem", fontWeight: 600 }}>
                      {t(point.key)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </MotionBox>

            <Stack
              component={motion.div}
              variants={fadeUp}
              direction="row"
              spacing={1.25}
              alignItems="flex-start"
              sx={{ mt: 3, maxWidth: 460 }}
            >
              <Box
                sx={{
                  color: "rgba(255,255,255,0.4)",
                  mt: "2px",
                  flexShrink: 0,
                }}
              >
                <FiInfo size={14} />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.76rem",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {t("cancellationNote")}
              </Typography>
            </Stack>
          </MotionBox>

          {/* Tier rail */}
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {TIERS.map(({ key, tone, featured }, index) => {
              const a = accentStyles[tone];
              return (
                <MotionBox
                  key={key}
                  className="lift-group"
                  variants={slideIn(false)}
                  whileHover={reduce ? undefined : { x: 6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  sx={{
                    position: "relative",
                    borderRadius: 4,
                    p: { xs: 2.5, md: 3.5 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "auto 1fr auto" },
                    gap: { xs: 2.5, md: 3.5 },
                    alignItems: { md: "center" },
                    ...glassDark,
                    ...(featured
                      ? {
                          bgcolor: "rgba(245,166,35,0.07)",
                          border: `1px solid rgba(245,166,35,0.34)`,
                          boxShadow: `${SHADOW.onDark}, 0 0 0 1px rgba(245,166,35,0.1)`,
                        }
                      : {}),
                    transition:
                      "border-color 0.35s ease, background-color 0.35s ease",
                    "&:hover": {
                      borderColor: featured
                        ? "rgba(245,166,35,0.55)"
                        : "rgba(255,255,255,0.26)",
                    },
                  }}
                >
                  {featured && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: -10,
                        right: { xs: 16, md: 28 },
                        px: 1.4,
                        py: 0.4,
                        borderRadius: 999,
                        bgcolor: GOLD.main,
                        color: INK[900],
                        fontSize: "0.6rem",
                        fontWeight: 800,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                      }}
                    >
                      {t("popularBadge")}
                    </Box>
                  )}

                  {/* Sessions badge — its own column, no longer a price suffix */}
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      width: { xs: 76, md: 88 },
                      height: { xs: 76, md: 88 },
                      borderRadius: 3,
                      flexShrink: 0,
                      bgcolor: a.bgDark,
                      border: `1px solid ${a.border}`,
                      color: a.onDark,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 800,
                        fontSize: { xs: "1.75rem", md: "2rem" },
                        lineHeight: 1,
                        letterSpacing: "-0.03em",
                      }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.6rem",
                        fontWeight: 700,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        opacity: 0.8,
                        mt: 0.5,
                        textAlign: "center",
                        px: 0.5,
                      }}
                    >
                      {t(`${key}.sessions`)}
                    </Typography>
                  </Stack>

                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 700,
                        fontSize: { xs: "1.15rem", md: "1.3rem" },
                        lineHeight: 1.25,
                        mb: 1,
                      }}
                    >
                      {t(`${key}.title`)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.88rem",
                        lineHeight: 1.65,
                        color: "rgba(255,255,255,0.66)",
                        mb: 2,
                      }}
                    >
                      {t(`${key}.description`)}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={0}
                      rowGap={1}
                      columnGap={2.5}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {[1, 2, 3].map((n) => (
                        <Stack
                          key={n}
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                        >
                          <FiCheck size={12} color={a.onDark} strokeWidth={3} />
                          <Typography
                            sx={{
                              fontSize: "0.78rem",
                              color: "rgba(255,255,255,0.78)",
                            }}
                          >
                            {t(`${key}.benefit${n}`)}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>

                  <Stack
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", md: "flex-end" }}
                    sx={{ flexShrink: 0 }}
                  >
                    <Box sx={{ textAlign: { md: "right" } }}>
                      <Typography
                        sx={{
                          fontFamily: displayFont,
                          fontWeight: 800,
                          fontSize: { xs: "2rem", md: "2.35rem" },
                          lineHeight: 1,
                          letterSpacing: "-0.04em",
                          color: featured ? GOLD.main : "#fff",
                        }}
                      >
                        {t(`${key}.price`)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.74rem",
                          color: "rgba(255,255,255,0.5)",
                          mt: 0.5,
                        }}
                      >
                        {t(`${key}.sessions`)}
                      </Typography>
                    </Box>
                    <GoldButton
                      size="sm"
                      href={mailto(t(`${key}.title`))}
                      endIcon={<FiArrowRight size={14} />}
                      sx={
                        featured
                          ? undefined
                          : {
                              bgcolor: "transparent",
                              color: "#fff",
                              border: "1px solid rgba(255,255,255,0.3)",
                              boxShadow: "none",
                              "&::before": {
                                background: "rgba(255,255,255,0.12)",
                              },
                              "&:hover": {
                                bgcolor: "transparent",
                                boxShadow: "none",
                              },
                            }
                      }
                    >
                      {t("signUpCta")}
                    </GoldButton>
                  </Stack>
                </MotionBox>
              );
            })}
          </MotionBox>
        </Box>
      </Shell>
    </Box>
  );
}
