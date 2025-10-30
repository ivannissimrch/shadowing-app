import styles from "./page.module.css";
import LoginForm from "./components/auth/LoginForm";

export default async function Login() {
  return (
    <main className={styles.main}>
      <section className={styles["login-form"]}>
        <LoginForm />
      </section>
    </main>
  );
}
