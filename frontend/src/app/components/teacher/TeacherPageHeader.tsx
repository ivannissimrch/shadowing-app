import { FaUserPlus } from "react-icons/fa";
import styles from "./TeacherPageHeader.module.css";

interface TeacherPageHeaderProps {
  title: string;
  onClick: () => void;
}

export default function TeacherPageHeader({
  title,
  onClick,
}: TeacherPageHeaderProps) {
  return (
    <div className={styles.sectionHeader}>
      <h2>{title}</h2>
      <button className={styles.addButton} onClick={onClick}>
        <FaUserPlus /> Add {title}
      </button>
    </div>
  );
}
