import { FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#ffffff",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    backdropFilter: "blur(8px)",
  },
}));

export const StyledDialogContent = styled(DialogContent)({
  padding: "24px",
  "& form": {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  "& > form > div": {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  "& label": {
    fontWeight: 600,
    color: "#1e293b",
    fontSize: "14px",
  },
  "& input": {
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "10px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#1e293b",
    transition: "all 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
    },
    "&::placeholder": {
      color: "#94a3b8",
    },
  },
});

export const StyledDialogActions = styled(DialogActions)({
  padding: "16px 24px",
  gap: "12px",
  justifyContent: "flex-end",
});

export const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "10px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "15px",
  transition: "all 0.2s ease",
  ...(variant === "contained" && {
    background: "var(--color-primary)",
    boxShadow: "0 4px 14px rgba(37, 99, 235, 0.4)",
    "&:hover": {
      background: "var(--color-primary-hover)",
      boxShadow: "0 6px 20px rgba(37, 99, 235, 0.5)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "var(--color-border-gray)",
    borderWidth: "2px",
    color: "#475569",
    "&:hover": {
      borderColor: "#94a3b8",
      backgroundColor: "#f8fafc",
      borderWidth: "2px",
    },
  }),
}));

export const StyledErrorButton = styled(Button)(({ variant }) => ({
  borderRadius: "10px",
  padding: "12px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "15px",
  transition: "all 0.2s ease",
  ...(variant === "contained" && {
    background: "#dc2626",
    boxShadow: "0 4px 14px rgba(220, 38, 38, 0.4)",
    "&:hover": {
      background: "#b91c1c",
      boxShadow: "0 6px 20px rgba(220, 38, 38, 0.5)",
    },
    "&:active": {
      transform: "translateY(0)",
    },
  }),
}));

export const StyledFormControl = styled(FormControl)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#e2e8f0",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#cbd5e1",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#1e293b",
    fontWeight: 600,
    "&.Mui-focused": {
      color: "#2563eb",
    },
  },
});

export default function useAlertMessageStyles() {
  return {
    StyledDialog,
    StyledDialogContent,
    StyledDialogActions,
    StyledButton,
    StyledFormControl,
    StyledErrorButton,
  };
}
