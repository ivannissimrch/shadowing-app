import styles from "./page.module.css";
import Students from "../components/Students";

export default function TeacherPage() {
  return (
    <div className={styles.teacherDashboard}>
      <section className={styles.statsRow}></section>
      <section className={styles.studentsSection}>
        <h2>Students</h2>
        <Students />
      </section>
    </div>
  );
}
