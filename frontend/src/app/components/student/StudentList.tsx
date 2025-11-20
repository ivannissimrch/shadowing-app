"use client";
import { Student } from "../../Types";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteStudentModal from "../teacher/DeleteStudentModal";
import CardGrid from "../ui/CardGrid/CardGrid";
import StudentCard from "../ui/StudentCard";

export default function StudentList() {
  const { data: students } = useSWRAxios<Student[]>(API_PATHS.USERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string;
    username: string;
  } | null>(null);

  function handleDeleteStudent(student: Student) {
    setSelectedStudent({ id: student.id, username: student.username });
    setIsDeleteModalOpen(true);
  }

  function handleCloseModal() {
    setIsDeleteModalOpen(false);
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
          isOpen={isDeleteModalOpen}
          onClose={handleCloseModal}
          studentId={selectedStudent.id}
          studentUsername={selectedStudent.username}
        />
      )}
    </>
  );
}
