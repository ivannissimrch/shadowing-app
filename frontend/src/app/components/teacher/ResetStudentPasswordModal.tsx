"use client";
import { useState } from "react";
import { useTranslations } from "next-intl";
import DialogTitle from "@mui/material/DialogTitle";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import FormHelperText from "@mui/material/FormHelperText";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { API_PATHS } from "../../constants/apiKeys";
import { useSnackbar } from "@/app/SnackbarContext";

interface ResetStudentPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: string;
  studentUsername: string;
}

export default function ResetStudentPasswordModal({
  isOpen,
  onClose,
  studentId,
  studentUsername,
}: ResetStudentPasswordModalProps) {
  const t = useTranslations("teacher");
  const tCommon = useTranslations("common");
  const { showSnackbar } = useSnackbar();
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
  } = useAlertMessageStyles();

  const { trigger, isMutating } = useSWRMutationHook(
    API_PATHS.RESET_STUDENT_PASSWORD(studentId),
    { method: "PATCH" }
  );

  function handleClose() {
    setNewPassword("");
    setShowPassword(false);
    setError("");
    onClose();
  }

  async function handleSubmit() {
    if (newPassword.length < 8) {
      setError(tCommon("passwordTooShort"));
      return;
    }

    try {
      await trigger({ newPassword } as never);
      showSnackbar(t("passwordResetSuccess", { name: studentUsername }), "success");
      handleClose();
    } catch {
      showSnackbar(t("passwordResetError", { name: studentUsername }), "error");
    }
  }

  return (
    <StyledDialog
      aria-modal="true"
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="reset-password-dialog-title"
      disableScrollLock={true}
      keepMounted={false}
      autoFocus={true}
    >
      <DialogTitle
        id="reset-password-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {t("resetPassword")} — {studentUsername}
      </DialogTitle>

      <StyledDialogContent>
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <div>
            <StyledFormControl fullWidth variant="outlined">
              <InputLabel htmlFor="new-password">{tCommon("newPassword")}</InputLabel>
              <OutlinedInput
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setError("");
                }}
                label={tCommon("newPassword")}
                error={!!error}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label={showPassword ? tCommon("hidePassword") : tCommon("showPassword")}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              {error && <FormHelperText error>{error}</FormHelperText>}
            </StyledFormControl>
          </div>
        </form>
      </StyledDialogContent>

      <StyledDialogActions>
        <StyledButton variant="outlined" onClick={handleClose} disabled={isMutating}>
          {tCommon("cancel")}
        </StyledButton>
        <StyledButton
          variant="contained"
          onClick={handleSubmit}
          disabled={isMutating || !newPassword}
        >
          {isMutating ? tCommon("loading") : t("resetPassword")}
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
}
