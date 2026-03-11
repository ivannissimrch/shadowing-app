"use client";
import { SANITIZE_CONFIG } from "@/app/constants/sanitizeConfig";
import useFontSize from "@/app/hooks/useFontSize";
import { Lesson } from "@/app/Types";
import { Box, Paper } from "@mui/material";
import DOMPurify from "dompurify";
import FontSizeControls from "./FontSizeControls";

export default function ScriptPanel({
  selectedLesson,
}: {
  selectedLesson: Lesson;
}) {
  const { fontSize } = useFontSize();
  return (
    <Paper
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
      }}
    >
      {selectedLesson.script_type === "text" && selectedLesson.script_text ? (
        <>
          <FontSizeControls />
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
              __html: DOMPurify.sanitize(
                selectedLesson.script_text,
                SANITIZE_CONFIG
              ),
            }}
          />
        </>
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
  );
}
