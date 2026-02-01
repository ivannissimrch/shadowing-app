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
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { FiMail, FiLock, FiSave, FiEye, FiEyeOff, FiCheck, FiGlobe } from "react-icons/fi";

const NATIVE_LANGUAGES = [
  "",
  "Spanish",
  "Mandarin Chinese",
  "Cantonese",
  "Korean",
  "Japanese",
  "Vietnamese",
  "Tagalog",
  "Arabic",
  "Hindi",
  "Portuguese",
  "French",
  "German",
  "Russian",
  "Italian",
  "Polish",
  "Turkish",
  "Thai",
  "Indonesian",
  "Farsi",
  "Dutch",
];

interface UserProfile {
  id: string;
  username: string;
  email: string | null;
  native_language: string | null;
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

  // Native language state
  const [nativeLanguage, setNativeLanguage] = useState("");
  const [nativeLanguageMessage, setNativeLanguageMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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

  // Set initial values from profile
  useEffect(() => {
    if (profile?.email) {
      setEmail(profile.email);
    }
    if (profile?.native_language) {
      setNativeLanguage(profile.native_language);
    }
  }, [profile]);

  // Email mutation
  const { trigger: updateEmail, isMutating: isEmailMutating } = useSWRMutationHook<
    { success: boolean },
    { email: string }
  >(API_PATHS.EMAIL_UPDATE(user?.id || ""), { method: "PATCH" });

  // Native language mutation
  const { trigger: updateNativeLanguage, isMutating: isNativeLanguageMutating } = useSWRMutationHook<
    { success: boolean },
    { nativeLanguage: string }
  >(API_PATHS.NATIVE_LANGUAGE_UPDATE(user?.id || ""), { method: "PATCH" });

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

  const handleNativeLanguageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNativeLanguageMessage(null);

    try {
      await updateNativeLanguage({ nativeLanguage: nativeLanguage || "" });
      setNativeLanguageMessage({ type: "success", text: tSettings("nativeLanguageUpdated") });
    } catch (err) {
      setNativeLanguageMessage({
        type: "error",
        text: err instanceof Error ? err.message : tSettings("nativeLanguageUpdateFailed"),
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

        {/* Native Language */}
        <Grid size={{ xs: 12, md: 6 }}>
          <MainCard>
            <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 2,
                  bgcolor: "success.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiGlobe size={22} color="#2e7d32" />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {tSettings("nativeLanguage")}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {tSettings("nativeLanguageDescription")}
                </Typography>
              </Box>
            </Stack>

            {nativeLanguageMessage && (
              <Alert
                severity={nativeLanguageMessage.type}
                sx={{ mb: 2, borderRadius: 2 }}
                icon={nativeLanguageMessage.type === "success" ? <FiCheck /> : undefined}
              >
                {nativeLanguageMessage.text}
              </Alert>
            )}

            <Box component="form" onSubmit={handleNativeLanguageSubmit}>
              <FormControl fullWidth sx={{ mb: 2.5 }}>
                <InputLabel id="native-language-label">{tSettings("nativeLanguage")}</InputLabel>
                <Select
                  labelId="native-language-label"
                  value={nativeLanguage}
                  onChange={(e) => setNativeLanguage(e.target.value)}
                  disabled={isNativeLanguageMutating}
                  label={tSettings("nativeLanguage")}
                  sx={{
                    borderRadius: 2,
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: 2,
                    }
                  }}
                >
                  <MenuItem value="">
                    <em>{tSettings("notSpecified")}</em>
                  </MenuItem>
                  {NATIVE_LANGUAGES.filter(lang => lang !== "").map((lang) => (
                    <MenuItem key={lang} value={lang}>
                      {lang}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="success"
                disabled={isNativeLanguageMutating}
                startIcon={isNativeLanguageMutating ? <CircularProgress size={16} color="inherit" /> : <FiSave size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                }}
              >
                {isNativeLanguageMutating ? tCommon("saving") : tCommon("save")}
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
