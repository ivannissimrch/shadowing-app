import { FaUserPlus } from "react-icons/fa";
import styles from "./TeacherPageHeader.module.css";

interface TeacherPageHeaderProps {
  onAddStudentClick: () => void;
}

export default function TeacherPageHeader({
  onAddStudentClick,
}: TeacherPageHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <h2>Students</h2>
      <button className={styles.addButton} onClick={onAddStudentClick}>
        <FaUserPlus /> Add Student
      </button>
    </div>
  );
}
