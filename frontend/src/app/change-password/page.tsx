"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "../AppContext";
import { useSWRMutationHook } from "../hooks/useSWRMutation";
import { API_PATHS } from "../constants/apiKeys";
import styles from "./change-password.module.css";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token } = useAppContext();
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { trigger, isMutating, error } = useSWRMutationHook<
    { success: boolean; message: string },
    { currentPassword: string; newPassword: string }
  >(API_PATHS.PASSWORD_CHANGE(user?.id || ""), { method: "PATCH" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (newPassword.length < 8) {
      setErrorMessage("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setErrorMessage("New passwords do not match");
      return;
    }
    if (currentPassword === newPassword) {
      setErrorMessage("New password must be different from current password");
      return;
    }

    const result = await trigger({
      currentPassword,
      newPassword,
    });

    if (!result || error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to change password"
      );
      return;
    }

    setSuccessMessage("Password changed successfully! Redirecting...");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setTimeout(() => {
      router.push(user?.role === "teacher" ? "/teacher" : "/lessons");
    }, 2000);
  };

  return (
    <section className={styles.container}>
      <h1>Change Password</h1>
      <p className={styles.subtitle}>
        Update your password to keep your account secure
      </p>

      <form className={styles.form} onSubmit={handleSubmit}>
        <label htmlFor="currentPassword">Current Password:</label>
        <input
          type="password"
          id="currentPassword"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
          className={styles.input}
          placeholder="Enter current password"
          autoComplete="current-password"
          disabled={isMutating}
          aria-required="true"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? "password-error" : undefined}
        />

        <label htmlFor="newPassword">
          New Password (minimum 8 characters):
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
          className={styles.input}
          placeholder="Enter new password"
          autoComplete="new-password"
          disabled={isMutating}
          aria-required="true"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? "password-error" : undefined}
        />

        <label htmlFor="confirmPassword">Confirm New Password:</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          className={styles.input}
          placeholder="Confirm new password"
          autoComplete="new-password"
          disabled={isMutating}
          aria-required="true"
          aria-invalid={errorMessage ? "true" : "false"}
          aria-describedby={errorMessage ? "password-error" : undefined}
        />

        {errorMessage && (
          <p
            id="password-error"
            role="alert"
            aria-live="assertive"
            className={styles.error}
          >
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p role="alert" aria-live="polite" className={styles.success}>
            {successMessage}
          </p>
        )}

        <button type="submit" disabled={isMutating} className={styles.button}>
          {isMutating ? "Changing Password..." : "Change Password"}
        </button>
      </form>

      <div className={styles.helperText}>
        <p>Password requirements:</p>
        <ul>
          <li>At least 8 characters long</li>
          <li>Different from your current password</li>
        </ul>
      </div>
    </section>
  );
}
