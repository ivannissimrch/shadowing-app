"use client";
import styles from "./LoginForm.module.css";
import { useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken } = useAppContext();
  //check if token is valid then redirect to user page check for token or make a request to validate it?

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const response = await fetch(`${API_URL}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: userName, password }),
    });
    const result = await response.json();
    console.log("Login response:", result);
    //save token to context or state management result.token
    updateToken(result.token);
    if (response.ok) {
      router.push("/lessons");
    } else {
      alert(`Login failed: ${result.message}`);
    }
  }

  return (
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
  );
}
