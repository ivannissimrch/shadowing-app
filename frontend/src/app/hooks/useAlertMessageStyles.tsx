import { FormControl } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/material/styles";

const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    minWidth: "400px",
    maxWidth: "500px",
    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
    backgroundColor: "#fefefe",
  },
  "& .MuiBackdrop-root": {
    backgroundColor: "rgba(224, 242, 254, 0.8)",
    backdropFilter: "blur(4px)",
  },
}));

const StyledDialogContent = styled(DialogContent)({
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
    color: "#374151",
    fontSize: "14px",
  },
  "& input": {
    padding: "12px 16px",
    border: "2px solid #bae6fd",
    borderRadius: "8px",
    fontSize: "16px",
    backgroundColor: "#ffffff",
    color: "#374151",
    transition: "all 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#0ea5e9",
      boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
    },
    "&::placeholder": {
      color: "#9ca3af",
    },
  },
});

const StyledDialogActions = styled(DialogActions)({
  padding: "16px 24px",
  gap: "12px",
  justifyContent: "flex-end",
});

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: "8px",
  padding: "10px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "14px",
  ...(variant === "contained" && {
    backgroundColor: "#0ea5e9",
    boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)",
    "&:hover": {
      backgroundColor: "#0284c7",
      boxShadow: "0 6px 16px rgba(14, 165, 233, 0.5)",
    },
  }),
  ...(variant === "outlined" && {
    borderColor: "#bae6fd",
    color: "#6b7280",
    "&:hover": {
      borderColor: "#7dd3fc",
      backgroundColor: "#f0f9ff",
    },
  }),
}));

const StyledFormControl = styled(FormControl)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#ffffff",
    "& fieldset": {
      borderColor: "#bae6fd",
      borderWidth: "2px",
    },
    "&:hover fieldset": {
      borderColor: "#7dd3fc",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#0ea5e9",
      boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#374151",
    fontWeight: 600,
    "&.Mui-focused": {
      color: "#0ea5e9",
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
  };
}
