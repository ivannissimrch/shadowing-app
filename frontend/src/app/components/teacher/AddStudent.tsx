"use client";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { ErrorBoundary } from "react-error-boundary";
import { mutate } from "swr";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { AuthResponse } from "@/app/Types";

interface AddStudentProps {
  isAddStudentDialogOpen: boolean;
  closeAddStudentDialog: () => void;
}

export default function AddStudent({
  isAddStudentDialogOpen,
  closeAddStudentDialog,
}: AddStudentProps) {
  const t = useTranslations("teacher");
  const tAuth = useTranslations("auth");
  const tCommon = useTranslations("common");
  const tErrors = useTranslations("errors");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
  } = useAlertMessageStyles();

  const { trigger, isMutating } = useSWRMutationHook<
    AuthResponse,
    { username: string; password: string; email?: string }
  >(
    API_PATHS.USERS,
    { method: "POST" },
    {
      onSuccess: () => {
        mutate(API_PATHS.USERS);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setErrorMessage(tErrors("fillAllFields"));
      return;
    }
    setErrorMessage("");

    try {
      await trigger({
        username,
        password,
        email: email || undefined,
      });

      setUsername("");
      setEmail("");
      setPassword("");
      closeAddStudentDialog();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : tErrors("failedToAdd")
      );
    }
  };

  return (
    <ErrorBoundary
      fallback={
        <>
          <div>Something went wrong.</div>
        </>
      }
    >
      {" "}
      <StyledDialog
        open={isAddStudentDialogOpen}
        onClose={closeAddStudentDialog}
        aria-labelledby="add-student-dialog-title"
        disableScrollLock={true}
        keepMounted={false}
        autoFocus={true}
        aria-modal="true"
      >
        <DialogTitle
          id="add-student-dialog-title"
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "text.primary",
            pb: 1,
          }}
        >
          {t("addStudent")}
        </DialogTitle>
        <StyledDialogContent>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username">{tAuth("username")}</label>
              <input
                aria-required="true"
                id="username"
                type="text"
                value={username}
                onChange={(e) => {
                  setErrorMessage("");
                  setUsername(e.target.value);
                }}
                placeholder={tAuth("enterUsername")}
                autoComplete="username"
                required
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "form-error" : undefined}
              />
            </div>

            <div>
              <label htmlFor="email">{tAuth("email")} ({t("optional")})</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setErrorMessage("");
                  setEmail(e.target.value);
                }}
                placeholder={t("enterStudentEmail")}
                autoComplete="email"
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "form-error" : undefined}
              />
            </div>

            <div>
              <label htmlFor="password">{tAuth("password")}</label>
              <input
                required
                aria-required="true"
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage("");
                }}
                placeholder={tAuth("enterPassword")}
                autoComplete="new-password"
                aria-invalid={errorMessage ? "true" : "false"}
                aria-describedby={errorMessage ? "form-error" : undefined}
              />
            </div>
          </form>

          {errorMessage && (
            <div
              id="form-error"
              role="alert"
              aria-live="assertive"
              style={{ color: "#f44336", marginTop: "10px", fontSize: "14px" }}
            >
              {errorMessage}
            </div>
          )}
        </StyledDialogContent>
        <StyledDialogActions>
          <StyledButton variant="outlined" onClick={closeAddStudentDialog}>
            {tCommon("cancel")}
          </StyledButton>
          <StyledButton
            variant="contained"
            type="submit"
            onClick={handleSubmit}
            disabled={isMutating}
          >
            {isMutating ? t("addingStudent") : t("addStudent")}
          </StyledButton>
        </StyledDialogActions>
      </StyledDialog>
    </ErrorBoundary>
  );
}
