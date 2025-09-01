import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function AlertDialog({
  isDialogOpen,
  closeDialog,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}) {
  console.log(isDialogOpen);
  return (
    <Dialog
      open={isDialogOpen}
      onClose={closeDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Submission Successful</DialogTitle>

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Your recording has been Successful submitted for review.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
