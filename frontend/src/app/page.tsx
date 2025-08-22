import styles from "./page.module.css";

export default async function Login() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
        </p>
        <div className={styles.buttonsContainer}>
          <form className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Enter your name"
              className={styles.input}
              required
            />
            <input
              type="text"
              name="password"
              placeholder="Enter your password"
              className={styles.input}
              required
            />
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
