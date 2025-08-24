import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";

export default async function Login() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>
        <LoginForm />
      </div>
    </main>
  );
}
