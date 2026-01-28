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
import { FiUser, FiEye, FiTrash2 } from "react-icons/fi";
import { Student } from "../../Types";

export default function StudentCard({
  students,
  onDeleteStudent,
}: {
  students: Student[] | undefined;
  onDeleteStudent: (student: Student) => void;
}) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  return students?.map((student: Student) => (
    <MuiCard
      key={student.id}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Avatar */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar
            sx={{
              bgcolor: "secondary.light",
              color: "secondary.main",
              width: 64,
              height: 64,
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            {student.username?.charAt(0).toUpperCase() || <FiUser size={28} />}
          </Avatar>
        </Box>

        {/* Name */}
        <Typography
          variant="h5"
          component="h3"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            textAlign: "center",
            mb: 0.5,
          }}
        >
          {student.username}
        </Typography>

        {/* Role badge */}
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            textAlign: "center",
          }}
        >
          {t("student")}
        </Typography>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, justifyContent: "space-between" }}>
        <Button
          component={Link}
          href={`/teacher/student/${student.id}`}
          variant="outlined"
          color="primary"
          startIcon={<FiEye size={16} />}
          disabled={loadingId === student.id}
          onClick={() => setLoadingId(student.id)}
          sx={{ textTransform: "none", fontWeight: 500, flex: 1 }}
        >
          {loadingId === student.id ? tCommon("loading") : t("viewDetails")}
        </Button>
        <Tooltip title={t("deleteStudent")}>
          <IconButton
            onClick={() => onDeleteStudent(student)}
            color="error"
            aria-label={`${t("deleteStudent")} ${student.username}`}
            sx={{ ml: 1 }}
          >
            <FiTrash2 size={18} />
          </IconButton>
        </Tooltip>
      </CardActions>
    </MuiCard>
  ));
}
