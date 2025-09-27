"use client";
import styles from "./LoginForm.module.css";
import { useEffect, useState } from "react";
const API_URL = process.env.NEXT_PUBLIC_API_URL;
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";
import { MdOutlineRemoveRedEye } from "react-icons/md";

export default function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken, token, isTokenLoading } = useAppContext();
  const [passwordType, setPasswordType] = useState("password");

  useEffect(() => {
    if (!isTokenLoading && token) {
      // If there's already a token, redirect based on role
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "teacher") {
          router.push("/teacher");
        } else {
          router.push("/lessons");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        updateToken("");
      }
    }
  }, [isTokenLoading, router, token, updateToken]);

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
      if (result.user.role === "teacher") {
        router.push("/teacher");
      } else {
        router.push("/lessons");
      }
    } else {
      alert(`Login failed: ${result.message}`);
    }
  }

  if (token) {
    return <div>Loading ...</div>;
  }

  return (
    <main className={styles["form-container"]}>
      <h1>Welcome</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          className={styles.input}
          required
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <label htmlFor="password">Password:</label>
        <div className={styles.passwordContainer}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={passwordType}
            name="password"
            id="password"
            placeholder="Enter your password"
            className={styles.input}
            required
          />
          <span
            className={styles.eye}
            onClick={() =>
              setPasswordType(passwordType === "password" ? "text" : "password")
            }
          >
            <MdOutlineRemoveRedEye />
          </span>
        </div>

        <button className={styles.button}>Login</button>
      </form>
    </main>
  );
}
