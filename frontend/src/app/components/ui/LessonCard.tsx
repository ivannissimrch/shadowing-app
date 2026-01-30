"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import { FiBook, FiUserPlus, FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import { Lesson } from "../../Types";

interface LessonCardProps {
  lessons: Lesson[];
  onAssignLesson: (lesson: { id: string; title: string }) => void;
  onDeleteLesson: (lesson: Lesson) => void;
  onEditLesson?: (lesson: Lesson) => void;
}

export default function LessonCard({
  lessons,
  onAssignLesson,
  onDeleteLesson,
  onEditLesson,
}: LessonCardProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return lessons.map((lesson: Lesson) => (
    <MuiCard
      key={lesson.id}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Category Badge - Upper Right Corner */}
      {lesson.category && (
        <Chip
          label={lesson.category}
          size="small"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            bgcolor: "secondary.light",
            color: "secondary.dark",
            fontWeight: 500,
            fontSize: "0.7rem",
            height: 22,
          }}
        />
      )}

      <CardContent sx={{ flexGrow: 1, pb: 1, pt: lesson.category ? 4 : 2 }}>
        {/* Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              width: 56,
              height: 56,
            }}
          >
            <FiBook size={28} />
          </Avatar>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {lesson.title}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, flexDirection: "column", gap: 1 }}>
        {/* View Button */}
        <Button
          component={Link}
          href={`/teacher/lesson/${lesson.id}`}
          variant="outlined"
          fullWidth
          startIcon={loadingId !== lesson.id ? <FiEye size={16} /> : undefined}
          disabled={loadingId === lesson.id}
          onClick={() => setLoadingId(lesson.id)}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          {loadingId === lesson.id ? tCommon("loading") : t("viewLesson")}
        </Button>

        {/* Action Buttons Row */}
        <Box sx={{ display: "flex", width: "100%", gap: 1 }}>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<FiUserPlus size={16} />}
            onClick={() => onAssignLesson(lesson)}
            sx={{ textTransform: "none", fontWeight: 500, flex: 1 }}
            size="small"
          >
            {t("assignLesson")}
          </Button>
          {onEditLesson && (
            <Tooltip title={t("editLesson") || "Edit Lesson"}>
              <IconButton
                onClick={() => onEditLesson(lesson)}
                color="primary"
                size="small"
                aria-label={`${t("editLesson") || "Edit"} ${lesson.title}`}
              >
                <FiEdit2 size={16} />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={t("deleteLesson")}>
            <IconButton
              onClick={() => onDeleteLesson(lesson)}
              color="error"
              size="small"
              aria-label={`${t("deleteLesson")} ${lesson.title}`}
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </MuiCard>
  ));
}
