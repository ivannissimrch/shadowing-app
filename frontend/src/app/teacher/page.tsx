"use client";
import Students from "../components/student/Students";
import AddStudent from "../components/teacher/AddStudent";
import TeacherPageHeader from "../components/teacher/TeacherPageHeader";
import useModal from "@/app/hooks/useModal";
import Box from "@mui/material/Box";

export default function TeacherPage() {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <Box>
      <TeacherPageHeader title="Students" onClick={() => openModal()} />
      <Students />
      <AddStudent
        isAddStudentDialogOpen={isModalOpen}
        closeAddStudentDialog={() => closeModal()}
        aria-label="Add new student"
      />
    </Box>
  );
}
