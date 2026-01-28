import SegmentPlayer from "../media/SegmentPlayer";
import { Lesson } from "@/app/Types";
import { useState, useRef, useEffect } from "react";
import ToggleButtons from "./ToggleButtons";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { FiMaximize2, FiX } from "react-icons/fi";

export enum ToggleState {
  SHOW_BOTH,
  SHOW_VIDEO_ONLY,
  SHOW_SCRIPT_ONLY,
}

export default function VideoScriptToggle({
  selectedLesson,
}: {
  selectedLesson: Lesson;
}) {
  const [toggleState, setToggleState] = useState<ToggleState>(
    ToggleState.SHOW_BOTH
  );
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Track fullscreen state
  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  function updateToggleState(newState: ToggleState) {
    setToggleState(newState);
  }

  async function handleFullscreen() {
    const container = imageContainerRef.current;
    if (!container) return;

    try {
      await container.requestFullscreen();
      // Try to lock to landscape (works on mobile if supported)
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (orientation: string) => Promise<void>;
      };
      if (orientation?.lock) {
        await orientation.lock("landscape").catch(() => {
          // Orientation lock not supported or failed - that's ok
        });
      }
    } catch {
      // Fullscreen not supported
    }
  }

  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mb: 2,
        }}
      >
        {/* Video section */}
        {(toggleState === ToggleState.SHOW_BOTH ||
          toggleState === ToggleState.SHOW_VIDEO_ONLY) && (
          <Paper sx={{ overflow: "hidden", borderRadius: 2 }}>
            <SegmentPlayer selectedLesson={selectedLesson} />
          </Paper>
        )}

        {/* Script/Image section - no maxHeight, shows full size */}
        {(toggleState === ToggleState.SHOW_BOTH ||
          toggleState === ToggleState.SHOW_SCRIPT_ONLY) && (
          <Paper
            ref={imageContainerRef}
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              position: "relative",
              // Fullscreen styles
              "&:fullscreen": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "black",
              },
              "&:fullscreen img": {
                maxHeight: "100vh",
                width: "auto",
                maxWidth: "100vw",
              },
            }}
          >
            {/* Fullscreen button - mobile only */}
            {!isFullscreen && (
              <IconButton
                onClick={handleFullscreen}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  bgcolor: "rgba(0,0,0,0.6)",
                  color: "white",
                  display: { xs: "flex", sm: "none" },
                  "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                  zIndex: 1,
                }}
                size="small"
              >
                <FiMaximize2 size={20} />
              </IconButton>
            )}
            {/* Exit fullscreen button - shows when in fullscreen */}
            {isFullscreen && (
              <IconButton
                onClick={exitFullscreen}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: "rgba(255,255,255,0.9)",
                  color: "black",
                  "&:hover": { bgcolor: "white" },
                  zIndex: 1,
                }}
                size="large"
              >
                <FiX size={28} />
              </IconButton>
            )}
            <Box
              component="img"
              src={selectedLesson.image}
              alt={`${selectedLesson.title} Practice lesson image`}
              sx={{
                width: "100%",
                height: "auto",
                display: "block",
              }}
            />
          </Paper>
        )}
      </Box>

      <ToggleButtons
        toggleState={toggleState}
        updateToggleState={updateToggleState}
      />
    </Box>
  );
}
