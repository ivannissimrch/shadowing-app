import { MdAdd } from "react-icons/md";
import { Button } from "../ui/Button/Button";
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
      <Button variant="primary" onClick={onClick} leftIcon={<MdAdd />}>
        Add {title}
      </Button>
    </div>
  );
}
