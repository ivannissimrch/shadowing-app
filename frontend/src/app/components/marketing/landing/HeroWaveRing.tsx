"use client";

/**
 * Radial waveform ring that haloes the hero portrait.
 *
 * Same engine as `SoundwaveOrb` (plain 2D canvas, rAF only while on screen, a
 * single static frame under reduced-motion) but with a *ring* geometry: the
 * bars start just outside the portrait and radiate outward, and their alpha is
 * weighted toward the left of the circle so the waveform reads as an accent
 * beside the photo instead of a full donut around it.
 *
 * Hero-only — nothing else on the landing page imports this.
 */

import * as React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { useReducedMotion } from "framer-motion";

type Props = {
  /** Upper bound for the painted square, in CSS pixels. Fills its parent. */
  size?: number;
  /** Bar count around the full circle. */
  bars?: number;
  /** Ring inner radius as a fraction of the painted box. */
  innerRatio?: number;
  /** Maximum bar length as a fraction of the painted box. */
  barRatio?: number;
  sx?: SxProps<Theme>;
};

/** Blue -> indigo -> violet, matching the logo ramp. */
const RAMP: [string, string, string] = ["#2B7FFF", "#5B5BF0", "#8B5CF6"];

function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${p[0]},${p[1]},${p[2]})`;
}

function rampAt(t: number) {
  const [c0, c1, c2] = RAMP;
  return t < 0.5 ? mix(c0, c1, t * 2) : mix(c1, c2, (t - 0.5) * 2);
}

export default function HeroWaveRing({
  size = 560,
  bars = 132,
  innerRatio = 0.365,
  barRatio = 0.075,
  sx,
}: Props) {
  const reduce = useReducedMotion();
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const frameRef = React.useRef<number | null>(null);
  const visibleRef = React.useRef(true);

  // 0 until measured: painting before the host has a real box would size the
  // canvas from `size` and overflow the responsive parent.
  const [box, setBox] = React.useState(0);

  // Measure the host so the ring scales with its responsive parent.
  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const measured = Math.min(width, height);
      if (!measured) return;
      const next = Math.max(1, Math.min(size, measured));
      setBox((prev) => (Math.abs(prev - next) > 1 ? next : prev));
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [size]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !box) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = box * dpr;
    canvas.height = box * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = box / 2;
    const cy = box / 2;
    const innerR = box * innerRatio;
    const maxBar = box * barRatio;
    const lineWidth = Math.max(1.1, box * 0.0055);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, box, box);
      const t = time * 0.001;

      for (let i = 0; i < bars; i += 1) {
        const ratio = i / bars;
        // Start at the left of the circle so the ramp reads blue -> violet
        // across the visible (left) arc.
        const angle = ratio * Math.PI * 2 + Math.PI;

        // Three layered sines: organic, non-repeating waveform.
        const wave =
          Math.sin(ratio * Math.PI * 10 + t * 1.5) * 0.5 +
          Math.sin(ratio * Math.PI * 17 - t * 0.9) * 0.3 +
          Math.sin(ratio * Math.PI * 4 + t * 0.55) * 0.4;

        const amp = Math.max(0.08, 0.4 + wave * 0.36);
        const len = maxBar * amp;

        // Left-weighted visibility: full on the left arc, a whisper on the right
        // where the portrait and the floating cards sit.
        const facing = (1 - Math.cos(angle)) / 2;
        const weight = 0.04 + facing ** 3.4 * 0.96;

        const x0 = cx + Math.cos(angle) * innerR;
        const y0 = cy + Math.sin(angle) * innerR;
        const x1 = cx + Math.cos(angle) * (innerR + len);
        const y1 = cy + Math.sin(angle) * (innerR + len);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = rampAt(ratio);
        ctx.globalAlpha = weight * (0.34 + amp * 0.42);
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    if (reduce) {
      draw(0);
      return;
    }

    const loop = (time: number) => {
      if (visibleRef.current) draw(time);
      frameRef.current = requestAnimationFrame(loop);
    };
    frameRef.current = requestAnimationFrame(loop);

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      io.disconnect();
    };
  }, [box, bars, innerRatio, barRatio, reduce]);

  return (
    <Box
      ref={hostRef}
      aria-hidden
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: size,
        maxHeight: size,
        display: "grid",
        placeItems: "center",
        pointerEvents: "none",
        ...sx,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: box, height: box, display: "block" }}
      />
    </Box>
  );
}
