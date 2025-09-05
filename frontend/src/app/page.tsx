import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import Image from "next/image";

export default async function Login() {
  return (
    <main className={styles.main}>
      <div className={styles["login-image"]}>
        <Image
          src="/images/loginImage.jpg"
          alt="login image background"
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 50vw"
          priority
        />
      </div>
      <div className={styles["login-form"]}>
        <LoginForm />
      </div>
    </main>
  );
}
