import * as React from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

const ConfirmDialog = ({ open, title, body, confirmLabel, onConfirm, onClose }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: "'Cinzel', serif" }}>{title || "Confirm"}</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ fontSize: "14px", color: "#3e2723" }}>{body}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          {confirmLabel || "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

