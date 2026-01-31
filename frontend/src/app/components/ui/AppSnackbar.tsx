"use client";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { SnackbarSeverity } from "@/app/Types";

interface AppSnackbarProps {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
  onClose: () => void;
}

export default function AppSnackbar({ open, message, severity, onClose }: AppSnackbarProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
