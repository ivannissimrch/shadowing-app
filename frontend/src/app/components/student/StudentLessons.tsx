"use client";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Lesson } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import Card from "../ui/Card";
import CardGrid from "../ui/CardGrid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { FiBook, FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function StudentLessons() {
  const t = useTranslations("student");
  const { data: lessons } = useSWRAxios<Lesson[]>(API_PATHS.LESSONS);
  const [showCompleted, setShowCompleted] = useState(false);

  const activelessons = lessons?.filter((l) => l.status !== "completed") ?? [];
  const completedLessons = lessons?.filter((l) => l.status === "completed") ?? [];

  if (lessons?.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
        <FiBook size={48} color="#9da4ae" style={{ marginBottom: 16 }} />
        <Typography variant="h5" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
          {t("noLessons")}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Active lessons */}
      {activelessons.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 6, px: 3 }}>
          <FiBook size={40} color="#9da4ae" style={{ marginBottom: 12 }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
            {t("noActiveLessons")}
          </Typography>
        </Box>
      ) : (
        <CardGrid>
          {activelessons.map((lesson) => (
            <Card
              key={lesson.id}
              lesson={lesson}
              linkPath={`/student/lessons/${lesson.id}`}
            />
          ))}
        </CardGrid>
      )}

      {/* Completed lessons section */}
      {completedLessons.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ mb: 2 }} />
          <Button
            onClick={() => setShowCompleted((prev) => !prev)}
            endIcon={showCompleted ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
              mb: 2,
              pl: 0,
            }}
          >
            {t("completedLessons")} ({completedLessons.length})
          </Button>
          <Collapse in={showCompleted}>
            <CardGrid>
              {completedLessons.map((lesson) => (
                <Card
                  key={lesson.id}
                  lesson={lesson}
                  linkPath={`/student/lessons/${lesson.id}`}
                />
              ))}
            </CardGrid>
          </Collapse>
        </Box>
      )}
    </Box>
  );
}
