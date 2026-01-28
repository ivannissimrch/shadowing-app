"use client";
import { useTranslations } from "next-intl";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import Card from "../ui/Card";
import CardGrid from "../ui/CardGrid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FiBook } from "react-icons/fi";

export default function StudentLessons() {
  const t = useTranslations("student");
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.LESSONS);

  if (lessons?.length === 0) {
    return (
      <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 3,
        }}
      >
        <FiBook size={48} color="#9da4ae" style={{ marginBottom: 16 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
          {t("noLessons")}
        </Typography>
      </Box>
    );
  }

  return (
    <CardGrid>
      {lessons &&
        lessons.map((lesson) => (
          <Card
            key={lesson.title}
            lesson={lesson}
            linkPath={`/student/lessons/${lesson.id}`}
          />
        ))}
    </CardGrid>
  );
}
