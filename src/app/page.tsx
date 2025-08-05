import styles from "./page.module.css";
import Link from "next/link";
import { fetchUsers } from "./data/mock_data";

export default async function Login() {
  const users = await fetchUsers();
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>
        <div className={styles.buttonsContainer}>
          {users.map((user) => (
            <Link
              key={user.name}
              href={`/${user.name}`}
              className={styles.button}
            >
              {user.name}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
