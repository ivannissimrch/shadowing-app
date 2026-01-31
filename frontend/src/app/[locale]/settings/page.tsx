"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useAuthContext } from "../../AuthContext";
import { useSWRMutationHook } from "../../hooks/useSWRMutation";
import { useSWRAxios } from "../../hooks/useSWRAxios";
import { API_PATHS } from "../../constants/apiKeys";
import MainCard from "../../components/ui/MainCard";
import Transitions from "../../components/ui/Transitions";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { FiMail, FiLock, FiSave, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";

interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  role: string;
}

export default function SettingsPage() {
  const t = useTranslations("auth");
  const tSettings = useTranslations("settings");
  const tCommon = useTranslations("common");
  const { token } = useAuthContext();
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  // Email state
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Fetch current user profile
  const { data: profile } = useSWRAxios<UserProfile>(
    user?.id ? API_PATHS.USER_PROFILE(user.id) : null
  );

  // Set initial email from profile
  useEffect(() => {
    if (profile?.email) {
      setEmail(profile.email);
    }
  }, [profile]);

  // Email mutation
  const { trigger: updateEmail, isMutating: isEmailMutating } = useSWRMutationHook<
    { success: boolean },
    { email: string }
  >(API_PATHS.EMAIL_UPDATE(user?.id || ""), { method: "PATCH" });

  // Password mutation
  const { trigger: updatePassword, isMutating: isPasswordMutating } = useSWRMutationHook<
    { success: boolean },
    { currentPassword: string; newPassword: string }
  >(API_PATHS.PASSWORD_CHANGE(user?.id || ""), { method: "PATCH" });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMessage(null);

    try {
      await updateEmail({ email: email || "" });
      setEmailMessage({ type: "success", text: tSettings("emailUpdated") });
    } catch (err) {
      setEmailMessage({
        type: "error",
        text: err instanceof Error ? err.message : tSettings("emailUpdateFailed"),
      });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 8) {
      setPasswordMessage({ type: "error", text: t("passwordTooShort") });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: t("passwordMismatch") });
      return;
    }
    if (currentPassword === newPassword) {
      setPasswordMessage({ type: "error", text: t("passwordSameAsCurrent") });
      return;
    }

    try {
      await updatePassword({ currentPassword, newPassword });
      setPasswordMessage({ type: "success", text: t("passwordChanged") });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err instanceof Error ? err.message : t("passwordMismatch"),
      });
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 600, color: "text.primary", mb: 3 }}>
        {tSettings("title")}
      </Typography>

      <Transitions type="fade">
        <Grid container spacing={3}>
        {/* Email Notifications */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiMail size={22} color="#1976d2" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {tSettings("emailNotifications")}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {tSettings("emailDescription")}
                </Typography>
              </Box>
            </Stack>

            {emailMessage && (
              <Alert
                severity={emailMessage.type}
                sx={{ mb: 2, borderRadius: 2 }}
                icon={emailMessage.type === "success" ? <FiCheck /> : undefined}
              >
                {emailMessage.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleEmailSubmit}>
              <TextField
                fullWidth
                type="email"
                label={t("email")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isEmailMutating}
                placeholder={tSettings("enterEmail")}
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <FiMail size={18} color="#666" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={isEmailMutating}
                startIcon={isEmailMutating ? <CircularProgress size={16} color="inherit" /> : <FiSave size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {isEmailMutating ? tCommon("saving") : tCommon("save")}
              </Button>
            </Box>
          </MainCard>
        </Grid>

        {/* Change Password */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "secondary.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiLock size={22} color="#9c27b0" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {t("changePassword")}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {t("passwordRequirements")} {t("minCharacters")}
                </Typography>
              </Box>
            </Stack>

            {passwordMessage && (
              <Alert
                severity={passwordMessage.type}
                sx={{ mb: 2, borderRadius: 2 }}
                icon={passwordMessage.type === "success" ? <FiCheck /> : undefined}
              >
                {passwordMessage.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                type={showCurrentPassword ? "text" : "password"}
                label={t("currentPassword")}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={isPasswordMutating}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          edge="end"
                          size="small"
                        >
                          {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                type={showNewPassword ? "text" : "password"}
                label={t("newPassword")}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isPasswordMutating}
                required
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          edge="end"
                          size="small"
                        >
                          {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <TextField
                fullWidth
                type="password"
                label={t("confirmPassword")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPasswordMutating}
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  }
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={isPasswordMutating}
                startIcon={isPasswordMutating ? <CircularProgress size={16} color="inherit" /> : <FiLock size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {isPasswordMutating ? t("changingPassword") : t("changePassword")}
              </Button>
            </Box>
          </MainCard>
        </Grid>
      </Grid>
      </Transitions>
    </Box>
  );
}
