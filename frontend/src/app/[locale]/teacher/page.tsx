"use client";
import { useTranslations } from "next-intl";
import Students from "../../components/student/Students";
import AddStudent from "../../components/teacher/AddStudent";
import TeacherPageHeader from "../../components/teacher/TeacherPageHeader";
import useModal from "@/app/hooks/useModal";
import Box from "@mui/material/Box";

export default function TeacherPage() {
  const t = useTranslations("navigation");
  const tTeacher = useTranslations("teacher");
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <Box>
      <TeacherPageHeader title={t("students")} buttonText={tTeacher("addStudent")} onClick={() => openModal()} />
      <Students />
      <AddStudent
        isAddStudentDialogOpen={isModalOpen}
        closeAddStudentDialog={() => closeModal()}
        aria-label="Add new student"
      />
    </Box>
  );
}
