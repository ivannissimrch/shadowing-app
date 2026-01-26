"use client";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { Student } from "../../Types";
import { API_PATHS } from "../../constants/apiKeys";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import { FiUser } from "react-icons/fi";

export default function StudentInfo({ id }: { id: string }) {
  const { data } = useSWRAxios<Student>(API_PATHS.TEACHER_STUDENT(id));
  const student = data;

  if (!student) return null;

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 56,
            height: 56,
            bgcolor: "secondary.light",
            color: "secondary.main",
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          {student.username?.charAt(0).toUpperCase() || <FiUser size={24} />}
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary" }}>
            {student.username}
          </Typography>
          <Chip
            label={student.role}
            size="small"
            color="secondary"
            sx={{ mt: 0.5, textTransform: "capitalize" }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
