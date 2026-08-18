"use client";

/**
 * ANALYSIS — Closing CTA + footer
 *
 * Was working: the gradient mesh and dot texture gave the CTA some depth, the
 * contact panel used dark glass, and the social links were present.
 *
 * Was weak:
 *  - the CTA body reused `hero.subtitle` — the fourth appearance of that exact
 *    sentence on a single page.
 *  - the contact panel was a flat four-row list: same 44px circle, same text
 *    link, four times, with the Facebook *group* missing from it entirely even
 *    though the link existed in the file.
 *  - the bottom footer was a thin strip with no navigation, so the only way
 *    back up the page from the bottom was to scroll.
 *  - three social buttons were rendered as MUI `Button`s with no accessible
 *    text, relying solely on `aria-label`.
 *
 * Plan: dedicated closing copy; the contact panel becomes a 2x2 grid of channel
 * cards, each on its own brand colour, with the Facebook group restored; and a
 * proper footer with column navigation, the payment note, and sign-in.
 */

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { FiArrowRight, FiArrowUpRight, FiMail, FiUsers } from "react-icons/fi";
import { FaFacebookF, FaYoutube } from "react-icons/fa";

import {
  CONTACT_EMAIL,
  FACEBOOK_GROUP_URL,
  FACEBOOK_PAGE_URL,
  NAVIKX_URL,
  YOUTUBE_URL,
  mailto,
} from "./links";
import {
  Eyebrow,
  GoldButton,
  GrainOverlay,
  Magnetic,
  MeshBlob,
  Shell,
} from "./primitives";
import {
  BORDER,
  BRAND,
  brandGradient,
  displayFont,
  fadeUp,
  glassDark,
  GOLD,
  INK,
  SHADOW,
  stagger,
  SURFACE,
  TEXT,
} from "./tokens";

const MotionBox = motion.create(Box);

/** Section ids that exist on the page, for the footer's column nav. */
const FOOTER_LINKS = [
  { id: "home", key: "nav.home" },
  { id: "courses", key: "nav.courses" },
  { id: "coaching", key: "nav.coaching" },
  { id: "testimonials", key: "nav.testimonials" },
  { id: "about", key: "nav.about" },
] as const;

function DesignedByBadge() {
  const reduce = useReducedMotion();

  return (
    <Box
      component={motion.a}
      href={NAVIKX_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Designed by NavikX Technologies — opens navikx.com"
      whileHover={reduce ? undefined : { y: -3, scale: 1.02 }}
      whileTap={reduce ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      sx={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        gap: 1.75,
        px: 2.25,
        py: 1.1,
        pr: 1.35,
        borderRadius: 999,
        textDecoration: "none",
        color: "#fff",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${INK[800]} 0%, #163B52 42%, ${INK[700]} 100%)`,
        border: "1px solid rgba(255,255,255,0.16)",
        boxShadow: `${SHADOW.medium}, 0 0 0 1px rgba(43,127,255,0.08) inset`,
        transition: "box-shadow 0.35s ease, border-color 0.35s ease",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          background: `linear-gradient(120deg, transparent 30%, rgba(255,255,255,0.09) 50%, transparent 70%)`,
          opacity: 0.7,
          pointerEvents: "none",
        },
        "&:hover": {
          borderColor: "rgba(245,166,35,0.45)",
          boxShadow: `${SHADOW.lift}, ${SHADOW.glow}`,
          "& .navikx-arrow": {
            bgcolor: GOLD.main,
            color: INK[900],
            transform: "translate(2px, -2px)",
          },
        },
        "&:focus-visible": {
          outline: `2px solid ${GOLD.main}`,
          outlineOffset: 3,
        },
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "relative",
          zIndex: 1,
          width: 38,
          height: 38,
          borderRadius: "50%",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: `linear-gradient(145deg, ${GOLD.light} 0%, ${GOLD.main} 55%, ${GOLD.dark} 100%)`,
          color: INK[900],
          fontSize: "0.74rem",
          fontWeight: 900,
          letterSpacing: "-0.04em",
          boxShadow: `0 4px 14px rgba(245,166,35,0.45), inset 0 1px 0 rgba(255,255,255,0.35)`,
        }}
      >
        NX
      </Box>

      <Box sx={{ position: "relative", zIndex: 1, minWidth: 0, pr: 0.5 }}>
        <Typography
          sx={{
            fontSize: "0.52rem",
            fontWeight: 800,
            letterSpacing: 1.4,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.52)",
            lineHeight: 1.2,
            mb: 0.2,
          }}
        >
          Designed by
        </Typography>
        <Typography
          sx={{
            fontSize: "0.86rem",
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
            letterSpacing: "-0.01em",
          }}
        >
          NavikX Technologies
        </Typography>
      </Box>

      <Box
        className="navikx-arrow"
        aria-hidden
        sx={{
          position: "relative",
          zIndex: 1,
          width: 34,
          height: 34,
          borderRadius: "50%",
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(255,255,255,0.1)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "#fff",
          transition:
            "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease",
        }}
      >
        <FiArrowUpRight size={16} strokeWidth={2.5} />
      </Box>
    </Box>
  );
}

export default function ClosingSection() {
  const t = useTranslations("landing");
  const tFooter = useTranslations("landing.footer");
  const reduce = useReducedMotion();

  const channels = [
    {
      href: mailto(),
      icon: <FiMail size={20} />,
      label: tFooter("emailLabel"),
      value: CONTACT_EMAIL,
      color: GOLD.main,
      bg: "rgba(245,166,35,0.14)",
      border: "rgba(245,166,35,0.3)",
      external: false,
    },
    {
      href: YOUTUBE_URL,
      icon: <FaYoutube size={20} />,
      label: t("community.youtube"),
      value: "@FluencyAccentCoach",
      color: "#FF4B4B",
      bg: "rgba(255,75,75,0.12)",
      border: "rgba(255,75,75,0.28)",
      external: true,
    },
    {
      href: FACEBOOK_PAGE_URL,
      icon: <FaFacebookF size={18} />,
      label: t("community.facebookPage"),
      value: "Analisse84",
      color: "#5B9BFF",
      bg: "rgba(91,155,255,0.14)",
      border: "rgba(91,155,255,0.3)",
      external: true,
    },
    {
      href: FACEBOOK_GROUP_URL,
      icon: <FiUsers size={20} />,
      label: t("community.facebookGroup"),
      value: t("proof.item6"),
      color: "#A78BFF",
      bg: "rgba(167,139,255,0.14)",
      border: "rgba(167,139,255,0.3)",
      external: true,
    },
  ];

  return (
    <>
      {/* Closing CTA */}
      <Box
        id="contact"
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          py: { xs: 9, md: 14 },
          color: "#fff",
          background: `linear-gradient(155deg, ${INK[900]} 0%, ${INK[800]} 50%, #16386A 100%)`,
        }}
      >
        <MeshBlob
          top="-14%"
          left="8%"
          size={{ xs: 300, md: 520 }}
          color={`${GOLD.main}2E`}
        />
        <MeshBlob
          bottom="-18%"
          right="4%"
          size={{ xs: 280, md: 460 }}
          color={`${BRAND.violet}33`}
          delay={2.5}
        />
        <GrainOverlay opacity={0.05} />

        <Shell>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.05fr 1fr" },
              gap: { xs: 6, md: 8 },
              alignItems: "center",
            }}
          >
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={stagger}
            >
              <Eyebrow light tone="gold">
                {tFooter("eyebrow")}
              </Eyebrow>

              <Typography
                component={motion.h2}
                variants={fadeUp}
                sx={{
                  fontFamily: displayFont,
                  fontWeight: 800,
                  fontSize: { xs: "2.3rem", md: "3.4rem" },
                  lineHeight: 1.03,
                  letterSpacing: "-0.04em",
                  mb: 2.5,
                }}
              >
                {tFooter("cta")}{" "}
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
                  {tFooter("ctaHighlight")}
                </Box>
              </Typography>

              <Typography
                component={motion.p}
                variants={fadeUp}
                sx={{
                  fontSize: { xs: "1rem", md: "1.1rem" },
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.72)",
                  mb: 4,
                  maxWidth: 480,
                }}
              >
                {tFooter("body")}
              </Typography>

              <MotionBox variants={fadeUp}>
                <Magnetic>
                  <GoldButton
                    size="lg"
                    href={mailto(t("hero.cta"))}
                    endIcon={<FiArrowRight size={17} />}
                  >
                    {t("hero.cta")}
                  </GoldButton>
                </Magnetic>
              </MotionBox>

              <Typography
                component={motion.p}
                variants={fadeUp}
                sx={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.42)",
                  mt: 2.5,
                }}
              >
                {tFooter("responseNote")}
              </Typography>
            </MotionBox>

            {/* Contact channels — 2x2 instead of a flat four-row list */}
            <MotionBox
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={stagger}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                gap: { xs: 1.75, md: 2 },
              }}
            >
              {channels.map((channel) => (
                <Box
                  key={channel.href}
                  component={motion.a}
                  variants={fadeUp}
                  whileHover={reduce ? undefined : { y: -5 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                  href={channel.href}
                  {...(channel.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  sx={{
                    ...glassDark,
                    borderRadius: 3.5,
                    p: { xs: 2.25, md: 2.75 },
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.75,
                    textDecoration: "none",
                    color: "#fff",
                    transition:
                      "border-color 0.35s ease, background-color 0.35s ease",
                    "&:hover": {
                      borderColor: channel.border,
                      bgcolor: "rgba(255,255,255,0.09)",
                    },
                    "&:focus-visible": {
                      outline: `2px solid ${channel.color}`,
                      outlineOffset: 3,
                    },
                  }}
                >
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box
                      aria-hidden
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        display: "grid",
                        placeItems: "center",
                        color: channel.color,
                        bgcolor: channel.bg,
                        border: `1px solid ${channel.border}`,
                      }}
                    >
                      {channel.icon}
                    </Box>
                    <Box sx={{ color: "rgba(255,255,255,0.35)" }}>
                      <FiArrowUpRight size={16} />
                    </Box>
                  </Stack>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{ fontWeight: 700, fontSize: "0.88rem", mb: 0.4 }}
                    >
                      {channel.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "0.76rem",
                        color: "rgba(255,255,255,0.55)",
                        wordBreak: "break-word",
                      }}
                    >
                      {channel.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </MotionBox>
          </Box>
        </Shell>
      </Box>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          bgcolor: SURFACE.base,
          borderTop: `1px solid ${BORDER.light}`,
          pt: { xs: 5, md: 7 },
          pb: { xs: 3, md: 4 },
        }}
      >
        <Shell>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1.4fr 1fr 1fr" },
              gap: { xs: 4, md: 6 },
              pb: { xs: 4, md: 5 },
            }}
          >
            <Box>
              <Box sx={{ position: "relative", width: 176, height: 40, mb: 2 }}>
                <Image
                  src="/logo.png"
                  alt={t("brand")}
                  fill
                  sizes="176px"
                  style={{
                    objectFit: "contain",
                    objectPosition: "left center",
                  }}
                />
              </Box>
              <Typography
                sx={{
                  fontSize: "0.86rem",
                  color: TEXT.secondary,
                  lineHeight: 1.7,
                  maxWidth: 320,
                }}
              >
                {t("community.subtitle")}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 2.5 }}>
                {[
                  {
                    href: YOUTUBE_URL,
                    icon: <FaYoutube size={16} />,
                    label: t("community.youtube"),
                  },
                  {
                    href: FACEBOOK_PAGE_URL,
                    icon: <FaFacebookF size={14} />,
                    label: t("community.facebookPage"),
                  },
                  {
                    href: FACEBOOK_GROUP_URL,
                    icon: <FiUsers size={16} />,
                    label: t("community.facebookGroup"),
                  },
                ].map((social) => (
                  <Box
                    key={social.href}
                    component="a"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    sx={{
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      color: INK[800],
                      bgcolor: "#fff",
                      border: `1px solid ${BORDER.light}`,
                      textDecoration: "none",
                      transition:
                        "transform 0.25s ease, box-shadow 0.25s ease, color 0.25s ease",
                      "@media (prefers-reduced-motion: no-preference)": {
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: SHADOW.soft,
                        },
                      },
                      "&:hover": { color: BRAND.blue },
                    }}
                  >
                    {social.icon}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: TEXT.muted,
                  mb: 2,
                }}
              >
                {tFooter("exploreTitle")}
              </Typography>
              <Stack spacing={1.25}>
                {FOOTER_LINKS.map((link) => (
                  <Box
                    key={link.id}
                    component="a"
                    href={`#${link.id}`}
                    sx={{
                      fontSize: "0.86rem",
                      color: TEXT.secondary,
                      textDecoration: "none",
                      transition: "color 0.2s ease",
                      "&:hover": { color: BRAND.blue },
                    }}
                  >
                    {t(link.key)}
                  </Box>
                ))}
              </Stack>
            </Box>

            <Box>
              <Typography
                sx={{
                  fontSize: "0.64rem",
                  fontWeight: 800,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: TEXT.muted,
                  mb: 2,
                }}
              >
                {tFooter("contactTitle")}
              </Typography>
              <Stack spacing={1.25} alignItems="flex-start">
                <Box
                  component="a"
                  href={mailto()}
                  sx={{
                    fontSize: "0.86rem",
                    color: TEXT.secondary,
                    textDecoration: "none",
                    wordBreak: "break-all",
                    "&:hover": { color: BRAND.blue },
                  }}
                >
                  {CONTACT_EMAIL}
                </Box>
                <Typography sx={{ fontSize: "0.86rem", color: TEXT.secondary }}>
                  {t("hero.location")}
                </Typography>
                <Box
                  component={Link}
                  href="/login"
                  sx={{
                    mt: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.75,
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: INK[800],
                    textDecoration: "none",
                    "&:hover": { color: BRAND.blue },
                  }}
                >
                  {tFooter("signIn")}
                  <FiArrowUpRight size={14} />
                </Box>
              </Stack>
            </Box>
          </Box>

          <Box
            sx={{
              pt: 3,
              borderTop: `1px solid ${BORDER.light}`,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr auto 1fr" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.76rem",
                color: TEXT.muted,
                textAlign: { xs: "center", sm: "left" },
              }}
            >
              © {new Date().getFullYear()} {t("brand")} {t("brandTagline")}.{" "}
              {tFooter("rights")}
            </Typography>

            <Box sx={{ justifySelf: "center" }}>
              <DesignedByBadge />
            </Box>

            <Box
              aria-hidden
              sx={{
                width: 60,
                height: 3,
                borderRadius: 999,
                background: brandGradient,
                opacity: 0.6,
                justifySelf: { xs: "center", sm: "end" },
                display: { xs: "none", sm: "block" },
              }}
            />
          </Box>
        </Shell>
      </Box>
    </>
  );
}
