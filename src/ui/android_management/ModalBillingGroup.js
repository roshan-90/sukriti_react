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
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

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
    console.log('formData',formData);
    if(formData.description == '' || formData.name == ''){
      return true;
    }
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(formData);
      setOpen(false);
      setSelectedOption(null);
    }
  };

  const handleChange = (e) => {
    const { name , value } = e.target;
    setFormData({ ...formData, [name]: value });
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
                      for="Billing Group"
                      sm={3}
                    >
                    <b style={{fontSize:"small"}}> Billing Group </b>
                    </Label>
                    <Col sm={9}>
                      <Input
                        id="name"
                        name="name"
                        placeholder="name"
                        type="text"
                        onChange={handleChange}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                      <Label
                        for="Description"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}> Description </b> 
                      </Label>
                      <Col sm={9}>
                        <Input
                          id="description"
                          name="description"
                          type="textarea"
                          placeholder="description"
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
