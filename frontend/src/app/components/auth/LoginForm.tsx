"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../AuthContext";
import redirectBasedOnRole from "../../helpers/redirectBasedOnRole";
import logger from "../../helpers/logger";
import { AuthResponse } from "@/app/Types";
import { useSWRMutationHook } from "@/app/hooks/useSWRMutation";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
import DarkModeToggle from "../ui/DarkModeToggle";

export default function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { updateToken, token } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMutating, trigger } = useSWRMutationHook<
    AuthResponse,
    { username: string; password: string }
  >("/signin", { method: "POST" });
  const [isNavigating, setIsNavigating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const isLoading = isMutating || isNavigating;

  useEffect(() => {
    try {
      if (token) {
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
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        p: 2,
        position: "relative",
      }}
    >
      {/* Dark mode toggle - positioned absolutely in top right */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1,
        }}
      >
        <DarkModeToggle />
      </Box>

      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Logo/Brand */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                color: "primary.main",
                mb: 1,
              }}
            >
              ShadowSpeak
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to continue
            </Typography>
          </Box>

          {/* Error Alert */}
          {errorMessage && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {errorMessage}
            </Alert>
          )}

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              id="username"
              name="username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrorMessage("");
              }}
              disabled={isLoading}
              required
              inputRef={inputRef}
              autoComplete="username"
              sx={{ mb: 2.5 }}
            />

            <TextField
              fullWidth
              label="Password"
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setErrorMessage("");
              }}
              disabled={isLoading}
              required
              autoComplete="current-password"
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              startIcon={
                isLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <FiLogIn size={18} />
                )
              }
              sx={{
                py: 1.5,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
