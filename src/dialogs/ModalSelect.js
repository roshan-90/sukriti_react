import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Select from 'react-select'; // Importing react-select

const ModalSelect = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setMessage(data.message);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleButtonClick = () => {
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(selectedOption);
    }
  };

  const handleChange = (selected) => {
    console.log('selected',selected);
    setSelectedOption(selected)
  }
  
  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <div style={{ margin: "auto", width: "90%" }}>
          <Select options={data.options || []} value={selectedOption} onChange={handleChange} placeholder={data.placeHolder} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleButtonClick}>
            Submit
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ModalSelect
;
