import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import Image from "next/image";
import AnimatedMessage from "./components/AnimatedMessage";

export default async function Login() {
  return (
    <main className={styles.main}>
      <div className={styles["login-image"]}>
        <AnimatedMessage />
        <Image
          src="/images/parrot.png"
          alt="login image background"
          width={250}
          height={300}
          sizes="(max-width: 300px) 100vw, 50vw"
          priority
        />
      </div>
      <div className={styles["login-form"]}>
        <LoginForm />
      </div>
    </main>
  );
}
