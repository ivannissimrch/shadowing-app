import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";

export default async function Login() {
  return (
    <main className={styles.main}>
      <div className={styles["login-form"]}>
        <LoginForm />
      </div>
    </main>
  );
}
