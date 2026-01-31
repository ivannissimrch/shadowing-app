"use client";
import { useTranslations } from "next-intl";
import AssignLessonModal from "@/app/components/teacher/AssignLessonModal";
import AddLesson from "@/app/components/teacher/AddLesson";
import { useState } from "react";
import Lessons from "@/app/components/lesson/Lessons";
import MainCard from "@/app/components/ui/MainCard";
import Transitions from "@/app/components/ui/Transitions";
import useModal from "@/app/hooks/useModal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FiPlus } from "react-icons/fi";

export default function LessonsPage() {
  const t = useTranslations("navigation");
  const tTeacher = useTranslations("teacher");
  const [selectedLesson, setSelectedLesson] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const assignModal = useModal();
  const addLessonModal = useModal();

  function handleAssignLesson(lesson: { id: string; title: string }) {
    setSelectedLesson(lesson);
    assignModal.openModal();
  }
  function handleCloseModal() {
    assignModal.closeModal();
    setSelectedLesson(null);
  }

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        {t("lessons")}
      </Typography>

      <Transitions type="fade">
        <MainCard
          title={tTeacher("myLessons")}
          secondary={
            <Button
              variant="contained"
              size="small"
              onClick={() => addLessonModal.openModal()}
              startIcon={<FiPlus size={14} />}
              sx={{ textTransform: "none" }}
            >
              {tTeacher("addLesson")}
            </Button>
          }
        >
          <Lessons onAssignLesson={handleAssignLesson} />
        </MainCard>
      </Transitions>

      {selectedLesson && (
        <AssignLessonModal
          isOpen={assignModal.isModalOpen}
          onClose={handleCloseModal}
          lessonId={selectedLesson.id}
          lessonTitle={selectedLesson.title}
        />
      )}
      <AddLesson
        isAddLessonDialogOpen={addLessonModal.isModalOpen}
        closeAddLessonDialog={() => addLessonModal.closeModal()}
      />
    </Box>
  );
}
