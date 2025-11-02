"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSWRMutationHook } from "../hooks/useSWRMutation";
import { API_PATHS } from "../constants/apiKeys";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import styles from "./page.module.css";

interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { trigger, isMutating, error } = useSWRMutationHook<
    { message: string },
    ChangePasswordData
  >(API_PATHS.CHANGE_PASSWORD, { method: "PATCH" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters long");
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

    await trigger({ currentPassword, newPassword });
    // Check for error from the hook
    if (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to change password"
      );
      return;
    }

    setSuccessMessage("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    // Redirect back after 2 seconds
    setTimeout(() => {
      router.back();
    }, 2000);
  }

  const hasError = !!errorMessage;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Change Password</h1>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isMutating}
                required
                aria-invalid={hasError && !currentPassword}
                aria-describedby={hasError ? "password-error" : undefined}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showCurrentPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isMutating}
                required
                minLength={6}
                aria-invalid={hasError && newPassword.length < 6}
                aria-describedby="password-hint password-error"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
                tabIndex={-1}
              >
                {showNewPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
            <small id="password-hint">Minimum 6 characters</small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className={styles.passwordInputWrapper}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isMutating}
                required
                aria-invalid={
                  hasError &&
                  newPassword !== confirmPassword &&
                  !!confirmPassword
                }
                aria-describedby={hasError ? "password-error" : undefined}
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
              </button>
            </div>
          </div>

          {errorMessage && (
            <div
              id="password-error"
              className={styles.error}
              role="alert"
              aria-live="polite"
            >
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className={styles.success} role="alert" aria-live="polite">
              {successMessage}
            </div>
          )}

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => router.back()}
              className={styles.cancelButton}
              disabled={isMutating}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isMutating}
            >
              {isMutating ? "Changing..." : "Change Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
