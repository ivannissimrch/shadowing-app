"use client";
import styles from "./LoginForm.module.css";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../AuthContext";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import redirectBasedOnRole from "../../helpers/redirectBasedOnRole";
import logger from "../../helpers/logger";
import { AuthResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";
import { Button } from "../ui/Button";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken, token } = useAuthContext();
  const [passwordType, setPasswordType] = useState("password");
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMutating, trigger } = useSWRMutationHook<
    AuthResponse,
    { username: string; password: string }
  >("/signin", { method: "POST" });
  const [isNavigating, setIsNavigating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      if (token) {
        // If there's already a token, redirect based on role
        const route = redirectBasedOnRole(token);
        router.push(route);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      logger.error("Invalid token:", error);
      setIsNavigating(false);
      updateToken(null);
    }
  }, [router, token, updateToken]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");

    try {
      const response = await trigger({
        username: username,
        password: password,
      });

      if (response) {
        const { token } = response;
        updateToken(token);
        const route = redirectBasedOnRole(token);
        setIsNavigating(true);
        router.push(route);
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    }
  }

  return (
    <section className={styles["form-container"]}>
      <h1>Welcome</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input
          disabled={isMutating || isNavigating}
          ref={inputRef}
          type="text"
          name="username"
          id="username"
          placeholder="Enter your username"
          className={styles.input}
          required
          aria-required="true"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? "login-error" : undefined}
          value={username}
          autoComplete="off"
          onChange={(e) => {
            setUsername(e.target.value);
            setErrorMessage("");
          }}
        />
        <label htmlFor="password">Password:</label>
        <div className={styles.passwordContainer}>
          <input
            disabled={isMutating || isNavigating}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrorMessage("");
            }}
            type={passwordType}
            name="password"
            id="password"
            placeholder="Enter your password"
            className={styles.input}
            required
            aria-required="true"
            aria-invalid={errorMessage ? "true" : "false"}
            aria-describedby={errorMessage ? "login-error" : undefined}
            autoComplete="off"
          />
          <button
            disabled={isMutating || isNavigating}
            type="button"
            className={styles.eye}
            onClick={() =>
              setPasswordType(passwordType === "password" ? "text" : "password")
            }
            aria-label={
              passwordType === "password" ? "Show password" : "Hide password"
            }
          >
            <MdOutlineRemoveRedEye />
          </button>
        </div>

        <Button
          variant="primary"
          type="submit"
          disabled={isMutating || isNavigating}
        >
          {isMutating || isNavigating ? "Logging in..." : "Login"}
        </Button>
      </form>
      {errorMessage && (
        <p
          id="login-error"
          role="alert"
          aria-live="assertive"
          className={styles.error}
        >
          {errorMessage}
        </p>
      )}

      <div className={styles.guestSection}>
        <span className={styles.divider}>or</span>
        <Button
          variant="secondary"
          type="button"
          disabled={isMutating || isNavigating}
          onClick={() => {
            setUsername("guest");
            setPassword("test");
          }}
        >
          Try as Guest
        </Button>
        <p className={styles.guestHint}>
          Click above to fill credentials, then login
        </p>
      </div>
    </section>
  );
}
