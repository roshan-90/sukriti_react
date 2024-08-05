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
import {Col, Form, FormGroup, Label, Input } from 'reactstrap';

const ModalShareQR = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const [email, setEmail] = useState('')
  const [validationEmail, setvalidationEmail] = useState(null);

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
      setvalidationEmail(null);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setSelectedOption(null);
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleButtonClick = () => {
    console.log('email',email);
    if(email == ''){
      setvalidationEmail('Please enter valid email address')
      return true;
    }
    if(validateEmail(email)){
      console.log('email valid');
    } else {
      console.log('email not valid');
      setvalidationEmail('email address is not valid')
      return true;
    }

    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(email);
      setOpen(false);
      setSelectedOption(null);
    }
  };

  const handleChange = (e) => {
    setvalidationEmail(null);
    setEmail(e.target.value);
  }

  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '40%', // Adjust the maximum height as needed
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <br/>
        <DialogContent>
          <div style={{ margin: "auto", width: "70%" }}>
              <FormGroup row>
                <Label
                  for="Email"
                  sm={3}
                >
                <b style={{fontSize:"small"}}> Email </b>
                </Label>
                <Col sm={9}>
                  <Input
                    id="email"
                    name="email"
                    placeholder="Please Enter Email"
                    type="email"
                    onChange={handleChange}
                  />
                  <b style={{fontSize:"small", color: 'red'}}> {validationEmail} </b>
                </Col>
              </FormGroup>
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

export default ModalShareQR;
