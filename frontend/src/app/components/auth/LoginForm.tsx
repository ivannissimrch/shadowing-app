"use client";
import styles from "@/styles/components/auth/LoginForm.module.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../../AppContext";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import redirectBasedOnRole from "../../helpers/redirectBasedOnRole";
import logger from "../../helpers/logger";
import { AuthResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken, token } = useAppContext();
  const [passwordType, setPasswordType] = useState("password");
  const [errorMessage, setErrorMessage] = useState("");

  const { isMutating, trigger, error } = useSWRMutationHook<
    AuthResponse,
    { username: string; password: string }
  >("/signin", { method: "POST" });

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
    setErrorMessage("");

    const response = await trigger({
      username: username,
      password: password,
    });

    if (!response?.data) {
      setErrorMessage(error instanceof Error ? error.message : "Login error");
      logger.error("Login error:", error);
      return;
    }

    const { token } = response.data;
    updateToken(token);

    const route = redirectBasedOnRole(token);
    router.push(route);
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

        <button className={styles.button} type="submit" disabled={isMutating}>
          {isMutating ? "Logging in..." : "Login"}
        </button>
      </form>
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </main>
  );
}
