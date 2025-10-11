"use client";
import styles from "@/styles/components/auth/LoginForm.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import api from "../../helpers/axiosFetch";
import redirectBasedOnRole from "../../helpers/redirectBasedOnRole";
import logger from "../../helpers/logger";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken, token } = useAppContext();
  const [passwordType, setPasswordType] = useState("password");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (token) {
      // If there's already a token, redirect based on role
      try {
        const route = redirectBasedOnRole(token);
        router.push(route);
      } catch (error) {
        logger.error("Invalid token:", error);
        updateToken("");
      }
    }
  }, [router, token, updateToken]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/signin", {
        username: username,
        password: password,
      });
      const { token } = response.data;
      updateToken(token);
      // Redirect based on role
      const route = redirectBasedOnRole(token);
      router.push(route);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error("Login error:", error.message);
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred, please try again.");
      }
    } finally {
      setIsLoading(false);
    }
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
          value={username}
          autoComplete="off"
          onChange={(e) => {
            setErrorMessage("");
            setUsername(e.target.value);
          }}
        />
        <label htmlFor="password">Password:</label>
        <div className={styles.passwordContainer}>
          <input
            value={password}
            onChange={(e) => {
              setErrorMessage("");
              setPassword(e.target.value);
            }}
            type={passwordType}
            name="password"
            id="password"
            placeholder="Enter your password"
            className={styles.input}
            required
            autoComplete="off"
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

        <button className={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </main>
  );
}
