"use client";
import { useEffect, useState } from "react";
import { useAppContext } from "../AppContext";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TeacherPage() {
  //get all students
  const [students, setStudents] = useState([]);
  const { token } = useAppContext();

  useEffect(() => {
    async function loadData() {
      if (!token) return;
      const response = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
      setStudents(result.data);
    }

    loadData();
  }, [token]);

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
        <div className={styles.studentsGrid}>
          {students &&
            students.map((student: { id: number; username: string }) => (
              <div key={student.id} className={styles.studentCard}>
                <h3>{student.username}</h3>
                <button className={styles.button}>See Details</button>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
