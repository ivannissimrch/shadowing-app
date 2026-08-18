"use client";

/**
 * ANALYSIS — Navigation
 *
 * Was working: fixed header, translucency that reacted to scroll, logo, both a
 * sign-in and a primary CTA, and a dark utility bar with contact details.
 *
 * Was weak:
 *  - no mobile navigation at all. The links were `display:none` below `lg` with
 *    no hamburger, so on phones and tablets the page had zero navigation.
 *  - the active link was hardcoded to "#home" and never tracked scroll position.
 *  - the utility bar (and with it the contact email) vanished on mobile.
 *  - glass was a flat white wash with no saturation, and there was no reading
 *    progress signal on a page this long.
 *
 * Plan: keep the fixed glass header, add a real mobile drawer, drive the active
 * link from an IntersectionObserver scroll-spy, thicken the glass on scroll
 * (blur + saturate + layered border), and add a brand-gradient scroll progress
 * rail across the bottom edge of the header.
 *
 * `LanguageSwitcher` is imported from `components/ui` and used unmodified — it
 * is shared with the authenticated app, so it must not be restyled here.
 */

import * as React from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useSpring } from "framer-motion";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import {
  FiMail,
  FiMapPin,
  FiMenu,
  FiX,
  FiArrowRight,
  FiArrowUpRight,
} from "react-icons/fi";
import { FaFacebookF, FaYoutube } from "react-icons/fa";

import LanguageSwitcher from "../../ui/LanguageSwitcher";
import { CONTACT_EMAIL, FACEBOOK_PAGE_URL, YOUTUBE_URL, mailto } from "./links";
import { BrandButton, GoldButton, Magnetic } from "./primitives";
import {
  BORDER,
  BRAND,
  brandGradient,
  buttonLiftSx,
  EASE,
  GOLD,
  INK,
  shellSx,
  SHADOW,
  TEXT,
} from "./tokens";

const MotionBox = motion.create(Box);

/** Section ids in document order — also the scroll-spy targets. */
const NAV_ITEMS = [
  { id: "home", key: "home" },
  { id: "courses", key: "courses" },
  { id: "coaching", key: "coaching" },
  { id: "testimonials", key: "testimonials" },
  { id: "about", key: "about" },
  { id: "contact", key: "contact" },
] as const;

/** Height of the desktop-only utility bar, in px. */
const UTILITY_H = 38;

function useActiveSection() {
  const [active, setActive] = React.useState<string>("home");

  React.useEffect(() => {
    const targets = NAV_ITEMS.map(({ id }) =>
      document.getElementById(id)
    ).filter((el): el is HTMLElement => Boolean(el));
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that is visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function LandingNav() {
  const t = useTranslations("landing");
  const [scrolled, setScrolled] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const active = useActiveSection();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = NAV_ITEMS.map(({ id, key }) => ({
    id,
    href: `#${id}`,
    label: t(`nav.${key}`),
  }));

  return (
    <>
      {/* Utility bar — desktop only, but its contents reappear in the drawer. */}
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: INK[900],
          color: "#fff",
          display: { xs: "none", md: "block" },
        }}
      >
        <Box sx={shellSx}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ minHeight: UTILITY_H }}
          >
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={0.75} alignItems="center">
                <FiMapPin size={12} color={GOLD.main} />
                <Typography sx={{ fontSize: "0.72rem", opacity: 0.86 }}>
                  {t("hero.location")}
                </Typography>
              </Stack>
              <Typography
                component="a"
                href={mailto()}
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  fontSize: "0.72rem",
                  color: "#fff",
                  textDecoration: "none",
                  opacity: 0.86,
                  transition: "color 0.2s ease, opacity 0.2s ease",
                  "&:hover": { color: GOLD.main, opacity: 1 },
                }}
              >
                <FiMail size={12} color={GOLD.main} />
                {CONTACT_EMAIL}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Typography sx={{ fontSize: "0.72rem", opacity: 0.6 }}>
                {t("hero.followUs")}
              </Typography>
              {[
                {
                  href: YOUTUBE_URL,
                  icon: <FaYoutube size={13} />,
                  label: t("community.youtube"),
                },
                {
                  href: FACEBOOK_PAGE_URL,
                  icon: <FaFacebookF size={12} />,
                  label: t("community.facebookPage"),
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
                    width: 24,
                    height: 24,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: "50%",
                    color: "#fff",
                    opacity: 0.7,
                    transition: "opacity 0.2s ease, background-color 0.2s ease",
                    "&:hover": { opacity: 1, bgcolor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  {social.icon}
                </Box>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Box>

      {/* Main header */}
      <Box
        component={motion.header}
        initial={{ y: -12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
        sx={{
          position: "fixed",
          top: { xs: 0, md: `${UTILITY_H}px` },
          left: 0,
          right: 0,
          zIndex: 1100,
          bgcolor: scrolled
            ? "rgba(255,255,255,0.72)"
            : "rgba(255,255,255,0.94)",
          backdropFilter: `blur(${scrolled ? 24 : 12}px) saturate(180%)`,
          WebkitBackdropFilter: `blur(${scrolled ? 24 : 12}px) saturate(180%)`,
          borderBottom: `1px solid ${scrolled ? "rgba(10,37,64,0.08)" : BORDER.light}`,
          boxShadow: scrolled ? SHADOW.soft : "none",
          transition:
            "background-color 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
        }}
      >
        <Box sx={shellSx}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              alignItems: "center",
              gap: 2,
              minHeight: { xs: 60, md: 72 },
            }}
          >
            <Box
              component="a"
              href="#home"
              aria-label={t("brand")}
              sx={{
                position: "relative",
                height: { xs: 34, sm: 42 },
                width: { xs: 142, sm: 182 },
                display: "block",
                flexShrink: 0,
              }}
            >
              <Image
                src="/logo.png"
                alt={t("brand")}
                fill
                sizes="182px"
                style={{ objectFit: "contain", objectPosition: "left center" }}
                priority
              />
            </Box>

            {/* Desktop links */}
            <Stack
              component="nav"
              direction="row"
              spacing={0.5}
              justifyContent="center"
              sx={{ display: { xs: "none", lg: "flex" } }}
            >
              {navLinks.map(({ id, href, label }) => {
                const isActive = active === id;
                return (
                  <Box
                    key={id}
                    component="a"
                    href={href}
                    aria-current={isActive ? "true" : undefined}
                    sx={{
                      position: "relative",
                      px: 1.75,
                      py: 1,
                      fontSize: "0.84rem",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? INK[800] : TEXT.secondary,
                      textDecoration: "none",
                      borderRadius: 999,
                      transition:
                        "color 0.25s ease, background-color 0.25s ease",
                      "&:hover": {
                        color: INK[800],
                        bgcolor: "rgba(43,127,255,0.07)",
                      },
                    }}
                  >
                    {label}
                    {isActive && (
                      <MotionBox
                        layoutId="nav-active-pill"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 32,
                        }}
                        sx={{
                          position: "absolute",
                          left: 14,
                          right: 14,
                          bottom: 2,
                          height: 2,
                          borderRadius: 999,
                          background: brandGradient,
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Stack>

            {/* Right cluster */}
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ flexShrink: 0 }}
            >
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <LanguageSwitcher />
              </Box>

              <Button
                component={Link}
                href="/login"
                variant="text"
                sx={{
                  color: INK[800],
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "none",
                  px: 1.5,
                  display: { xs: "none", md: "inline-flex" },
                  "&:hover": { bgcolor: "rgba(10,37,64,0.05)" },
                }}
              >
                {t("signIn")}
              </Button>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                {/* Brand-gradient pill, matching the hero's primary CTA. */}
                <Magnetic strength={0.18}>
                  <BrandButton
                    size="md"
                    href={mailto(t("hero.cta"))}
                    endIcon={<FiArrowRight size={15} />}
                  >
                    {t("hero.cta")}
                  </BrandButton>
                </Magnetic>
              </Box>

              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                sx={{
                  display: { xs: "inline-flex", lg: "none" },
                  color: INK[800],
                  border: `1px solid ${BORDER.light}`,
                  borderRadius: 2,
                }}
              >
                <FiMenu size={20} />
              </IconButton>
            </Stack>
          </Box>
        </Box>

        {/* Reading progress rail */}
        <MotionBox
          aria-hidden
          style={{ scaleX: progress }}
          sx={{
            transformOrigin: "0% 50%",
            height: 2,
            background: brandGradient,
          }}
        />
      </Box>

      {/* Mobile drawer — the navigation that did not exist before */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: { xs: "86vw", sm: 380 },
              bgcolor: INK[900],
              color: "#fff",
              backgroundImage: `radial-gradient(ellipse at 100% 0%, ${BRAND.violet}33 0%, transparent 55%)`,
              px: 3,
              py: 2.5,
            },
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 3 }}
        >
          <Box sx={{ position: "relative", width: 150, height: 34 }}>
            <Image
              src="/logo.png"
              alt={t("brand")}
              fill
              sizes="150px"
              style={{ objectFit: "contain", objectPosition: "left center" }}
            />
          </Box>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            sx={{ color: "#fff" }}
          >
            <FiX size={22} />
          </IconButton>
        </Stack>

        <Stack component="nav" spacing={0.5} sx={{ mb: 3 }}>
          {navLinks.map(({ id, href, label }, index) => (
            <Box
              key={id}
              component={motion.a}
              href={href}
              onClick={() => setDrawerOpen(false)}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.06 * index, duration: 0.35, ease: EASE }}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.5,
                px: 1.5,
                borderRadius: 2,
                color: active === id ? GOLD.main : "#fff",
                textDecoration: "none",
                fontSize: "1.05rem",
                fontWeight: active === id ? 700 : 500,
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                transition: "background-color 0.2s ease",
                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
              }}
            >
              {label}
              <FiArrowUpRight size={16} opacity={0.5} />
            </Box>
          ))}
        </Stack>

        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <GoldButton
            size="md"
            fullWidth
            href={mailto(t("hero.cta"))}
            endIcon={<FiArrowRight size={16} />}
            sx={{ width: "100%" }}
          >
            {t("hero.cta")}
          </GoldButton>
          <Button
            component={Link}
            href="/login"
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "rgba(255,255,255,0.28)",
              color: "#fff",
              borderRadius: 999,
              py: 1.15,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                borderColor: "rgba(255,255,255,0.5)",
                bgcolor: "rgba(255,255,255,0.06)",
              },
              ...buttonLiftSx,
            }}
          >
            {t("signIn")}
          </Button>
        </Stack>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 2.5 }} />

        {/* Utility-bar content, which used to disappear entirely on mobile. */}
        <Stack spacing={1.75}>
          <Typography
            component="a"
            href={mailto()}
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              color: "#fff",
              opacity: 0.8,
              fontSize: "0.85rem",
              textDecoration: "none",
              wordBreak: "break-all",
              "&:hover": { color: GOLD.main },
            }}
          >
            <FiMail size={14} color={GOLD.main} />
            {CONTACT_EMAIL}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FiMapPin size={14} color={GOLD.main} />
            <Typography sx={{ fontSize: "0.85rem", opacity: 0.8 }}>
              {t("hero.location")}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{ pt: 0.5 }}
          >
            <LanguageSwitcher />
            <Box
              component="a"
              href={YOUTUBE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("community.youtube")}
              sx={{
                color: "#fff",
                opacity: 0.75,
                display: "grid",
                placeItems: "center",
                "&:hover": { opacity: 1 },
              }}
            >
              <FaYoutube size={18} />
            </Box>
            <Box
              component="a"
              href={FACEBOOK_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("community.facebookPage")}
              sx={{
                color: "#fff",
                opacity: 0.75,
                display: "grid",
                placeItems: "center",
                "&:hover": { opacity: 1 },
              }}
            >
              <FaFacebookF size={16} />
            </Box>
          </Stack>
        </Stack>
      </Drawer>

      {/* Spacer so content clears the fixed header. */}
      <Box aria-hidden sx={{ height: { xs: 60, md: 72 + UTILITY_H } }} />
    </>
  );
}
