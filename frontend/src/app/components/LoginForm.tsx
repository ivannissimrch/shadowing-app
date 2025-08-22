"use client";
import styles from "./LoginForm.module.css";
import { useState } from "react";

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
  }

  return (
    <div className={styles.buttonsContainer}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          className={styles.input}
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          name="password"
          placeholder="Enter your password"
          className={styles.input}
          required
        />
        <button className={styles.button}>Login</button>
      </form>
    </div>
  );
}
