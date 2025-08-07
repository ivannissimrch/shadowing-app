import styles from "./page.module.css";
import Link from "next/link";
import { User } from "./Types";

export default async function Login() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
  const data = await response.json();
  const users: User[] = data.data;

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
