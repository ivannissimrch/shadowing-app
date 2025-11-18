"use client";
import styles from "./page.module.css";
import Students from "../components/student/Students";
import AddStudent from "../components/teacher/AddStudent";
import TeacherPageHeader from "../components/teacher/TeacherPageHeader";
import useModal from "@/app/hooks/useModal";

export default function TeacherPage() {
  const { isModalOpen, openModal, closeModal } = useModal();

  return (
    <div className={styles.container}>
      <section className={styles.studentsSection}>
        <TeacherPageHeader title="Students" onClick={() => openModal()} />
        <Students />
      </section>
      <AddStudent
        isAddStudentDialogOpen={isModalOpen}
        closeAddStudentDialog={() => closeModal()}
        aria-label="Add new student"
      />
    </div>
  );
}
