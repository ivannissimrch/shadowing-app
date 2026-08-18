"use client";

/**
 * ANALYSIS — Lyn's Courses
 *
 * Was working: a featured treatment for the membership, glass cards, a trust
 * note under each CTA, and a sensible mailto-per-course.
 *
 * Was weak:
 *  - five identical `PricingPackageCard`s in a plain 3-column grid. The code
 *    comment claimed "bento layout" but every tile was the same size and shape.
 *  - the very next section reused the same component in the same grid, so the
 *    two read as one long undifferentiated wall of cards.
 *  - descriptions were full padded sentences ("A self-paced course covering the
 *    seven essential sounds of standard American English pronunciation").
 *  - the price string was parsed with a regex at render time to split "$75
 *    ($15 on sale)" into amount and suffix — brittle, and it silently produced
 *    a wrong result for any locale that formats prices differently.
 *
 * Plan: a real bento. The membership becomes a tall featured panel on an ink
 * gradient; two courses become wide horizontal tiles; two become compact
 * squares; the shadowing course becomes a full-width band that closes the
 * section. Each course carries its own accent colour and topic icon. Price and
 * price-note are now separate i18n keys instead of being regex-parsed.
 */

import * as React from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  FiArrowRight,
  FiAward,
  FiBookOpen,
  FiCheck,
  FiHeadphones,
  FiMic,
  FiType,
} from "react-icons/fi";

import { mailto } from "./links";
import {
  AccentIcon,
  GhostButton,
  GoldButton,
  GrainOverlay,
  MeshBlob,
  Shell,
  SectionHeading,
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

type CourseKey = "membership" | "accent" | "phrasalVerbs" | "ipa" | "shadowing";

const META: Record<
  CourseKey,
  {
    icon: React.ReactNode;
    tone: AccentTone;
    span: "featured" | "wide" | "compact" | "band";
  }
> = {
  membership: { icon: <FiAward size={26} />, tone: "gold", span: "featured" },
  accent: { icon: <FiMic size={24} />, tone: "violet", span: "wide" },
  phrasalVerbs: {
    icon: <FiBookOpen size={22} />,
    tone: "coral",
    span: "compact",
  },
  ipa: { icon: <FiType size={22} />, tone: "cyan", span: "compact" },
  shadowing: { icon: <FiHeadphones size={26} />, tone: "blue", span: "band" },
};

/** Grid placement per tile, per breakpoint. */
const AREA: Record<CourseKey, object> = {
  membership: {
    gridColumn: { sm: "span 2", lg: "span 2" },
    gridRow: { lg: "span 2" },
  },
  accent: { gridColumn: { sm: "span 2", lg: "span 2" } },
  phrasalVerbs: { gridColumn: { sm: "span 1", lg: "span 1" } },
  ipa: { gridColumn: { sm: "span 1", lg: "span 1" } },
  shadowing: { gridColumn: { sm: "span 2", lg: "span 4" } },
};

function PriceTag({
  price,
  note,
  tone,
  large = false,
  onDark = false,
}: {
  price: string;
  note?: string;
  tone: AccentTone;
  large?: boolean;
  onDark?: boolean;
}) {
  const a = accentStyles[tone];
  return (
    <Stack direction="row" spacing={1} alignItems="baseline" flexWrap="wrap">
      <Typography
        component="span"
        sx={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: large
            ? { xs: "2.6rem", md: "3.1rem" }
            : { xs: "1.7rem", md: "1.9rem" },
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: onDark ? GOLD.main : a.color,
        }}
      >
        {price}
      </Typography>
      {note && (
        <Typography
          component="span"
          sx={{
            fontSize: "0.82rem",
            fontWeight: 500,
            color: onDark ? "rgba(255,255,255,0.6)" : TEXT.muted,
          }}
        >
          {note}
        </Typography>
      )}
    </Stack>
  );
}

function BenefitList({
  items,
  tone,
  onDark = false,
  dense = false,
}: {
  items: string[];
  tone: AccentTone;
  onDark?: boolean;
  dense?: boolean;
}) {
  const a = accentStyles[tone];
  return (
    <Stack
      spacing={dense ? 1 : 1.35}
      component="ul"
      sx={{ listStyle: "none", m: 0, p: 0 }}
    >
      {items.map((item) => (
        <Stack
          key={item}
          component="li"
          direction="row"
          spacing={1.25}
          alignItems="flex-start"
        >
          <Box
            aria-hidden
            sx={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
              mt: "2px",
              bgcolor: onDark ? "rgba(245,166,35,0.2)" : a.bg,
              color: onDark ? GOLD.main : a.color,
            }}
          >
            <FiCheck size={11} strokeWidth={3} />
          </Box>
          <Typography
            sx={{
              fontSize: dense ? "0.8rem" : "0.86rem",
              lineHeight: 1.55,
              color: onDark ? "rgba(255,255,255,0.82)" : TEXT.secondary,
            }}
          >
            {item}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default function CoursesSection() {
  const t = useTranslations("landing.courses");
  const reduce = useReducedMotion();

  const keys: CourseKey[] = [
    "membership",
    "accent",
    "phrasalVerbs",
    "ipa",
    "shadowing",
  ];

  const course = (key: CourseKey) => ({
    title: t(`${key}.title`),
    description: t(`${key}.description`),
    price: t(`${key}.price`),
    priceNote: t(`${key}.priceNote`),
    benefits: [
      t(`${key}.benefit1`),
      t(`${key}.benefit2`),
      t(`${key}.benefit3`),
    ],
    href: mailto(t(`${key}.title`)),
  });

  return (
    <Box
      id="courses"
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: sectionPy,
        background: `linear-gradient(180deg, ${SURFACE.tinted} 0%, ${SURFACE.base} 30%, ${SURFACE.base} 100%)`,
      }}
    >
      <MeshBlob
        top="-4%"
        right="-8%"
        size={{ xs: 260, md: 460 }}
        color={`${BRAND.violet}1F`}
      />
      <MeshBlob
        bottom="8%"
        left="-10%"
        size={{ xs: 240, md: 400 }}
        color={`${GOLD.main}1A`}
        delay={3}
      />
      <GrainOverlay opacity={0.028} />

      <Shell>
        <SectionHeading
          eyebrow={t("eyebrow")}
          title={t("title")}
          highlight={t("titleHighlight")}
          subtitle={t("subtitle")}
          tone="violet"
        />

        <MotionBox
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.08 }}
          variants={stagger}
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: { xs: 2, md: 2.5 },
            alignItems: "stretch",
          }}
        >
          {keys.map((key) => {
            const c = course(key);
            const meta = META[key];
            const a = accentStyles[meta.tone];

            /* --- Featured membership: tall ink panel --------------------- */
            if (meta.span === "featured") {
              return (
                <MotionBox
                  key={key}
                  className="lift-group"
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { y: -8 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  sx={{
                    ...AREA[key],
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 4,
                    p: { xs: 3, md: 4 },
                    display: "flex",
                    flexDirection: "column",
                    color: "#fff",
                    background: `linear-gradient(155deg, ${INK[900]} 0%, ${INK[700]} 60%, #17406B 100%)`,
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: SHADOW.lift,
                    ...hoverLiftSx,
                  }}
                >
                  <MeshBlob
                    top="-25%"
                    right="-20%"
                    size={280}
                    color={`${GOLD.main}33`}
                    blur={70}
                  />
                  <GrainOverlay opacity={0.06} />

                  <Stack
                    direction="row"
                    alignItems="flex-start"
                    justifyContent="space-between"
                    spacing={2}
                    sx={{ position: "relative", zIndex: 1, mb: 3 }}
                  >
                    <AccentIcon icon={meta.icon} tone="gold" size={56} light />
                    <Box
                      sx={{
                        px: 1.4,
                        py: 0.55,
                        borderRadius: 999,
                        bgcolor: GOLD.main,
                        color: INK[900],
                        fontSize: "0.62rem",
                        fontWeight: 800,
                        letterSpacing: 0.8,
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {t("featuredBadge")}
                    </Box>
                  </Stack>

                  <Box sx={{ position: "relative", zIndex: 1, flexGrow: 1 }}>
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 800,
                        fontSize: { xs: "1.5rem", md: "1.85rem" },
                        lineHeight: 1.15,
                        letterSpacing: "-0.025em",
                        mb: 1.5,
                      }}
                    >
                      {c.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.94rem",
                        lineHeight: 1.7,
                        color: "rgba(255,255,255,0.72)",
                        mb: 3,
                        maxWidth: 380,
                      }}
                    >
                      {c.description}
                    </Typography>

                    <Box sx={{ mb: 3 }}>
                      <PriceTag
                        price={c.price}
                        note={c.priceNote}
                        tone="gold"
                        large
                        onDark
                      />
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.64rem",
                        fontWeight: 700,
                        letterSpacing: 1.4,
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.45)",
                        mb: 1.5,
                      }}
                    >
                      {t("includesLabel")}
                    </Typography>
                    <BenefitList items={c.benefits} tone="gold" onDark />
                  </Box>

                  <Stack
                    spacing={1.5}
                    sx={{ position: "relative", zIndex: 1, mt: 4 }}
                  >
                    <GoldButton
                      href={c.href}
                      fullWidth
                      endIcon={<FiArrowRight size={16} />}
                      sx={{ width: "100%" }}
                    >
                      {t("signUpCta")}
                    </GoldButton>
                    <Typography
                      sx={{
                        fontSize: "0.74rem",
                        color: "rgba(255,255,255,0.5)",
                        textAlign: "center",
                      }}
                    >
                      {t("trustNote")}
                    </Typography>
                  </Stack>
                </MotionBox>
              );
            }

            /* --- Full-width closing band -------------------------------- */
            if (meta.span === "band") {
              return (
                <MotionBox
                  key={key}
                  className="lift-group"
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { y: -6 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  sx={{
                    ...AREA[key],
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: 4,
                    p: { xs: 3, md: 3.5 },
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "auto 1fr auto" },
                    alignItems: "center",
                    gap: { xs: 2.5, md: 4 },
                    ...glassLight,
                    borderLeft: `4px solid ${a.color}`,
                    ...hoverLiftSx,
                  }}
                >
                  <AccentIcon icon={meta.icon} tone={meta.tone} size={64} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontFamily: displayFont,
                        fontWeight: 700,
                        fontSize: { xs: "1.2rem", md: "1.35rem" },
                        color: INK[800],
                        lineHeight: 1.25,
                        mb: 0.75,
                      }}
                    >
                      {c.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: TEXT.secondary,
                        lineHeight: 1.65,
                        mb: 2,
                      }}
                    >
                      {c.description}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={{ xs: 1, md: 2.5 }}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {c.benefits.map((b) => (
                        <Stack
                          key={b}
                          direction="row"
                          spacing={0.75}
                          alignItems="center"
                        >
                          <FiCheck size={13} color={a.color} strokeWidth={3} />
                          <Typography
                            sx={{ fontSize: "0.78rem", color: TEXT.secondary }}
                          >
                            {b}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                  <Stack
                    spacing={1.5}
                    alignItems={{ xs: "flex-start", md: "flex-end" }}
                  >
                    <PriceTag
                      price={c.price}
                      note={c.priceNote}
                      tone={meta.tone}
                    />
                    <GhostButton
                      href={c.href}
                      endIcon={<FiArrowRight size={15} />}
                    >
                      {t("signUpCta")}
                    </GhostButton>
                  </Stack>
                </MotionBox>
              );
            }

            /* --- Wide + compact glass tiles ----------------------------- */
            const isWide = meta.span === "wide";
            return (
              <MotionBox
                key={key}
                className="lift-group"
                variants={fadeUp}
                whileHover={reduce ? undefined : { y: -8 }}
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
                sx={{
                  ...AREA[key],
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: 4,
                  p: { xs: 2.5, md: 3 },
                  display: "flex",
                  flexDirection: isWide
                    ? { xs: "column", md: "row" }
                    : "column",
                  gap: isWide ? { xs: 2, md: 3 } : 2,
                  ...glassLight,
                  ...hoverLiftSx,
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    borderRadius: "inherit",
                    pointerEvents: "none",
                    background: `radial-gradient(120% 90% at 100% 0%, ${a.bg} 0%, transparent 60%)`,
                  },
                }}
              >
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <AccentIcon
                    icon={meta.icon}
                    tone={meta.tone}
                    size={isWide ? 54 : 46}
                  />
                </Box>

                <Box
                  sx={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    minWidth: 0,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: displayFont,
                      fontWeight: 700,
                      fontSize: isWide
                        ? { xs: "1.15rem", md: "1.3rem" }
                        : "1.05rem",
                      color: INK[800],
                      lineHeight: 1.25,
                      mb: 1,
                    }}
                  >
                    {c.title}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.86rem",
                      color: TEXT.secondary,
                      lineHeight: 1.65,
                      mb: 2,
                    }}
                  >
                    {c.description}
                  </Typography>

                  {isWide && (
                    <Box sx={{ mb: 2.5 }}>
                      <BenefitList items={c.benefits} tone={meta.tone} dense />
                    </Box>
                  )}

                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1.5}
                    sx={{ mt: "auto", pt: 1 }}
                  >
                    <PriceTag
                      price={c.price}
                      note={c.priceNote}
                      tone={meta.tone}
                    />
                    <Box
                      component="a"
                      href={c.href}
                      aria-label={`${t("signUpCta")} — ${c.title}`}
                      sx={{
                        width: 40,
                        height: 40,
                        flexShrink: 0,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        bgcolor: a.color,
                        textDecoration: "none",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateX(3px)",
                          boxShadow: a.glow,
                        },
                        "&:focus-visible": {
                          outline: `2px solid ${a.color}`,
                          outlineOffset: 3,
                        },
                      }}
                    >
                      <FiArrowRight size={17} />
                    </Box>
                  </Stack>
                </Box>
              </MotionBox>
            );
          })}
        </MotionBox>
      </Shell>
    </Box>
  );
}
