"use client";
import styles from "./LoginForm.module.css";
import { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken, token } = useAppContext();
  //check if token is valid then redirect to user page check for token or make a request to validate it?
  useEffect(() => {
    if (token) {
      router.push("/lessons");
    }
  }, [token, router]);

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
    if (response.ok) {
      updateToken(result.token);
      // router.push("/lessons");
    } else {
      alert(`Login failed: ${result.message}`);
    }
  }

  if (token) {
    return <div>Redirecting...</div>;
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
