import { FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";

// Berry theme colors
const colors = {
  primary: {
    main: "#2196f3",
    dark: "#1e88e5",
    light: "#e3f2fd",
  },
  text: {
    primary: "#364152",
    secondary: "#697586",
  },
  grey: {
    100: "#eef2f6",
    200: "#e3e8ef",
    300: "#cdd5df",
    400: "#9da4ae",
  },
  error: {
    main: "#f44336",
    dark: "#c62828",
  },
};

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
    backgroundColor: "#ffffff",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(54, 65, 82, 0.5)",
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
    fontWeight: 500,
    color: colors.text.primary,
    fontSize: "14px",
  },
  "& input": {
    padding: "12px 16px",
    border: `1px solid ${colors.grey[200]}`,
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "#ffffff",
    color: colors.text.primary,
    transition: "border-color 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: colors.primary.main,
      boxShadow: `0 0 0 2px ${colors.primary.light}`,
    },
    "&::placeholder": {
      color: colors.grey[400],
    },
  },
});

export const StyledDialogActions = styled(DialogActions)({
  padding: "16px 24px",
  gap: "12px",
  justifyContent: "flex-end",
});

export const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "14px",
  ...(variant === "contained" && {
    backgroundColor: colors.primary.main,
    color: "#ffffff",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: colors.primary.dark,
      boxShadow: "none",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: colors.grey[300],
    color: colors.text.secondary,
    "&:hover": {
      borderColor: colors.grey[400],
      backgroundColor: colors.grey[100],
    },
  }),
}));

export const StyledErrorButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "10px 20px",
  fontWeight: 500,
  textTransform: "none",
  fontSize: "14px",
  ...(variant === "contained" && {
    backgroundColor: colors.error.main,
    color: "#ffffff",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: colors.error.dark,
      boxShadow: "none",
    },
  }),
}));

export const StyledFormControl = styled(FormControl)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: colors.grey[200],
    },
    "&:hover fieldset": {
      borderColor: colors.grey[300],
    },
    "&.Mui-focused fieldset": {
      borderColor: colors.primary.main,
      boxShadow: `0 0 0 2px ${colors.primary.light}`,
    },
  },
  "& .MuiInputLabel-root": {
    color: colors.text.primary,
    fontWeight: 500,
    "&.Mui-focused": {
      color: colors.primary.main,
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
