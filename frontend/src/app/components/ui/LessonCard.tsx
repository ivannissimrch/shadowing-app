"use client";
import { useTranslations } from "next-intl";
import MuiCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import { FiBook, FiUserPlus, FiTrash2 } from "react-icons/fi";
import { Lesson } from "../../Types";

interface LessonCardProps {
  lessons: Lesson[];
  onAssignLesson: (lesson: { id: string; title: string }) => void;
  onDeleteLesson: (lesson: Lesson) => void;
}

export default function LessonCard({
  lessons,
  onAssignLesson,
  onDeleteLesson,
}: LessonCardProps) {
  const t = useTranslations("teacher");

  return lessons.map((lesson: Lesson) => (
    <MuiCard
      key={lesson.id}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
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

      <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<FiUserPlus size={16} />}
          onClick={() => onAssignLesson(lesson)}
          sx={{ textTransform: "none", fontWeight: 500, flex: 1 }}
        >
          {t("assignLesson")}
        </Button>
        <Tooltip title={t("deleteLesson")}>
          <IconButton
            onClick={() => onDeleteLesson(lesson)}
            color="error"
            aria-label={`${t("deleteLesson")} ${lesson.title}`}
            sx={{ ml: 1 }}
          >
            <FiTrash2 size={18} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </MuiCard>
  ));
}
