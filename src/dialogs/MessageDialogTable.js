import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

const MessageDialogTable = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [table, setTable] = useState(null);
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [checkbtn, setcheckbtn] = useState(false)

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setMessage(data.message);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
      setTable(data.table)
      if(data.checkbtn == true) {
        setcheckbtn(true)
      }
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <div style={{ margin: "auto", width: "90%" }}>
          <Typography>{message}</Typography>
          <div dangerouslySetInnerHTML={{ __html: table }} />
        </div>
      </DialogContent>
      <DialogActions>
        {checkbtn && (
        <Button variant="contained" color="primary" onClick={handleClose}>
          Cancel
        </Button>
        )}
        <Button variant="contained" color="success" onClick={handleButtonClick}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default MessageDialogTable;
