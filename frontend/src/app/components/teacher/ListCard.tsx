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
import { FiList, FiTrash2, FiEdit2, FiEye } from "react-icons/fi";
import { List } from "../../Types";

interface ListCardProps {
  lists: List[];
  onDeleteList: (list: List) => void;
  onEditList: (list: List) => void;
}

export default function ListCard({
  lists,
  onDeleteList,
  onEditList,
}: ListCardProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return lists.map((list: List) => (
    <MuiCard
      key={list.id}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Lesson Count Badge - Upper Right Corner */}
      <Chip
        label={`${list.lesson_count} ${list.lesson_count === 1 ? t("lesson") : t("lessonsCount")}`}
        size="small"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "primary.light",
          color: "primary.dark",
          fontWeight: 500,
          fontSize: "0.7rem",
          height: 22,
        }}
      />

      <CardContent sx={{ flexGrow: 1, pb: 1, pt: 4 }}>
        {/* Icon */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "secondary.light",
              color: "secondary.main",
              width: 56,
              height: 56,
            }}
          >
            <FiList size={28} />
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
          {list.name}
        </Typography>

        {/* Description */}
        {list.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 1,
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {list.description}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, flexDirection: "column", gap: 1 }}>
        {/* View Button */}
        <Button
          component={Link}
          href={`/teacher/list/${list.id}`}
          variant="outlined"
          fullWidth
          startIcon={loadingId !== list.id ? <FiEye size={16} /> : undefined}
          disabled={loadingId === list.id}
          onClick={() => setLoadingId(list.id)}
          sx={{ textTransform: "none", fontWeight: 500 }}
        >
          {loadingId === list.id ? tCommon("loading") : t("viewList")}
        </Button>

        {/* Action Buttons Row */}
        <Box sx={{ display: "flex", width: "100%", gap: 1, justifyContent: "flex-end" }}>
          <Tooltip title={t("editList")}>
            <IconButton
              onClick={() => onEditList(list)}
              color="primary"
              size="small"
              aria-label={`${t("editList")} ${list.name}`}
            >
              <FiEdit2 size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("deleteList")}>
            <IconButton
              onClick={() => onDeleteList(list)}
              color="error"
              size="small"
              aria-label={`${t("deleteList")} ${list.name}`}
            >
              <FiTrash2 size={16} />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </MuiCard>
  ));
}
