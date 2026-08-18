"use client";

/**
 * ANALYSIS — Credibility strip
 *
 * Was working: the motion gave the page a pulse right after the hero, and it
 * paused on hover.
 *
 * Was weak: it was padded out with recycled `features.*` and `courses.*`
 * strings — the exact copy that appears again two and three sections later, so
 * it read as filler rather than proof. Every item was the same icon-plus-two-
 * lines pill, 22 times.
 *
 * Plan: dedicated short proof points (new `landing.proof.*` keys), a single
 * compact line each, alternating topic accent colours, and a mask-driven edge
 * fade so the strip dissolves into the section rather than being clipped.
 */

import * as React from "react";
import { useTranslations } from "next-intl";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  FiAward,
  FiBookOpen,
  FiBriefcase,
  FiGlobe,
  FiHeadphones,
  FiMapPin,
  FiMessageCircle,
  FiMic,
  FiTarget,
  FiUsers,
} from "react-icons/fi";

import { Marquee } from "./primitives";
import { accentStyles, INK, type AccentTone } from "./tokens";

const ITEMS: Array<{ key: string; icon: React.ReactNode; tone: AccentTone }> = [
  { key: "item1", icon: <FiAward size={16} />, tone: "gold" },
  { key: "item2", icon: <FiMapPin size={16} />, tone: "blue" },
  { key: "item3", icon: <FiMic size={16} />, tone: "violet" },
  { key: "item4", icon: <FiMessageCircle size={16} />, tone: "coral" },
  { key: "item5", icon: <FiHeadphones size={16} />, tone: "cyan" },
  { key: "item6", icon: <FiUsers size={16} />, tone: "emerald" },
  { key: "item7", icon: <FiTarget size={16} />, tone: "gold" },
  { key: "item8", icon: <FiBriefcase size={16} />, tone: "blue" },
  { key: "item9", icon: <FiBookOpen size={16} />, tone: "violet" },
  { key: "item10", icon: <FiGlobe size={16} />, tone: "cyan" },
];

export default function ProofStrip() {
  const t = useTranslations("landing.proof");

  // Rendered twice so the marquee's -50% translate loops seamlessly.
  const loop = [...ITEMS, ...ITEMS];

  return (
    <Box
      component="section"
      aria-label="Highlights"
      sx={{
        bgcolor: INK[900],
        color: "#fff",
        py: { xs: 2, md: 2.5 },
        position: "relative",
        overflow: "hidden",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Marquee
        duration={52}
        fadeColor={INK[900]}
        fadeWidth={{ xs: 32, md: 160 }}
      >
        {loop.map((item, index) => {
          const a = accentStyles[item.tone];
          return (
            <Stack
              key={`${item.key}-${index}`}
              direction="row"
              spacing={1.25}
              alignItems="center"
              sx={{ flexShrink: 0, px: { xs: 2, md: 3 }, py: 0.75 }}
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
                  color: a.onDark,
                  bgcolor: a.bgDark,
                  border: `1px solid ${a.border}`,
                }}
              >
                {item.icon}
              </Box>
              <Typography
                sx={{
                  fontSize: { xs: "0.8rem", md: "0.86rem" },
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                {t(item.key)}
              </Typography>
              <Box
                aria-hidden
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.22)",
                  ml: { xs: 1, md: 2 },
                }}
              />
            </Stack>
          );
        })}
      </Marquee>
    </Box>
  );
}
