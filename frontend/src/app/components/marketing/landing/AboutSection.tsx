"use client";

/**
 * ANALYSIS — Meet Lyn
 *
 * Was working: the organic blob backdrop behind the portrait was a nice break
 * from the rounded rectangles everywhere else on the page.
 *
 * Was weak — and this was the biggest content problem on the page:
 *  - `about.body` was never rendered. Neither was `about.pullQuote` nor
 *    `about.testimonialQuote`. A section titled "Meet Lyn" contained no
 *    information about Lyn at all.
 *  - what it *did* contain were four "step" cards whose text duplicated
 *    `features.*` word for word — the same four items already shown in What
 *    You'll Practise, making that their third appearance on the page.
 *  - those cards used a fragile tab-and-pointer construction: absolutely
 *    positioned CSS triangles, four variant maps, and hardcoded order values.
 *
 * Plan: make this an actual bio. Portrait on the left with credential chips
 * floating over it in glass; the rewritten first-person bio on the right with
 * the pull quote given real weight; specialties as individually-coloured chips.
 * The "From learner to coach" timeline (previously its own near-identical
 * numbered-steps section) is folded in here as a compact vertical rail, which
 * is where biography content belongs and removes a whole duplicate section.
 */

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  FiArrowRight,
  FiAward,
  FiBriefcase,
  FiGlobe,
  FiHeadphones,
  FiMapPin,
  FiMic,
  FiTarget,
  FiZap,
} from "react-icons/fi";

import { mailto } from "./links";
import {
  Eyebrow,
  GoldButton,
  GrainOverlay,
  Magnetic,
  MeshBlob,
  Shell,
} from "./primitives";
import {
  accentStyles,
  BRAND,
  brandGradient,
  displayFont,
  fadeUp,
  glassLight,
  GOLD,
  INK,
  SHADOW,
  slideIn,
  stagger,
  SURFACE,
  TEXT,
  sectionPy,
  type AccentTone,
} from "./tokens";

const MotionBox = motion.create(Box);

const SPECIALTIES: Array<{
  key: string;
  icon: React.ReactNode;
  tone: AccentTone;
}> = [
  { key: "specialty1", icon: <FiMic size={14} />, tone: "blue" },
  { key: "specialty2", icon: <FiTarget size={14} />, tone: "violet" },
  { key: "specialty3", icon: <FiHeadphones size={14} />, tone: "cyan" },
  { key: "specialty4", icon: <FiGlobe size={14} />, tone: "coral" },
  { key: "specialty5", icon: <FiAward size={14} />, tone: "gold" },
  { key: "specialty6", icon: <FiBriefcase size={14} />, tone: "emerald" },
];

const JOURNEY_TONES: AccentTone[] = ["blue", "violet", "cyan", "coral", "gold"];

export default function AboutSection() {
  const t = useTranslations("landing.about");
  const tJourney = useTranslations("landing.journey");
  const reduce = useReducedMotion();

  const credentials = [
    { key: "credential1", icon: <FiAward size={14} /> },
    { key: "credential2", icon: <FiZap size={14} /> },
    { key: "credential3", icon: <FiMapPin size={14} /> },
  ];

  return (
    <Box
      id="about"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: sectionPy,
        background: `linear-gradient(180deg, ${SURFACE.white} 0%, ${SURFACE.base} 55%, ${SURFACE.tinted} 100%)`,
      }}
    >
      <MeshBlob
        top="12%"
        right="-8%"
        size={{ xs: 280, md: 480 }}
        color={`${BRAND.blue}1F`}
        delay={1}
      />
      <MeshBlob
        bottom="-10%"
        left="-8%"
        size={{ xs: 240, md: 400 }}
        color={`${GOLD.main}1A`}
        delay={3}
      />
      <GrainOverlay opacity={0.025} />

      <Shell>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "0.92fr 1.08fr" },
            gap: { xs: 6, lg: 8 },
            alignItems: "center",
          }}
        >
          {/* Portrait with floating glass credentials */}
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={slideIn(true)}
            sx={{ position: "relative" }}
          >
            <Box
              aria-hidden
              sx={{
                position: "absolute",
                top: { xs: -18, md: -28 },
                left: { xs: -18, md: -28 },
                width: "78%",
                height: "88%",
                borderRadius: "42% 58% 55% 45% / 52% 42% 58% 48%",
                background: brandGradient,
                opacity: 0.14,
                zIndex: 0,
              }}
            />
            <MotionBox
              whileHover={reduce ? undefined : { scale: 1.012 }}
              transition={{ type: "spring", stiffness: 280, damping: 24 }}
              sx={{
                position: "relative",
                zIndex: 1,
                borderRadius: 5,
                overflow: "hidden",
                aspectRatio: "4 / 5",
                minHeight: { xs: 380, md: 480 },
                boxShadow: SHADOW.lift,
                border: "1px solid rgba(255,255,255,0.9)",
              }}
            >
              <Image
                src="/images/landing-page-2.jpg"
                alt={t("title")}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${INK[900]}CC 0%, transparent 48%)`,
                }}
              />
              {/* Credential chips float over the photo — glass doing real work. */}
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                sx={{
                  position: "absolute",
                  left: 20,
                  right: 20,
                  bottom: 20,
                  zIndex: 2,
                }}
              >
                {credentials.map((c) => (
                  <Stack
                    key={c.key}
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{
                      px: 1.4,
                      py: 0.7,
                      borderRadius: 999,
                      bgcolor: "rgba(255,255,255,0.14)",
                      backdropFilter: "blur(14px) saturate(180%)",
                      WebkitBackdropFilter: "blur(14px) saturate(180%)",
                      border: "1px solid rgba(255,255,255,0.24)",
                      color: "#fff",
                    }}
                  >
                    <Box
                      sx={{
                        color: GOLD.main,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {c.icon}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t(c.key)}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </MotionBox>
          </MotionBox>

          {/* The bio that was previously never rendered */}
          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
          >
            <Eyebrow tone="gold">{t("eyebrow")}</Eyebrow>

            <Typography
              component={motion.h2}
              variants={fadeUp}
              sx={{
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: { xs: "2.1rem", md: "3rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.035em",
                color: INK[800],
                mb: 2,
              }}
            >
              {t("title")}{" "}
              <Box
                component="span"
                sx={{
                  background: brandGradient,
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
                fontSize: { xs: "1.05rem", md: "1.15rem" },
                fontWeight: 500,
                lineHeight: 1.6,
                color: INK[700],
                mb: 3,
              }}
            >
              {t("lead")}
            </Typography>

            <Typography
              component={motion.p}
              variants={fadeUp}
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: TEXT.secondary,
                mb: 2.5,
              }}
            >
              {t("body1")}
            </Typography>
            <Typography
              component={motion.p}
              variants={fadeUp}
              sx={{
                fontSize: "0.95rem",
                lineHeight: 1.85,
                color: TEXT.secondary,
                mb: 4,
              }}
            >
              {t("body2")}
            </Typography>

            {/* Pull quote — also previously unrendered */}
            <MotionBox
              variants={fadeUp}
              sx={{
                position: "relative",
                ...glassLight,
                borderRadius: 4,
                borderLeft: `4px solid ${GOLD.main}`,
                p: { xs: 2.5, md: 3 },
                mb: 4,
              }}
            >
              <Typography
                aria-hidden
                sx={{
                  fontFamily: displayFont,
                  fontSize: "2.75rem",
                  lineHeight: 0.7,
                  color: GOLD.main,
                  opacity: 0.55,
                  mb: 1,
                }}
              >
                &ldquo;
              </Typography>
              <Typography
                sx={{
                  fontFamily: displayFont,
                  fontSize: { xs: "1.05rem", md: "1.18rem" },
                  fontWeight: 600,
                  fontStyle: "italic",
                  lineHeight: 1.6,
                  color: INK[800],
                }}
              >
                {t("pullQuote")}
              </Typography>
            </MotionBox>

            <MotionBox variants={fadeUp} sx={{ mb: 4 }}>
              <Typography
                sx={{
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: TEXT.muted,
                  mb: 1.75,
                }}
              >
                {t("specialtiesLabel")}
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                rowGap={1.25}
                flexWrap="wrap"
                useFlexGap
              >
                {SPECIALTIES.map((s) => {
                  const a = accentStyles[s.tone];
                  return (
                    <Stack
                      key={s.key}
                      direction="row"
                      spacing={0.85}
                      alignItems="center"
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 999,
                        bgcolor: a.bg,
                        border: `1px solid ${a.border}`,
                        color: a.color,
                        transition:
                          "transform 0.25s ease, box-shadow 0.25s ease",
                        "@media (prefers-reduced-motion: no-preference)": {
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: a.glow,
                          },
                        },
                      }}
                    >
                      {s.icon}
                      <Typography sx={{ fontSize: "0.78rem", fontWeight: 700 }}>
                        {t(s.key)}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </MotionBox>

            <MotionBox variants={fadeUp}>
              <Magnetic>
                <GoldButton
                  href={mailto(t("cta"))}
                  endIcon={<FiArrowRight size={16} />}
                >
                  {t("cta")}
                </GoldButton>
              </Magnetic>
            </MotionBox>
          </MotionBox>
        </Box>

        {/* Timeline, folded in from what used to be its own separate section */}
        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={stagger}
          sx={{ mt: { xs: 8, md: 12 } }}
        >
          <MotionBox
            variants={fadeUp}
            sx={{ mb: { xs: 4, md: 5 }, maxWidth: 560 }}
          >
            <Eyebrow tone="blue">{tJourney("eyebrow")}</Eyebrow>
            <Typography
              sx={{
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: { xs: "1.7rem", md: "2.2rem" },
                lineHeight: 1.1,
                letterSpacing: "-0.03em",
                color: INK[800],
                mb: 1.5,
              }}
            >
              {tJourney("title")}{" "}
              <Box
                component="span"
                sx={{
                  background: brandGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                }}
              >
                {tJourney("titleHighlight")}
              </Box>
            </Typography>
            <Typography
              sx={{
                fontSize: "0.95rem",
                color: TEXT.secondary,
                lineHeight: 1.7,
              }}
            >
              {tJourney("subtitle")}
            </Typography>
          </MotionBox>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: { xs: 2, md: 2.5 },
            }}
          >
            {[1, 2, 3, 4, 5].map((n, index) => {
              const a = accentStyles[JOURNEY_TONES[index]];
              return (
                <MotionBox
                  key={n}
                  className="lift-group"
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  sx={{
                    position: "relative",
                    p: 2.5,
                    borderRadius: 3.5,
                    ...glassLight,
                    boxShadow: SHADOW.soft,
                    // Staircase on wide screens so the row is not a flat rank.
                    mt: { lg: `${index * 14}px` },
                    transition: "box-shadow 0.35s ease, transform 0.35s ease",
                    "&:hover": { boxShadow: SHADOW.medium },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.25}
                    alignItems="center"
                    sx={{ mb: 1.75 }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        fontSize: "0.74rem",
                        fontWeight: 800,
                        color: "#fff",
                        bgcolor: a.color,
                      }}
                    >
                      {n}
                    </Box>
                    <Box
                      aria-hidden
                      sx={{
                        flexGrow: 1,
                        height: 2,
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${a.color}, transparent)`,
                        opacity: 0.4,
                      }}
                    />
                  </Stack>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      color: INK[800],
                      lineHeight: 1.3,
                      mb: 0.75,
                    }}
                  >
                    {tJourney(`step${n}.title`)}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.82rem",
                      color: TEXT.secondary,
                      lineHeight: 1.6,
                    }}
                  >
                    {tJourney(`step${n}.description`)}
                  </Typography>
                </MotionBox>
              );
            })}
          </Box>
        </MotionBox>
      </Shell>
    </Box>
  );
}
