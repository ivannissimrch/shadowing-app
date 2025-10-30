"use client";
import styles from "./LoginForm.module.css";
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
        updateToken(null);
      }
    }
  }, [router, token, updateToken]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    const response = await trigger({
      username: username,
      password: password,
    });

    if (response) {
      const { token } = response;
      updateToken(token);

      const route = redirectBasedOnRole(token);
      router.push(route);
    }
  }

  const errorMsg = error instanceof Error ? error.message : null;

  return (
    <section className={styles["form-container"]}>
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
          aria-required="true"
          aria-invalid={errorMsg ? "true" : "false"}
          aria-describedby={errorMsg ? "login-error" : undefined}
          value={username}
          autoComplete="off"
          onChange={(e) => {
            setUsername(e.target.value);
          }}
        />
        <label htmlFor="password">Password:</label>
        <div className={styles.passwordContainer}>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={passwordType}
            name="password"
            id="password"
            placeholder="Enter your password"
            className={styles.input}
            required
            aria-required="true"
            aria-invalid={errorMsg ? "true" : "false"}
            aria-describedby={errorMsg ? "login-error" : undefined}
            autoComplete="off"
          />
          <button
            type="button"
            className={styles.eye}
            onClick={() =>
              setPasswordType(passwordType === "password" ? "text" : "password")
            }
            aria-label={
              passwordType === "password"
                ? "Show password"
                : "Hide password"
            }
          >
            <MdOutlineRemoveRedEye />
          </button>
        </div>

        <button className={styles.button} type="submit" disabled={isMutating}>
          {isMutating ? "Logging in..." : "Login"}
        </button>
      </form>
      {errorMsg && (
        <p
          id="login-error"
          role="alert"
          aria-live="assertive"
          className={styles.error}
        >
          {errorMsg}
        </p>
      )}
    </section>
  );
}
