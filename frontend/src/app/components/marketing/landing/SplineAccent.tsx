"use client";

/**
 * Lazy Spline embed for the landing page's two signature 3D moments (hero and
 * Coming Soon). Everything else on the page stays flat/2D on purpose — the
 * brief asks for these to read as deliberate highlights, not decoration.
 *
 * HOW TO TURN THIS ON
 * -------------------
 * Publish a scene in the Spline editor, copy its `.splinecode` export URL, and
 * paste it into `SPLINE_SCENES` below. Until a URL is present the component
 * renders `<SoundwaveOrb />` instead, so the page is complete either way and no
 * third-party scene is embedded by default.
 *
 * WHY THE RUNTIME AND NOT `@splinetool/react-spline`
 * --------------------------------------------------
 * The React wrapper (v4.1.0) publishes an `exports` map with only `types` and
 * `import` conditions and no `require`/`default`, so Next's server module graph
 * cannot resolve it and `next build` fails with "Package path . is not exported"
 * (`transpilePackages` does not help — the condition is simply absent).
 * `@splinetool/runtime` exports both conditions correctly, and the wrapper is a
 * thin shell over its `Application` class, so we drive that directly. This also
 * makes the lazy-loading explicit rather than relying on `next/dynamic`.
 *
 * Loading strategy (the brief asks for lightweight + lazy):
 *  - the runtime is imported inside an effect, so webpack code-splits it and it
 *    never lands in the initial bundle or in the server render
 *  - the import is not triggered until the host scrolls within 300px of view
 *  - `prefers-reduced-motion` skips Spline entirely and keeps the static orb
 *  - any load failure falls back silently to the orb, which is already mounted
 */

import * as React from "react";
import Box from "@mui/material/Box";
import type { SxProps, Theme } from "@mui/material/styles";
import { useReducedMotion } from "framer-motion";

import SoundwaveOrb from "./SoundwaveOrb";

/**
 * Paste published `.splinecode` URLs here to activate the 3D scenes, e.g.
 * hero: "https://prod.spline.design/xxxxxxxx/scene.splinecode"
 */
export const SPLINE_SCENES = {
  hero: "",
  comingSoon: "",
} as const;

type Props = {
  /** Published `.splinecode` URL. Empty string renders the fallback orb. */
  scene?: string;
  /** Square size of the fallback orb, in CSS pixels. */
  fallbackSize?: number;
  fallbackVariant?: "light" | "dark";
  fallbackSpeed?: number;
  fallbackEmphasis?: boolean;
  sx?: SxProps<Theme>;
};

export default function SplineAccent({
  scene,
  fallbackSize = 360,
  fallbackVariant = "light",
  fallbackSpeed = 1,
  fallbackEmphasis = false,
  sx,
}: Props) {
  const reduce = useReducedMotion();
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [nearViewport, setNearViewport] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  const wantsSpline = Boolean(scene) && !reduce;

  // Only start loading once the host is close to the viewport.
  React.useEffect(() => {
    if (!wantsSpline || nearViewport) return;
    const node = hostRef.current;
    if (!node) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [wantsSpline, nearViewport]);

  React.useEffect(() => {
    if (!wantsSpline || !nearViewport) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let app: any = null;

    (async () => {
      try {
        const { Application } = await import("@splinetool/runtime");
        if (disposed) return;
        app = new Application(canvas);
        await app.load(scene as string);
        if (disposed) {
          app.dispose?.();
          return;
        }
        setReady(true);
      } catch {
        // Leave the fallback orb visible — it is already mounted underneath.
        setReady(false);
      }
    })();

    return () => {
      disposed = true;
      app?.dispose?.();
    };
  }, [wantsSpline, nearViewport, scene]);

  const showFallback = !wantsSpline || !ready;

  return (
    <Box
      ref={hostRef}
      sx={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: fallbackSize,
        height: fallbackSize,
        maxWidth: "100%",
        ...sx,
      }}
    >
      {/* The orb doubles as the Spline loading state, so there is never a gap. */}
      <Box
        sx={{
          gridArea: "1 / 1",
          opacity: showFallback ? 1 : 0,
          transition: "opacity 0.6s ease",
          pointerEvents: showFallback ? "auto" : "none",
        }}
      >
        <SoundwaveOrb
          size={fallbackSize}
          variant={fallbackVariant}
          speed={fallbackSpeed}
          emphasis={fallbackEmphasis}
        />
      </Box>

      {wantsSpline && (
        <Box
          aria-hidden
          sx={{
            gridArea: "1 / 1",
            width: "100%",
            height: "100%",
            opacity: ready ? 1 : 0,
            transition: "opacity 0.8s ease",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </Box>
      )}
    </Box>
  );
}
