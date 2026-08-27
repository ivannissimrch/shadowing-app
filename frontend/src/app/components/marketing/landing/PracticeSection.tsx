"use client";

/**
 * ANALYSIS — What You'll Practise
 *
 * Was working: a sequential flow with chevrons between steps, and a sensible
 * responsive collapse to a left-bordered list on small screens.
 *
 * Was weak:
 *  - it reused `hero.eyebrow` and `hero.subtitle` verbatim as its own eyebrow
 *    and subtitle. That made `hero.subtitle` the third of four appearances of
 *    the same sentence on one page.
 *  - the connector line animated once on entry rather than tracking scroll, so
 *    the brief's "progress-based reveal" was not actually implemented.
 *  - two of the four icons shared the same accent tone, so the row read as
 *    three colours for four steps.
 *
 * Plan: give the section its own copy, colour each of the four steps
 * differently, and drive the connector from `useScroll` so the rail fills and
 * the step chips light up as you move down the page. Under reduced motion the
 * rail is simply drawn full and all steps read as active.
 */

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FiHeadphones, FiMessageCircle, FiMic, FiRadio } from "react-icons/fi";

import { GrainOverlay, MeshBlob, SectionHeading, Shell } from "./primitives";
import {
  accentStyles,
  BRAND,
  brandGradient,
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

const STEPS: Array<{ key: string; icon: React.ReactNode; tone: AccentTone }> = [
  { key: "pronunciation", icon: <FiMic size={24} />, tone: "blue" },
  { key: "shadowing", icon: <FiRadio size={24} />, tone: "violet" },
  { key: "recording", icon: <FiHeadphones size={24} />, tone: "cyan" },
  { key: "feedback", icon: <FiMessageCircle size={24} />, tone: "coral" },
];

export default function PracticeSection() {
  const t = useTranslations("landing.features");
  const reduce = useReducedMotion();
  const sectionRef = React.useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(
    reduce ? STEPS.length : 0
  );

  // Progress across the step rail, tied to how far the section has scrolled.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 78%", "end 65%"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const railScale = useTransform(smooth, [0, 1], [0, 1]);
  const railHeight = useTransform(smooth, [0, 1], ["0%", "100%"]);

  useMotionValueEvent(smooth, "change", (value) => {
    if (reduce) return;
    // Light up a step once the rail has passed roughly its centre.
    setActiveIndex(
      Math.min(STEPS.length, Math.round(value * STEPS.length + 0.28))
    );
  });

  return (
    <Box
      id="practice"
      component="section"
      ref={sectionRef}
      sx={{
        position: "relative",
        overflow: "hidden",
        py: sectionPy,
        background: `linear-gradient(180deg, ${SURFACE.base} 0%, ${SURFACE.white} 50%, ${SURFACE.tinted} 100%)`,
      }}
    >
      <MeshBlob
        bottom="-10%"
        left="-8%"
        size={{ xs: 260, md: 420 }}
        color={`${BRAND.blue}1F`}
        delay={1.5}
      />
      <MeshBlob
        top="6%"
        right="-6%"
        size={{ xs: 220, md: 360 }}
        color={`${GOLD.main}1A`}
        delay={3.5}
      />
      <GrainOverlay opacity={0.025} />

      <Shell>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("titleHighlight")}
          subtitle={t("subtitle")}
          align="center"
          tone="cyan"
        />

        {/* Desktop — horizontal rail */}
        <Box
          sx={{
            display: { xs: "none", lg: "block" },
            position: "relative",
            pt: 2,
          }}
        >
          {/* Track */}
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              top: 34,
              left: "12.5%",
              right: "12.5%",
              height: 3,
              borderRadius: 999,
              bgcolor: "rgba(10,37,64,0.07)",
              zIndex: 0,
            }}
          />
          {/* Scroll-driven fill */}
          <MotionBox
            aria-hidden
            style={reduce ? undefined : { scaleX: railScale }}
            sx={{
              position: "absolute",
              top: 34,
              left: "12.5%",
              right: "12.5%",
              height: 3,
              borderRadius: 999,
              background: brandGradient,
              transformOrigin: "0% 50%",
              zIndex: 1,
              ...(reduce ? { transform: "scaleX(1)" } : {}),
            }}
          />

          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={stagger}
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 3,
              position: "relative",
              zIndex: 2,
            }}
          >
            {STEPS.map((step, index) => {
              const a = accentStyles[step.tone];
              const isActive = index < activeIndex;
              return (
                <MotionBox
                  key={step.key}
                  className="lift-group"
                  variants={fadeUp}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* Chip sits on the rail and colours in as progress passes */}
                  <Box
                    sx={{
                      width: 68,
                      height: 68,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      mb: 3,
                      bgcolor: isActive ? a.color : "#fff",
                      color: isActive ? "#fff" : a.color,
                      border: `2px solid ${isActive ? a.color : "rgba(10,37,64,0.1)"}`,
                      boxShadow: isActive ? a.glow : SHADOW.soft,
                      transition:
                        "background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease, box-shadow 0.5s ease",
                    }}
                  >
                    {step.icon}
                  </Box>

                  <Box
                    sx={{
                      ...glassLight,
                      borderRadius: 3.5,
                      p: 3,
                      textAlign: "center",
                      width: "100%",
                      flexGrow: 1,
                      opacity: isActive ? 1 : 0.62,
                      ...hoverLiftSx,
                      transition: `${hoverLiftSx.transition}, opacity 0.5s ease`,
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: 1.6,
                        textTransform: "uppercase",
                        color: a.color,
                        mb: 1,
                      }}
                    >
                      {t("stepLabel")} {index + 1}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 700,
                        fontSize: "1.08rem",
                        color: INK[800],
                        lineHeight: 1.3,
                        mb: 1.25,
                      }}
                    >
                      {t(`${step.key}.title`)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.86rem",
                        color: TEXT.secondary,
                        lineHeight: 1.65,
                      }}
                    >
                      {t(`${step.key}.description`)}
                    </Typography>
                  </Box>
                </MotionBox>
              );
            })}
          </MotionBox>
        </Box>

        {/* Mobile / tablet — vertical rail */}
        <Box
          sx={{
            display: { xs: "block", lg: "none" },
            position: "relative",
            pl: { xs: 0.5, sm: 2 },
          }}
        >
          <Box
            aria-hidden
            sx={{
              position: "absolute",
              left: 33,
              top: 24,
              bottom: 24,
              width: 3,
              borderRadius: 999,
              bgcolor: "rgba(10,37,64,0.07)",
            }}
          />
          <MotionBox
            aria-hidden
            style={reduce ? undefined : { height: railHeight }}
            sx={{
              position: "absolute",
              left: 33,
              top: 24,
              width: 3,
              borderRadius: 999,
              background: brandGradient,
              ...(reduce ? { bottom: 24 } : {}),
            }}
          />

          <MotionBox
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
              position: "relative",
            }}
          >
            {STEPS.map((step, index) => {
              const a = accentStyles[step.tone];
              const isActive = index < activeIndex;
              return (
                <MotionBox
                  key={step.key}
                  className="lift-group"
                  variants={fadeUp}
                  sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}
                >
                  <Box
                    sx={{
                      width: 54,
                      height: 54,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      bgcolor: isActive ? a.color : "#fff",
                      color: isActive ? "#fff" : a.color,
                      border: `2px solid ${isActive ? a.color : "rgba(10,37,64,0.1)"}`,
                      boxShadow: isActive ? a.glow : SHADOW.soft,
                      transition: "all 0.5s ease",
                      zIndex: 1,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Box
                    sx={{
                      ...glassLight,
                      borderRadius: 3,
                      p: 2.5,
                      flexGrow: 1,
                      minWidth: 0,
                      opacity: isActive ? 1 : 0.7,
                      ...hoverLiftSx,
                      transition: `${hoverLiftSx.transition}, opacity 0.5s ease`,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="baseline"
                      sx={{ mb: 0.75 }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.6rem",
                          fontWeight: 800,
                          letterSpacing: 1.4,
                          textTransform: "uppercase",
                          color: a.color,
                        }}
                      >
                        {t("stepLabel")} {index + 1}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 700,
                        fontSize: "1.02rem",
                        color: INK[800],
                        lineHeight: 1.3,
                        mb: 0.75,
                      }}
                    >
                      {t(`${step.key}.title`)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.85rem",
                        color: TEXT.secondary,
                        lineHeight: 1.65,
                      }}
                    >
                      {t(`${step.key}.description`)}
                    </Typography>
                  </Box>
                </MotionBox>
              );
            })}
          </MotionBox>
        </Box>
      </Shell>
    </Box>
  );
}
