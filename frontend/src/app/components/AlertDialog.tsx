"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material/styles";
import { useAppContext } from "../AppContext";

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

const StyledButton = styled(Button)(() => ({
  borderRadius: "8px",
  padding: "10px 24px",
  fontWeight: 600,
  textTransform: "none",
  fontSize: "14px",
  backgroundColor: "#0ea5e9",
  boxShadow: "0 4px 12px rgba(14, 165, 233, 0.4)",
  "&:hover": {
    backgroundColor: "#0284c7",
    boxShadow: "0 6px 16px rgba(14, 165, 233, 0.5)",
  },
}));

export default function AlertDialog() {
  const { isAlertDialogOpen, closeAlertDialog } = useAppContext();
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
        Submission Successful
      </DialogTitle>

      <DialogContent sx={{ padding: "24px" }}>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "#374151", fontSize: "16px" }}
        >
          Your recording has been successfully submitted for review.
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
