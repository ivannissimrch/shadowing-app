"use client";
import { Student } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteStudentModal from "../teacher/DeleteStudentModal";
import CardGrid from "../ui/CardGrid";
import StudentCard from "../ui/StudentCard";
import useModal from "@/app/hooks/useModal";

export default function StudentList() {
  const { data: students } = useSWRAxios<Student[]>(API_PATHS.USERS);
  const deleteModal = useModal();
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    username: string;
  } | null>(null);

  function handleDeleteStudent(student: Student) {
    setSelectedStudent({ id: student.id, username: student.username });
    deleteModal.openModal();
  }

  function handleCloseModal() {
    deleteModal.closeModal();
    setSelectedStudent(null);
  }

  return (
    <>
      <CardGrid>
        <StudentCard
          students={students}
          onDeleteStudent={handleDeleteStudent}
        />
      </CardGrid>
      {selectedStudent && (
        <DeleteStudentModal
          isOpen={deleteModal.isModalOpen}
          onClose={handleCloseModal}
          studentId={selectedStudent.id}
          studentUsername={selectedStudent.username}
        />
      )}
    </>
  );
}
