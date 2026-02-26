import SegmentPlayer from "../media/SegmentPlayer";
import FeedbackReplyThread from "@/app/components/feedback/FeedbackReplyThread";
import { useAuthContext } from "@/app/AuthContext";
import { Lesson } from "@/app/Types";
import { API_PATHS } from "@/app/constants/apiKeys";
import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import DOMPurify from "dompurify";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { FiMaximize2, FiX } from "react-icons/fi";
import { usePersistedState } from "@/app/hooks/usePersistedState";

export default function VideoScriptToggle({
  selectedLesson,
  belowVideo,
  hideFeedback = false,
}: {
  selectedLesson: Lesson;
  belowVideo?: React.ReactNode;
  hideFeedback?: boolean;
}) {
  const tTeacher = useTranslations("teacher");
  const { token } = useAuthContext();
  const currentUserId = token
    ? JSON.parse(atob(token.split(".")[1])).id
    : undefined;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = usePersistedState("fontSize", 1.3);

  useEffect(() => {
    function handleFullscreenChange() {
      setIsFullscreen(!!document.fullscreenElement);
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function handleFullscreen() {
    const container = imageContainerRef.current;
    if (!container) return;

    try {
      await container.requestFullscreen();
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (orientation: string) => Promise<void>;
      };
      if (orientation?.lock) {
        await orientation.lock("landscape").catch(() => {});
      }
    } catch {}
  }

  function exitFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }

  function increaseFontSize() {
    setFontSize((prev) => Math.min(prev + 0.1, 2));
  }

  function decreaseFontSize() {
    setFontSize((prev) => Math.max(prev - 0.1, 0.8));
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          alignItems: { xs: "start", lg: "stretch" },
          gap: 3,
          flex: { lg: 1 },
          minHeight: { lg: 0 },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            minHeight: { lg: 0 },
            overflow: { lg: "hidden" },
          }}
        >
          <Paper
            sx={{
              overflow: "hidden",
              borderRadius: 2,
              boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
              bgcolor: "#ffffff",
              flex: { lg: 1 },
              minHeight: { lg: 0 },
              display: { lg: "flex" },
              flexDirection: { lg: "column" },
            }}
          >
            <SegmentPlayer selectedLesson={selectedLesson} />
          </Paper>
          {belowVideo}
        </Box>

        <Paper
          ref={imageContainerRef}
          sx={{
            overflow: "hidden",
            overflowY: { lg: "auto" },
            borderRadius: 2,
            boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)",
            position: "relative",
            height: { lg: 0 },
            minHeight: { lg: "100%" },
            ...(selectedLesson.script_type === "text" && {
              bgcolor: "#ffffff",
            }),
            "&:fullscreen": {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor:
                selectedLesson.script_type === "text" ? "white" : "black",
              overflow: "auto",
            },
            "&:fullscreen img": {
              maxHeight: "100vh",
              width: "auto",
              maxWidth: "100vw",
            },
            "&:fullscreen > div": {
              maxWidth: "800px",
              fontSize: "1.3rem",
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
          {selectedLesson.script_type === "text" &&
            selectedLesson.script_text && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 0.5,
                  px: 2,
                  py: 0.5,
                  borderBottom: "1px solid #e0e0e0",
                }}
              >
                <IconButton
                  size="small"
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: "#e0e0e0",
                    color: "#1a1a1a",
                    borderRadius: 1,
                    px: 1,
                    minWidth: 32,
                  }}
                  onClick={decreaseFontSize}
                >
                  A-
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    border: "1px solid",
                    borderColor: "#e0e0e0",
                    color: "#1a1a1a",
                    borderRadius: 1,
                    px: 1,
                    minWidth: 32,
                  }}
                  onClick={increaseFontSize}
                >
                  A+
                </IconButton>
              </Box>
            )}
          {selectedLesson.script_type === "text" &&
          selectedLesson.script_text ? (
            <Box
              sx={{
                p: 2,
                pt: 1,
                fontFamily: "Verdana, sans-serif",
                fontSize: `${fontSize ?? 1.8}rem`,
                lineHeight: 1.8,
                height: { xs: "auto", lg: "100%" },
                bgcolor: "#ffffff",
                color: "#1a1a1a",
                "& p": { mb: 1, mt: 0 },
                "& *": { fontSize: "inherit !important" },
                "& ul, & ol": { pl: 3 },
                "& strong, & b": { fontWeight: 600 },
                "& s": { textDecoration: "line-through" },
                "& mark": { borderRadius: "2px", padding: "0 2px" },
              }}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(selectedLesson.script_text, {
                  ALLOWED_TAGS: [
                    "p",
                    "br",
                    "strong",
                    "b",
                    "em",
                    "i",
                    "u",
                    "s",
                    "span",
                    "ul",
                    "ol",
                    "li",
                    "h1",
                    "h2",
                    "h3",
                    "mark",
                  ],
                  ALLOWED_ATTR: ["style", "data-color"],
                }),
              }}
            />
          ) : (
            <Box
              component="img"
              src={selectedLesson.image}
              alt={`${selectedLesson.title} Practice lesson image`}
              sx={{
                width: "100%",
                height: { xs: "auto", lg: "100%" },
                objectFit: { xs: "initial", lg: "contain" },
                display: "block",
              }}
            />
          )}
        </Paper>
      </Box>
      {!hideFeedback && selectedLesson.feedback && (
        <Paper
          sx={{ mt: 2, p: 2, boxShadow: "0 2px 14px 0 rgb(32 40 45 / 8%)" }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "primary.dark", mb: 1 }}
          >
            {tTeacher("feedback")}
          </Typography>
          <Box
            sx={{
              "& p": { mb: 0.5, mt: 0 },
              "& p:last-child": { mb: 0 },
              "& ul, & ol": { pl: 3 },
              "& strong, & b": { fontWeight: 600 },
              "& s": { textDecoration: "line-through" },
              "& mark": { borderRadius: "2px", padding: "0 2px" },
            }}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(selectedLesson.feedback, {
                ALLOWED_TAGS: [
                  "p",
                  "br",
                  "strong",
                  "b",
                  "em",
                  "i",
                  "u",
                  "s",
                  "span",
                  "ul",
                  "ol",
                  "li",
                  "h1",
                  "h2",
                  "h3",
                  "mark",
                ],
                ALLOWED_ATTR: ["style", "data-color"],
              }),
            }}
          />
          <FeedbackReplyThread
            repliesEndpoint={API_PATHS.STUDENT_FEEDBACK_REPLIES(
              selectedLesson.id
            )}
            currentUserId={currentUserId}
          />
        </Paper>
      )}
    </Box>
  );
}
