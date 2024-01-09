import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const ValidationMessageDialog = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setMessage(data.message);
      setOnClickAction(data.onClickAction);
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = () => {
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      PaperProps={{ style: { width: "26%" } }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div style={{ margin: "auto", width: "90%" }}>
          <Typography>{message}</Typography>
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="primary" onClick={handleButtonClick}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ValidationMessageDialog;
