import styles from "./page.module.css";
import StudentLessons from "../components/StudentLessons";

export default function Lessons() {
  return (
    <>
      <h1 className={styles.title}>My Lessons</h1>
      <StudentLessons />
    </>
  );
}
