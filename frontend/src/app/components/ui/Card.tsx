"use client";
import { useTranslations } from "next-intl";
import { Lesson } from "@/app/Types";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import { FiBook, FiCheckCircle, FiClock, FiPlay } from "react-icons/fi";

export default function Card({
  lesson,
  linkPath,
}: {
  lesson: Lesson;
  linkPath: string;
}) {
  const t = useTranslations("lesson");
  const tCommon = useTranslations("common");
  const { title, status } = lesson;
  const [loading, setLoading] = useState(false);

  const getStatusConfig = () => {
    switch (status?.toLowerCase()) {
      case "completed":
        return {
          icon: <FiCheckCircle size={14} />,
          color: "success" as const,
          label: t("completed"),
        };
      case "in progress":
        return {
          icon: <FiPlay size={14} />,
          color: "primary" as const,
          label: t("inProgress"),
        };
      default:
        return {
          icon: <FiClock size={14} />,
          color: "warning" as const,
          label: status || t("notStarted"),
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <MuiCard
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Icon and Status Row */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              width: 48,
              height: 48,
            }}
          >
            <FiBook size={24} />
          </Avatar>
          <Chip
            icon={statusConfig.icon}
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          component="h2"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {title}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          component={Link}
          href={linkPath}
          variant="contained"
          fullWidth
          disabled={loading}
          onClick={() => setLoading(true)}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          {loading ? tCommon("loading") : t("viewLesson")}
        </Button>
      </CardActions>
    </MuiCard>
  );
}
