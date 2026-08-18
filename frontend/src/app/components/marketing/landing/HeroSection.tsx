"use client";

/**
 * HERO — rebuilt to the approved reference composition.
 *
 * Layout: two columns on a near-white canvas washed with soft blue/lavender
 * gradients. Left = badge, two-line headline (second line in the brand
 * gradient), supporting paragraph, two pill CTAs, and a small social-proof row.
 * Right = the portrait inside a layered circular frame: soft glow, concentric
 * rings, a slow dotted orbit, and a radial waveform that echoes the logo, with
 * two floating glass cards. A translucent four-stat panel closes the section.
 *
 * All copy and figures come from `messages/*.json` (`landing.hero`, plus the
 * existing testimonial author names for the proof avatars) — nothing here
 * invents business data.
 *
 * Motion: one entrance stagger for the copy, a fade/scale for the portrait,
 * delayed entrances for the cards and stat panel, then very slow ambient
 * floating. Everything ambient is suppressed under `prefers-reduced-motion`.
 */

import * as React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  FiArrowRight,
  FiClock,
  FiLayers,
  FiMic,
  FiUsers,
  FiVideo,
} from "react-icons/fi";
import { PiGraduationCapFill } from "react-icons/pi";
import { HiSparkles } from "react-icons/hi2";

import HeroWaveRing from "./HeroWaveRing";
import { mailto } from "./links";
import { CountUpStat, Magnetic, Shell } from "./primitives";
import {
  accentStyles,
  BRAND,
  displayFont,
  EASE,
  INK,
  SHADOW,
  TEXT,
  type AccentTone,
} from "./tokens";

const MotionBox = motion.create(Box);

/** Horizontal blue -> indigo -> violet, as used on the headline and primary CTA. */
const heroGradient = `linear-gradient(96deg, ${BRAND.blue} 0%, ${BRAND.indigo} 46%, ${BRAND.violet} 100%)`;

/** Frosted white used by the floating cards and the stat panel. */
const heroGlass = {
  bgcolor: "rgba(255,255,255,0.78)",
  backdropFilter: "blur(22px) saturate(180%)",
  WebkitBackdropFilter: "blur(22px) saturate(180%)",
  border: "1px solid rgba(255,255,255,0.85)",
  boxShadow:
    "0 1px 2px rgba(10,37,64,0.04), 0 18px 44px -18px rgba(10,37,64,0.18), inset 0 1px 0 rgba(255,255,255,0.9)",
} as const;

const loadStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.085, delayChildren: 0.1 } },
};

const riseIn = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.68, ease: EASE } },
};

export default function HeroSection() {
  const t = useTranslations("landing");
  const reduce = useReducedMotion();
  const sectionRef = React.useRef<HTMLDivElement | null>(null);

  // Scroll-linked parallax: the visual column drifts slower than the copy.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const visualY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 34]);

  const stats: Array<{
    value: string;
    label: string;
    icon: React.ReactNode;
    tone: AccentTone;
  }> = [
    {
      value: t("hero.statsYearsValue"),
      label: t("hero.statsYearsLabel"),
      icon: <PiGraduationCapFill size={22} />,
      tone: "violet",
    },
    {
      value: t("hero.statsCoursesValue"),
      label: t("hero.statsCoursesLabel"),
      icon: <FiLayers size={20} />,
      tone: "blue",
    },
    {
      value: t("hero.statsSessionValue"),
      label: t("hero.statsSessionLabel"),
      icon: <FiClock size={20} />,
      tone: "violet",
    },
    {
      value: t("hero.statsMembershipValue"),
      label: t("hero.statsMembershipLabel"),
      icon: <FiUsers size={20} />,
      tone: "cyan",
    },
  ];

  // Social-proof avatars reuse the real testimonial authors rather than stock
  // faces, so the row carries existing content instead of invented numbers.
  const proofAuthors: Array<{ name: string; tone: AccentTone }> = [
    { name: t("testimonials.student1.author"), tone: "blue" },
    { name: t("testimonials.student2.author"), tone: "violet" },
    { name: t("testimonials.student3.author"), tone: "cyan" },
  ];

  return (
    <Box
      id="home"
      component="section"
      ref={sectionRef}
      sx={{
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: { xs: "auto", lg: "calc(100dvh - 110px)" },
        pt: { xs: 4, md: 5, lg: 2 },
        pb: { xs: 5, md: 6, lg: 3 },
        backgroundColor: "#FFFFFF",
        backgroundImage: [
          // Right-hand lavender bloom behind the portrait.
          "radial-gradient(760px 620px at 76% 40%, rgba(139,92,246,0.16), transparent 62%)",
          "radial-gradient(620px 520px at 92% 22%, rgba(43,127,255,0.14), transparent 60%)",
          // Cool wash under the copy column and along the bottom edge.
          "radial-gradient(680px 480px at 6% 96%, rgba(91,91,240,0.09), transparent 62%)",
          "linear-gradient(180deg, #FFFFFF 0%, #FBFCFF 38%, #F2F5FD 100%)",
        ].join(", "),
      }}
    >
      <Shell>
        <Box
          component={motion.div}
          initial="hidden"
          animate="visible"
          variants={loadStagger}
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.02fr 0.98fr" },
            gap: { xs: 4, sm: 5, lg: 3 },
            alignItems: "center",
          }}
        >
          {/* ---------------------------------------------------------- */}
          {/* Copy column                                                 */}
          {/* ---------------------------------------------------------- */}
          <MotionBox
            style={{ y: copyY }}
            sx={{
              order: { xs: 2, lg: 1 },
              textAlign: { xs: "center", lg: "left" },
            }}
          >
            {/* Badge */}
            <MotionBox
              variants={riseIn}
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1.1,
                pl: 1.4,
                pr: 2.1,
                py: 0.9,
                mb: { xs: 2.5, md: 3 },
                borderRadius: 999,
                bgcolor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(139,92,246,0.16)",
                boxShadow: "0 6px 18px -10px rgba(10,37,64,0.22)",
              }}
            >
              <Box
                aria-hidden
                sx={{
                  display: "grid",
                  placeItems: "center",
                  color: BRAND.violet,
                  lineHeight: 0,
                }}
              >
                <HiSparkles size={16} />
              </Box>
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: "0.66rem", md: "0.72rem" },
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: BRAND.indigo,
                  lineHeight: 1,
                  whiteSpace: { sm: "nowrap" },
                }}
              >
                {t("hero.eyebrow")}
              </Typography>
            </MotionBox>

            {/* Headline */}
            <Typography
              component={motion.h1}
              variants={riseIn}
              sx={{
                fontFamily: displayFont,
                fontWeight: 800,
                fontSize: {
                  xs: "2.6rem",
                  sm: "3.5rem",
                  md: "4.3rem",
                  lg: "4.9rem",
                  xl: "5.3rem",
                },
                lineHeight: 1.02,
                letterSpacing: "-0.045em",
                color: INK[900],
                mb: { xs: 2.25, md: 2.75 },
              }}
            >
              <Box component="span" sx={{ display: "block" }}>
                {t("hero.headline")}
              </Box>
              <Box
                component="span"
                sx={{
                  display: "block",
                  backgroundImage: heroGradient,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "transparent",
                  // The descender of "y"/"g" clips without a little breathing room.
                  pb: "0.06em",
                }}
              >
                {t("hero.headlineHighlight")}
              </Box>
            </Typography>

            {/* Supporting paragraph */}
            <Typography
              component={motion.p}
              variants={riseIn}
              sx={{
                color: TEXT.secondary,
                fontSize: { xs: "1rem", md: "1.075rem" },
                lineHeight: 1.68,
                mb: { xs: 3, md: 3.75 },
                maxWidth: 545,
                mx: { xs: "auto", lg: 0 },
                textWrap: "pretty",
              }}
            >
              {t("hero.subtitle")}
            </Typography>

            {/* CTAs */}
            <Stack
              component={motion.div}
              variants={riseIn}
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                mb: { xs: 3, md: 3.5 },
                alignItems: { xs: "stretch", sm: "center" },
                justifyContent: { xs: "center", lg: "flex-start" },
              }}
            >
              <Magnetic sx={{ width: { xs: "100%", sm: "auto" } }}>
                <Box
                  component="a"
                  href={mailto(t("hero.cta"))}
                  sx={{
                    display: "inline-flex",
                    width: { xs: "100%", sm: "auto" },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1.4,
                    px: { xs: 3.5, md: 4.25 },
                    py: { xs: 1.75, md: 1.95 },
                    borderRadius: 999,
                    backgroundImage: heroGradient,
                    color: "#fff",
                    fontSize: "0.96rem",
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    boxShadow: "0 12px 30px -10px rgba(109,52,224,0.6)",
                    transition:
                      "transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease",
                    "@media (prefers-reduced-motion: no-preference)": {
                      "&:hover": { transform: "translateY(-2px)" },
                    },
                    "&:hover": {
                      filter: "saturate(1.08)",
                      boxShadow: "0 18px 38px -12px rgba(109,52,224,0.68)",
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${BRAND.violet}`,
                      outlineOffset: 3,
                    },
                  }}
                >
                  {t("hero.cta")}
                  <FiArrowRight size={18} />
                </Box>
              </Magnetic>

              <Box
                component="a"
                href="#courses"
                sx={{
                  display: "inline-flex",
                  width: { xs: "100%", sm: "auto" },
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1.4,
                  px: { xs: 3.5, md: 4 },
                  py: { xs: 1.65, md: 1.85 },
                  borderRadius: 999,
                  bgcolor: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(10,37,64,0.1)",
                  color: INK[900],
                  fontSize: "0.96rem",
                  fontWeight: 700,
                  boxShadow: "0 6px 18px -12px rgba(10,37,64,0.3)",
                  transition:
                    "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  "@media (prefers-reduced-motion: no-preference)": {
                    "&:hover": { transform: "translateY(-2px)" },
                  },
                  "&:hover": {
                    borderColor: "rgba(43,127,255,0.4)",
                    boxShadow: "0 14px 30px -14px rgba(10,37,64,0.32)",
                  },
                  "&:focus-visible": {
                    outline: `2px solid ${BRAND.blue}`,
                    outlineOffset: 3,
                  },
                }}
              >
                {t("hero.viewCourses")}
                <FiArrowRight size={18} />
              </Box>
            </Stack>

            {/* Social proof — real testimonial authors, existing trust line */}
            <Stack
              component={motion.div}
              variants={riseIn}
              direction="row"
              spacing={1.75}
              alignItems="center"
              sx={{ justifyContent: { xs: "center", lg: "flex-start" } }}
            >
              <Stack direction="row" aria-hidden sx={{ flexShrink: 0 }}>
                {proofAuthors.map((author, index) => {
                  const a = accentStyles[author.tone];
                  return (
                    <Box
                      key={author.name}
                      sx={{
                        width: 34,
                        height: 34,
                        ml: index === 0 ? 0 : "-10px",
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        bgcolor: a.bg,
                        color: a.color,
                        border: "2px solid #fff",
                        boxShadow: "0 2px 8px rgba(10,37,64,0.12)",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                      }}
                    >
                      {author.name.charAt(0)}
                    </Box>
                  );
                })}
              </Stack>
              <Typography
                sx={{
                  fontSize: "0.88rem",
                  color: TEXT.secondary,
                  lineHeight: 1.45,
                }}
              >
                {t("hero.trustNote")}
              </Typography>
            </Stack>
          </MotionBox>

          {/* ---------------------------------------------------------- */}
          {/* Visual column                                               */}
          {/* ---------------------------------------------------------- */}
          <MotionBox
            style={{ y: visualY }}
            sx={{
              order: { xs: 1, lg: 2 },
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MotionBox
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: 0.15 }}
              sx={{
                position: "relative",
                width: { xs: 290, sm: 400, md: 470, lg: 500, xl: 560 },
                height: { xs: 290, sm: 400, md: 470, lg: 500, xl: 560 },
              }}
            >
              {/* Soft glow behind everything */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: "-16%",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 52% 46%, rgba(139,92,246,0.22) 0%, rgba(43,127,255,0.13) 42%, rgba(255,255,255,0) 68%)",
                  filter: "blur(18px)",
                  pointerEvents: "none",
                }}
              />

              {/* Slow dotted orbit */}
              <MotionBox
                aria-hidden
                animate={reduce ? undefined : { rotate: 360 }}
                transition={{ duration: 110, repeat: Infinity, ease: "linear" }}
                sx={{
                  position: "absolute",
                  inset: "-6%",
                  pointerEvents: "none",
                }}
              >
                <Box
                  component="svg"
                  viewBox="0 0 200 200"
                  sx={{ width: "100%", height: "100%", display: "block" }}
                >
                  {/* ~200° of dotted arc, open at the lower right. */}
                  <path
                    d="M 148 16.9 A 96 96 0 1 0 83.3 194.5"
                    fill="none"
                    stroke={BRAND.violet}
                    strokeOpacity={0.38}
                    strokeWidth={1.4}
                    strokeLinecap="round"
                    strokeDasharray="0.5 7"
                  />
                </Box>
              </MotionBox>

              {/* Hairline outer ring */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: "1%",
                  borderRadius: "50%",
                  border: "1px solid rgba(43,127,255,0.14)",
                  pointerEvents: "none",
                }}
              />

              {/* Radial waveform ring — sits ~15% proud of the frame so the
                  bars clear the portrait without being clipped. */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: "-15%",
                  display: "grid",
                  placeItems: "center",
                  pointerEvents: "none",
                }}
              >
                <HeroWaveRing size={820} innerRatio={0.36} barRatio={0.048} />
              </Box>

              {/* Inner glass ring holding the portrait */}
              <Box
                aria-hidden
                sx={{
                  position: "absolute",
                  inset: "12%",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(150deg, rgba(255,255,255,0.85) 0%, rgba(238,243,255,0.5) 55%, rgba(226,232,255,0.35) 100%)",
                  border: "1px solid rgba(255,255,255,0.9)",
                  boxShadow:
                    "inset 0 2px 12px rgba(255,255,255,0.9), 0 24px 60px -30px rgba(43,127,255,0.5)",
                  pointerEvents: "none",
                }}
              />

              {/* Portrait */}
              <MotionBox
                animate={reduce ? undefined : { y: [0, -10, 0] }}
                transition={{
                  duration: 9,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                sx={{
                  position: "absolute",
                  inset: "16%",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "6px solid rgba(255,255,255,0.96)",
                  boxShadow: SHADOW.lift,
                  zIndex: 2,
                }}
              >
                <Image
                  src="/images/landing-page-1.jpg"
                  alt={t("about.title")}
                  fill
                  sizes="(max-width: 600px) 260px, (max-width: 1200px) 380px, 420px"
                  style={{ objectFit: "cover", objectPosition: "center 22%" }}
                  priority
                />
              </MotionBox>

              {/* Floating card — live session length */}
              <MotionBox
                initial={{ opacity: 0, y: -16, x: 16 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6, ease: EASE }}
                sx={{
                  position: "absolute",
                  top: { xs: "-2%", md: "2%" },
                  right: { xs: "-6%", sm: "-10%", lg: "-13%" },
                  zIndex: 3,
                }}
              >
                <MotionBox
                  animate={reduce ? undefined : { y: [0, -7, 0] }}
                  transition={{
                    duration: 6.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
                  sx={{
                    ...heroGlass,
                    borderRadius: 3,
                    px: { xs: 1.5, md: 1.9 },
                    py: { xs: 1.1, md: 1.35 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.4,
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      bgcolor: "rgba(139,92,246,0.13)",
                      color: BRAND.violet,
                      border: "1px solid rgba(139,92,246,0.2)",
                    }}
                  >
                    <FiVideo size={18} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        color: INK[900],
                        lineHeight: 1.3,
                      }}
                    >
                      {t("hero.statsSessionValue")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.76rem",
                        color: TEXT.secondary,
                        lineHeight: 1.35,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t("hero.statsSessionLabel")}
                    </Typography>
                  </Box>
                </MotionBox>
              </MotionBox>

              {/* Floating card — feedback promise */}
              <MotionBox
                initial={{ opacity: 0, y: 20, x: 10 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ delay: 0.85, duration: 0.6, ease: EASE }}
                sx={{
                  position: "absolute",
                  bottom: { xs: "-4%", md: "6%", lg: "14%" },
                  right: { xs: "-6%", sm: "-8%", lg: "-3%" },
                  zIndex: 3,
                }}
              >
                <MotionBox
                  animate={reduce ? undefined : { y: [0, 8, 0] }}
                  transition={{
                    duration: 7.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.8,
                  }}
                  whileHover={reduce ? undefined : { y: -4, scale: 1.02 }}
                  sx={{
                    ...heroGlass,
                    borderRadius: 3,
                    px: { xs: 1.5, md: 1.9 },
                    py: { xs: 1.1, md: 1.35 },
                    display: "flex",
                    alignItems: "center",
                    gap: 1.4,
                  }}
                >
                  <Box
                    aria-hidden
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      backgroundImage: heroGradient,
                      color: "#fff",
                      boxShadow: "0 8px 18px -8px rgba(109,52,224,0.7)",
                    }}
                  >
                    <FiMic size={17} />
                  </Box>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 800,
                        fontSize: "0.85rem",
                        color: INK[900],
                        lineHeight: 1.3,
                      }}
                    >
                      {t("hero.floatingTitle")}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.76rem",
                        color: TEXT.secondary,
                        lineHeight: 1.35,
                      }}
                    >
                      {t("hero.floatingSubtitle")}
                    </Typography>
                  </Box>
                </MotionBox>
              </MotionBox>
            </MotionBox>
          </MotionBox>
        </Box>

        {/* ------------------------------------------------------------ */}
        {/* Statistics panel                                              */}
        {/* ------------------------------------------------------------ */}
        <MotionBox
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.75, ease: EASE }}
          sx={{
            mt: { xs: 5, md: 6, lg: 5 },
            borderRadius: { xs: 4, md: 6 },
            px: { xs: 2, sm: 3, md: 2 },
            py: { xs: 2.5, md: 3 },
            bgcolor: "rgba(255,255,255,0.55)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid rgba(255,255,255,0.8)",
            boxShadow:
              "0 1px 2px rgba(10,37,64,0.03), 0 20px 60px -32px rgba(10,37,64,0.28), inset 0 1px 0 rgba(255,255,255,0.9)",
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 2.5, md: 0 },
          }}
        >
          {stats.map((stat, index) => {
            const a = accentStyles[stat.tone];
            return (
              <Box
                key={stat.label}
                className="lift-group"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.75, md: 2 },
                  px: { xs: 0, md: 3 },
                  // Hairline separators between columns only where they wrap.
                  borderLeft: {
                    xs: "none",
                    sm:
                      index % 2 === 1
                        ? "1px solid rgba(10,37,64,0.08)"
                        : "none",
                    md: index === 0 ? "none" : "1px solid rgba(10,37,64,0.08)",
                  },
                }}
              >
                <Box
                  aria-hidden
                  sx={{
                    width: { xs: 48, md: 54 },
                    height: { xs: 48, md: 54 },
                    borderRadius: "50%",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                    bgcolor: a.bg,
                    color: a.color,
                    border: `1px solid ${a.border}`,
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.7)",
                    transition: "transform 0.4s cubic-bezier(0.22,1,0.36,1)",
                    "@media (prefers-reduced-motion: no-preference)": {
                      ".lift-group:hover &": { transform: "scale(1.07)" },
                    },
                  }}
                >
                  {stat.icon}
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <CountUpStat
                    value={stat.value}
                    sx={{
                      fontFamily: displayFont,
                      fontWeight: 800,
                      fontSize: { xs: "1.65rem", md: "1.85rem" },
                      lineHeight: 1.1,
                      letterSpacing: "-0.035em",
                      color: INK[900],
                    }}
                  />
                  <Stack
                    direction="row"
                    spacing={0.85}
                    alignItems="center"
                    sx={{ mt: 0.35 }}
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        bgcolor: a.color,
                        flexShrink: 0,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: { xs: "0.82rem", md: "0.85rem" },
                        color: TEXT.secondary,
                        lineHeight: 1.35,
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            );
          })}
        </MotionBox>
      </Shell>
    </Box>
  );
}
