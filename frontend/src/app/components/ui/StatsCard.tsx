"use client";
import { ReactNode } from "react";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color?: "primary" | "secondary" | "success" | "warning" | "error";
  subtitle?: string;
  onClick?: () => void;
}

/**
 * Berry-style Stats Card
 * Displays a metric with icon, value, and optional subtitle
 */
export default function StatsCard({
  title,
  value,
  icon,
  color = "primary",
  subtitle,
  onClick,
}: StatsCardProps) {
  const colorMap = {
    primary: { bg: "primary.light", text: "primary.main" },
    secondary: { bg: "secondary.light", text: "secondary.main" },
    success: { bg: "success.light", text: "success.main" },
    warning: { bg: "warning.light", text: "warning.dark" },
    error: { bg: "error.light", text: "error.main" },
  };

  const colors = colorMap[color];

  return (
    <MuiCard
      elevation={0}
      onClick={onClick}
      sx={{
        border: "1px solid",
        borderColor: "grey.200",
        borderRadius: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        "&:hover": onClick
          ? {
              borderColor: "primary.main",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }
          : {},
      }}
    >
      <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            variant="rounded"
            sx={{
              bgcolor: colors.bg,
              color: colors.text,
              width: 52,
              height: 52,
            }}
          >
            {icon}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h3"
              sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1.2 }}
            >
              {value}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" sx={{ color: colors.text }}>
                {subtitle}
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </MuiCard>
  );
}
