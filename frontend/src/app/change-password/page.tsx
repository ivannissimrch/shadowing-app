"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../AuthContext";
import { useSWRMutationHook } from "../hooks/useSWRMutation";
import { API_PATHS } from "../constants/apiKeys";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FiLock, FiCheck, FiEye, FiEyeOff } from "react-icons/fi";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { token } = useAuthContext();
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { trigger, isMutating } = useSWRMutationHook<
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

    try {
      await trigger({
        currentPassword,
        newPassword,
      });

      setSuccessMessage("Password changed successfully! Redirecting...");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push(user?.role === "teacher" ? "/teacher" : "/student/lessons");
      }, 2000);
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to change password"
      );
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Card
        sx={{
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
            >
              Change Password
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Update your password to keep your account secure
            </Typography>
          </Box>

          {/* Alerts */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              type={showCurrentPassword ? "text" : "password"}
              label="Current Password"
              id="currentPassword"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isMutating}
              required
              autoComplete="current-password"
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showCurrentPassword ? "Hide password" : "Show password"}
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
              label="New Password (minimum 8 characters)"
              id="newPassword"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isMutating}
              required
              inputProps={{ minLength: 8 }}
              autoComplete="new-password"
              sx={{ mb: 2.5 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showNewPassword ? "Hide password" : "Show password"}
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
              type={showConfirmPassword ? "text" : "password"}
              label="Confirm New Password"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isMutating}
              required
              inputProps={{ minLength: 8 }}
              autoComplete="new-password"
              sx={{ mb: 3 }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isMutating}
              startIcon={
                isMutating ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FiLock size={18} />
                )
              }
              sx={{
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {isMutating ? "Changing Password..." : "Change Password"}
            </Button>
          </Box>

          {/* Helper Text */}
          <Box sx={{ mt: 3 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, mb: 1 }}
            >
              Password requirements:
            </Typography>
            <List dense disablePadding>
              <ListItem disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <FiCheck size={14} color="#697586" />
                </ListItemIcon>
                <ListItemText
                  primary="At least 8 characters long"
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
              <ListItem disableGutters sx={{ py: 0.25 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <FiCheck size={14} color="#697586" />
                </ListItemIcon>
                <ListItemText
                  primary="Different from your current password"
                  primaryTypographyProps={{
                    variant: "body2",
                    color: "text.secondary",
                  }}
                />
              </ListItem>
            </List>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
