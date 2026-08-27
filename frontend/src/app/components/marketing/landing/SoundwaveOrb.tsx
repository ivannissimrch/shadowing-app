"use client";

/**
 * Animated soundwave orb — the fallback that renders wherever a Spline scene is
 * not configured (see SplineAccent.tsx), and the reduced-motion substitute.
 *
 * It echoes the ShadowSpeak logo: radial bars pulsing between two head profiles,
 * drawn on a blue -> violet ramp. Deliberately a plain 2D canvas — no WebGL, no
 * extra bundle weight — so it is safe to render on first paint.
 *
 * Behaviour:
 *  - requestAnimationFrame is only running while the orb is on screen
 *  - bars bulge toward the pointer (mouse only)
 *  - under prefers-reduced-motion it paints a single static frame
 */

import * as React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { useReducedMotion } from "framer-motion";

type Props = {
  /**
   * Upper bound for the rendered size in CSS pixels. The orb fills its
   * container and is measured with a ResizeObserver, so it stays inside
   * responsive parents instead of overflowing on small screens.
   */
  size?: number;
  /** Number of radial bars. */
  bars?: number;
  /** "light" sits on pale surfaces, "dark" on the navy sections. */
  variant?: "light" | "dark";
  /** Base animation speed multiplier. */
  speed?: number;
  /** Stronger strokes and glow — for hero portrait halos. */
  emphasis?: boolean;
  sx?: SxProps<Theme>;
};

const RAMP: Record<"light" | "dark", [string, string, string]> = {
  light: ["#2B7FFF", "#5B5BF0", "#8B5CF6"],
  dark: ["#7FB2FF", "#9E8BFF", "#C4A6FF"],
};

/** Mixes two hex colours. `t` in [0,1]. */
function mix(a: string, b: string, t: number) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${p[0]},${p[1]},${p[2]})`;
}

function rampAt(variant: "light" | "dark", t: number) {
  const [c0, c1, c2] = RAMP[variant];
  return t < 0.5 ? mix(c0, c1, t * 2) : mix(c1, c2, (t - 0.5) * 2);
}

export default function SoundwaveOrb({
  size = 360,
  bars = 96,
  variant = "light",
  speed = 1,
  emphasis = false,
  sx,
}: Props) {
  const reduce = useReducedMotion();
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const pointerRef = React.useRef({ angle: 0, strength: 0 });
  const frameRef = React.useRef<number | null>(null);
  const visibleRef = React.useRef(true);

  // Actual painted size: the smaller of the container box and `size`.
  const [box, setBox] = React.useState(size);

  React.useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const next = Math.max(1, Math.min(size, width || size, height || size));
      setBox((prev) => (Math.abs(prev - next) > 1 ? next : prev));
    });
    ro.observe(host);
    return () => ro.disconnect();
  }, [size]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = box * dpr;
    canvas.height = box * dpr;
    ctx.scale(dpr, dpr);

    const cx = box / 2;
    const cy = box / 2;
    const innerR = box * (emphasis ? 0.28 : 0.235);
    const maxBar = box * (emphasis ? 0.24 : 0.2);

    const draw = (time: number) => {
      ctx.clearRect(0, 0, box, box);

      const t = time * 0.001 * speed;
      const { angle: pAngle, strength: pStrength } = pointerRef.current;

      // Soft core glow behind the bars.
      const glow = ctx.createRadialGradient(
        cx,
        cy,
        innerR * 0.2,
        cx,
        cy,
        innerR * 1.9
      );
      glow.addColorStop(
        0,
        variant === "dark"
          ? "rgba(139,92,246,0.30)"
          : emphasis
            ? "rgba(43,127,255,0.32)"
            : "rgba(43,127,255,0.18)"
      );
      glow.addColorStop(1, "rgba(43,127,255,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, innerR * 1.9, 0, Math.PI * 2);
      ctx.fill();

      // Inner ring.
      ctx.beginPath();
      ctx.arc(cx, cy, innerR, 0, Math.PI * 2);
      ctx.strokeStyle =
        variant === "dark"
          ? "rgba(255,255,255,0.16)"
          : emphasis
            ? "rgba(43,127,255,0.28)"
            : "rgba(10,37,64,0.10)";
      ctx.lineWidth = emphasis ? 1.5 : 1;
      ctx.stroke();

      for (let i = 0; i < bars; i += 1) {
        const ratio = i / bars;
        const angle = ratio * Math.PI * 2 - Math.PI / 2;

        // Three layered sines give an organic, non-repeating waveform.
        const wave =
          Math.sin(ratio * Math.PI * 8 + t * 1.7) * 0.5 +
          Math.sin(ratio * Math.PI * 14 - t * 1.1) * 0.32 +
          Math.sin(ratio * Math.PI * 3 + t * 0.6) * 0.42;

        // Pointer proximity bulge, wrapped across the seam.
        let delta = Math.abs(angle - pAngle);
        if (delta > Math.PI) delta = Math.PI * 2 - delta;
        const bulge = pStrength * Math.max(0, 1 - delta / 0.9) ** 2;

        const amp = Math.max(0.1, 0.42 + wave * 0.34 + bulge * 0.85);
        const len = maxBar * amp;

        const x0 = cx + Math.cos(angle) * innerR;
        const y0 = cy + Math.sin(angle) * innerR;
        const x1 = cx + Math.cos(angle) * (innerR + len);
        const y1 = cy + Math.sin(angle) * (innerR + len);

        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = rampAt(variant, ratio);
        ctx.globalAlpha = emphasis ? 0.55 + amp * 0.45 : 0.35 + amp * 0.55;
        ctx.lineWidth = box * (emphasis ? 0.0105 : 0.0075);
        ctx.lineCap = "round";
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Decay the pointer bulge so the orb settles when the cursor leaves.
      pointerRef.current.strength *= 0.94;
    };

    if (reduce) {
      // Single static frame — no rAF loop at all.
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
  }, [box, bars, variant, speed, emphasis, reduce]);

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (reduce || event.pointerType !== "mouse") return;
      const rect = event.currentTarget.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      pointerRef.current = {
        angle: Math.atan2(dy, dx),
        strength: Math.min(1, Math.hypot(dx, dy) / (rect.width / 2)),
      };
    },
    [reduce]
  );

  return (
    <Box
      ref={hostRef}
      aria-hidden
      onPointerMove={handlePointerMove}
      sx={{
        width: "100%",
        height: "100%",
        maxWidth: size,
        maxHeight: size,
        display: "grid",
        placeItems: "center",
        pointerEvents: "auto",
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
