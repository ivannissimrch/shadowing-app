"use client";
import { ReactNode } from "react";
import { motion, useCycle } from "framer-motion";

type AnimationType = "scale" | "slide" | "rotate";
type Direction = "up" | "down" | "left" | "right";

interface ScaleProps {
  hover: number;
  tap: number;
}

interface AnimateButtonProps {
  children: ReactNode;
  type?: AnimationType;
  direction?: Direction;
  offset?: number;
  scale?: ScaleProps;
}

export default function AnimateButton({
  children,
  type = "scale",
  direction = "right",
  offset = 10,
  scale = { hover: 1.05, tap: 0.95 },
}: AnimateButtonProps) {
  const [x, cycleX] = useCycle(
    direction === "left" ? offset : 0,
    direction === "right" ? offset : 0
  );
  const [y, cycleY] = useCycle(
    direction === "up" ? offset : 0,
    direction === "down" ? offset : 0
  );

  switch (type) {
    case "rotate":
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 2, repeatDelay: 0 }}
        >
          {children}
        </motion.div>
      );

    case "slide":
      if (direction === "up" || direction === "down") {
        return (
          <motion.div
            animate={{ y }}
            onHoverStart={() => cycleY()}
            onHoverEnd={() => cycleY()}
          >
            {children}
          </motion.div>
        );
      }
      return (
        <motion.div
          animate={{ x }}
          onHoverStart={() => cycleX()}
          onHoverEnd={() => cycleX()}
        >
          {children}
        </motion.div>
      );

    case "scale":
    default:
      return (
        <motion.div whileHover={{ scale: scale.hover }} whileTap={{ scale: scale.tap }}>
          {children}
        </motion.div>
      );
  }
}
