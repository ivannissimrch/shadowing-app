"use client";
import styles from "@/styles/components/student/StudentList.module.css";
import { Student } from "../../Types";
import Link from "next/link";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import { useState } from "react";
import DeleteStudentModal from "../teacher/DeleteStudentModal";

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
      <div className={styles.studentsGrid}>
        {students &&
          students.map((student: Student) => (
            <div key={student.id} className={styles.studentCard}>
              <h3 className={styles.studentTitle}>{student.username}</h3>
              <div className={styles.buttonGroup}>
                <Link
                  href={`/teacher/student/${student.id}`}
                  className={styles.button}
                >
                  Details
                </Link>
                <button
                  onClick={() => handleDeleteStudent(student)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
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
