"use client";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAppContext } from "../../AppContext";
import useAlertMessageStyles from "../../hooks/useAlertMessageStyles";

export default function AlertDialog() {
  const {
    isAlertDialogOpen,
    closeAlertDialog,
    alertDialogTitle,
    alertDialogMessage,
  } = useAppContext();

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
          fontWeight: 700,
          fontSize: "20px",
          color: "#1f2937",
          paddingBottom: "8px",
        }}
      >
        {alertDialogTitle}
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "#374151", fontSize: "16px" }}
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
