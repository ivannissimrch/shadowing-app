"use client";
import { IconButton, Tooltip } from "@mui/material";
import { FiSun, FiMoon } from "react-icons/fi";
import { useTheme } from "../../../contexts/ThemeContext";

export default function DarkModeToggle() {
  const { mode, toggleMode } = useTheme();

  return (
    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
      <IconButton
        onClick={toggleMode}
        aria-label="toggle theme"
        sx={{
          color: "text.primary",
          transition: "transform 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)",
            backgroundColor: "grey.100",
          },
        }}
      >
        {mode === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
      </IconButton>
    </Tooltip>
  );
}
