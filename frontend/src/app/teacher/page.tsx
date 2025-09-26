import styles from "./page.module.css";
import Students from "../components/Students";

export default function TeacherPage() {
  ///Add state here for modals and data fetching

  return (
    <div className={styles.teacherDashboard}>
      <section className={styles.statsRow}>
        {/* on Click display modal to show lessons submitted by students needed to be review */}
        <button className={styles.statsCard}>
          <h3>Pending Reviews</h3>
          <p className={styles.statsNumber}>5</p>
        </button>
        {/* on Click display modal to show calendar with upcoming classes */}
        <button className={styles.statsCard}>
          <h3>Upcoming Classes</h3>
          <p className={styles.statsNumber}>24</p>
        </button>
      </section>
      <section className={styles.studentsSection}>
        <h2>Students</h2>
        <Students />
      </section>
    </div>
  );
}
