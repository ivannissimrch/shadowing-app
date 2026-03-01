"use client";
import {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import type { LocalSegment } from "@/app/hooks/useAudioSegmenter";
import type WaveSurfer from "wavesurfer.js";
import type RegionsPlugin from "wavesurfer.js/dist/plugins/regions";
import type { Region } from "wavesurfer.js/dist/plugins/regions";

const REGION_COLORS = [
  "rgba(25, 118, 210, 0.2)",
  "rgba(76, 175, 80, 0.2)",
  "rgba(255, 152, 0, 0.2)",
  "rgba(156, 39, 176, 0.2)",
  "rgba(0, 150, 136, 0.2)",
  "rgba(244, 67, 54, 0.2)",
];

export interface WaveformPlayerRef {
  getCurrentTime: () => number;
  getDuration: () => number;
  playRegion: (id: string) => void;
  stop: () => void;
  isPlaying: () => boolean;
}

interface WaveformPlayerProps {
  audioUrl: string;
  segments: LocalSegment[];
  onRegionUpdated: (id: string, start: number, end: number) => void;
  onPlaybackEnd?: () => void;
}

const WaveformPlayer = forwardRef<WaveformPlayerRef, WaveformPlayerProps>(
  ({ audioUrl, segments, onRegionUpdated, onPlaybackEnd }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const wavesurferRef = useRef<WaveSurfer | null>(null);
    const regionsPluginRef = useRef<RegionsPlugin | null>(null);
    const regionMapRef = useRef<Map<string, Region>>(new Map());
    const regionLabelsRef = useRef<Map<string, string>>(new Map());
    const activeRegionIdRef = useRef<string | null>(null);
    const activeRegionEndRef = useRef<number | null>(null);
    const isActiveRef = useRef(false);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);

    // Use refs for callbacks to avoid re-creating wavesurfer on callback changes
    const onRegionUpdatedRef = useRef(onRegionUpdated);
    onRegionUpdatedRef.current = onRegionUpdated;
    const onPlaybackEndRef = useRef(onPlaybackEnd);
    onPlaybackEndRef.current = onPlaybackEnd;

    useImperativeHandle(ref, () => ({
      getCurrentTime: () => wavesurferRef.current?.getCurrentTime() ?? 0,
      getDuration: () => wavesurferRef.current?.getDuration() ?? 0,
      playRegion: (id: string) => {
        const region = regionMapRef.current.get(id);
        if (region) {
          activeRegionIdRef.current = id;
          activeRegionEndRef.current = region.end;
          isActiveRef.current = true;
          region.play();
        }
      },
      stop: () => {
        activeRegionIdRef.current = null;
        activeRegionEndRef.current = null;
        isActiveRef.current = false;
        wavesurferRef.current?.pause();
      },
      isPlaying: () => isActiveRef.current,
    }));

    // Initialize wavesurfer (only on mount or audioUrl change)
    useEffect(() => {
      if (!containerRef.current) return;

      let destroyed = false;

      async function init() {
        const WaveSurfer = (await import("wavesurfer.js")).default;
        const RegionsPlugin = (
          await import("wavesurfer.js/dist/plugins/regions")
        ).default;

        if (destroyed) return;

        console.log("[WaveformPlayer] Loading audio from:", audioUrl);

        // Use HTML5 audio element for playback (browser decodes correctly)
        const audio = new Audio(audioUrl);
        audio.crossOrigin = "anonymous";

        const ws = WaveSurfer.create({
          container: containerRef.current!,
          waveColor: "#b0bec5",
          progressColor: "#1976d2",
          cursorColor: "#1976d2",
          height: 100,
          media: audio,
          barWidth: 2,
          barGap: 1,
          barRadius: 2,
        });

        const regionsPlugin = ws.registerPlugin(RegionsPlugin.create());

        wavesurferRef.current = ws;
        regionsPluginRef.current = regionsPlugin;

        ws.on("ready", () => {
          if (!destroyed) {
            setIsLoading(false);
          }
        });

        ws.on("error", (err: Error) => {
          if (!destroyed) {
            console.error("[WaveformPlayer] Error:", err.message, "URL:", audioUrl);
            setIsLoading(false);
            setLoadError(`${err.message} — URL: ${audioUrl}`);
          }
        });

        // When user drags/resizes a region, update React state
        regionsPlugin.on("region-updated", (region: Region) => {
          onRegionUpdatedRef.current(region.id, region.start, region.end);
        });

        // Stop playback when the active region's end time is reached
        ws.on("timeupdate", (time: number) => {
          if (
            !destroyed &&
            activeRegionEndRef.current !== null &&
            time >= activeRegionEndRef.current
          ) {
            activeRegionIdRef.current = null;
            activeRegionEndRef.current = null;
            isActiveRef.current = false;
            ws.pause();
            onPlaybackEndRef.current?.();
          }
        });
      }

      init();

      const currentRegionMap = regionMapRef.current;

      return () => {
        destroyed = true;
        wavesurferRef.current?.destroy();
        wavesurferRef.current = null;
        regionsPluginRef.current = null;
        currentRegionMap.clear();
      };
    }, [audioUrl]);

    // Declarative region sync: diff segments vs current regions
    useEffect(() => {
      if (!regionsPluginRef.current || isLoading) return;

      const currentRegions = regionMapRef.current;
      const newIds = new Set(segments.map((s) => s.id));

      // Remove regions for deleted segments
      for (const [id, region] of currentRegions) {
        if (!newIds.has(id)) {
          region.remove();
          currentRegions.delete(id);
          regionLabelsRef.current.delete(id);
        }
      }

      // Add new regions, update labels for existing ones
      segments.forEach((segment, index) => {
        const existing = currentRegions.get(segment.id);
        if (existing) {
          // Only call setOptions when label actually changed - skip during drag
          const prevLabel = regionLabelsRef.current.get(segment.id) ?? "";
          const newLabel = segment.label ?? "";
          if (prevLabel !== newLabel) {
            existing.setOptions({ content: newLabel || undefined });
            regionLabelsRef.current.set(segment.id, newLabel);
          }
        } else {
          // New region
          const region = regionsPluginRef.current!.addRegion({
            id: segment.id,
            start: segment.start_time,
            end: segment.end_time,
            color: REGION_COLORS[index % REGION_COLORS.length],
            drag: true,
            resize: true,
            content: segment.label || undefined,
          });
          regionMapRef.current.set(segment.id, region);
          regionLabelsRef.current.set(segment.id, segment.label ?? "");
        }
      });
    }, [segments, isLoading]);

    return (
      <Box sx={{ position: "relative" }}>
        <Box ref={containerRef} sx={{ minHeight: 100 }} />
        {isLoading && !loadError && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          >
            <CircularProgress size={24} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Loading waveform...
            </Typography>
          </Box>
        )}
        {loadError && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "action.hover",
              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color="error">
              Audio failed to load: {loadError}
            </Typography>
          </Box>
        )}
      </Box>
    );
  }
);

WaveformPlayer.displayName = "WaveformPlayer";
export default WaveformPlayer;
