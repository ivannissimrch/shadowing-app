"use client";
import { ReactNode } from "react";
import Box from "@mui/material/Box";

interface CardGridProps {
  children: ReactNode;
}

export default function CardGrid({ children }: CardGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
          xl: "repeat(4, 1fr)",
        },
        gap: 3,
        width: "100%",
      }}
    >
      {children}
    </Box>
  );
}
