import React, { useState, useEffect } from "react";
import {
 
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";
import {  Button} from 'reactstrap';
import { useDispatch } from "react-redux";
import TableComponent from './TableComponent';

const ModalDeletePolicy = ({ data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
 

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

  

  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="lg" fullWidth
      PaperProps={{
        style: {
          height: '85%', // Adjust the maximum height as needed
          width: '80%'
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TableComponent staticData={data.data} />
            <br />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success">
          Okay
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ModalDeletePolicy;
