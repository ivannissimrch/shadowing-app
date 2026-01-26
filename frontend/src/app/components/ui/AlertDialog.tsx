"use client";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAlertContext } from "../../AlertContext";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";

export default function AlertDialog() {
  const {
    isAlertDialogOpen,
    closeAlertDialog,
    alertDialogTitle,
    alertDialogMessage,
  } = useAlertContext();

  const { StyledDialog, StyledButton } = useAlertMessageStyles();
  return (
    <StyledDialog
      open={isAlertDialogOpen}
      onClose={closeAlertDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 1,
        }}
      >
        {alertDialogTitle}
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "text.secondary", fontSize: "0.875rem" }}
        >
          {alertDialogMessage}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px", justifyContent: "flex-end" }}>
        <StyledButton variant="contained" onClick={closeAlertDialog} autoFocus>
          Close
        </StyledButton>
      </DialogActions>
    </StyledDialog>
  );
}
