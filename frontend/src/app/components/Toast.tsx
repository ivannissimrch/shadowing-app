"use client";
import { useAppContext } from "../AppContext";
import { Snackbar } from "@mui/material";

export function Toast() {
  const { isSnackBarOpen, closeSnackBar } = useAppContext();
  return (
    <Snackbar
      open={isSnackBarOpen}
      onClose={closeSnackBar}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      autoHideDuration={1000}
      message="Audio submitted successfully!"
    />
  );
}
