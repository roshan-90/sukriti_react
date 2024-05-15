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

const ModalBillingGroup = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setSelectedOption(null);
  };

  const handleButtonClick = () => {
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(selectedOption);
      setOpen(false);
      setSelectedOption(null);
    }
  };

  const handleChange = (selected) => {
    console.log('selected',selected);
    setSelectedOption(selected)
  }
  const handleVerify = () => {
    
  }

  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '55%', // Adjust the maximum height as needed
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <br/>
        <DialogContent>
          <div style={{ margin: "auto", width: "90%" }}>
                  <FormGroup row>
                    <Label
                      for="Complex Name"
                      sm={3}
                    >
                    <b style={{fontSize:"small"}}> Complex Name</b>
                    </Label>
                    <Col sm={7}>
                      <Input
                        id="complex_name"
                        name="complex_name"
                        placeholder="complex Name"
                        type="text"
                        value={""}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col sm={2}>
                      <Button variant="contained" color="primary" onClick={handleVerify}>
                        Check
                      </Button>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                      <Label
                        for="Address"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}> Address </b> 
                      </Label>
                      <Col sm={9}>
                        <Input
                          id="ADDR"
                          name="ADDR"
                          type="textarea"
                          value={""}
                          onChange={handleChange}
                        />
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

export default ModalBillingGroup
;
