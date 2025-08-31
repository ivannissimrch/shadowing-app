import styles from "./page.module.css";
import LoginForm from "./components/LoginForm";
import Image from "next/image";

export default async function Login() {
  return (
    <main className={styles.main}>
      <div className="login-image">
        <Image
          src="/images/loginImage.jpg"
          alt="login image"
          width={900}
          height={800}
        />
      </div>
      <div className="login-form">
        <LoginForm />
      </div>
    </main>
  );
}
