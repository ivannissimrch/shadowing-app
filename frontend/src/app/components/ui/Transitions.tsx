"use client";
import { ReactElement } from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";
import Zoom from "@mui/material/Zoom";

type TransitionType = "grow" | "fade" | "collapse" | "slide" | "zoom";
type Position = "top-left" | "top-right" | "top" | "bottom-left" | "bottom-right" | "bottom";
type Direction = "up" | "down" | "left" | "right";

interface TransitionsProps {
  children: ReactElement;
  type?: TransitionType;
  position?: Position;
  direction?: Direction;
  in?: boolean;
}

const positionStyles: Record<Position, { transformOrigin: string }> = {
  "top-left": { transformOrigin: "0 0 0" },
  "top-right": { transformOrigin: "top right" },
  "top": { transformOrigin: "top" },
  "bottom-left": { transformOrigin: "bottom left" },
  "bottom-right": { transformOrigin: "bottom right" },
  "bottom": { transformOrigin: "bottom" },
};

export default function Transitions({
  children,
  type = "grow",
  position = "top-left",
  direction = "up",
  in: inProp = true,
}: TransitionsProps) {
  const positionSX = positionStyles[position];

  switch (type) {
    case "grow":
      return (
        <Grow in={inProp}>
          <Box sx={positionSX}>{children}</Box>
        </Grow>
      );
    case "fade":
      return (
        <Fade in={inProp} timeout={{ appear: 500, enter: 600, exit: 400 }}>
          <Box sx={positionSX}>{children}</Box>
        </Fade>
      );
    case "collapse":
      return (
        <Collapse in={inProp} sx={positionSX}>
          {children}
        </Collapse>
      );
    case "slide":
      return (
        <Slide in={inProp} direction={direction} timeout={{ appear: 0, enter: 400, exit: 200 }}>
          <Box sx={positionSX}>{children}</Box>
        </Slide>
      );
    case "zoom":
      return (
        <Zoom in={inProp}>
          <Box sx={positionSX}>{children}</Box>
        </Zoom>
      );
    default:
      return children;
  }
}
