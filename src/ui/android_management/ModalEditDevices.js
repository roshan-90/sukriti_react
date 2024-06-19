import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Input , Label} from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'; // Importing react-select
import { setPolicyName } from "../../features/androidManagementSlice";

const ModalEditDevices = ({ data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [displayName, setDisplayName] = useState(null); // State for react-select
  const listofPolicy = useSelector((state) => state.androidManagement.listOfPolicy);
  const policyName = useSelector((state) => state.androidManagement.policyName);

  const device_state = [
    { label: 'DEVICE_STATE_UNSPECIFIED', value: 'DEVICE_STATE_UNSPECIFIED' },
    { label: 'ACTIVE', value: 'ACTIVE' },
    { label: 'DISABLED', value: 'DISABLED' },
    { label: 'DELETED', value: 'DELETED' },
    { label: 'PROVISIONING', value: 'PROVISIONING' },
    { label: 'LOST', value: 'LOST' },
    { label: 'PREPARING_FOR_MIGRATION', value: 'PREPARING_FOR_MIGRATION' },
    { label: 'DEACTIVATED_BY_DEVICE_FINANCE', value: 'DEACTIVATED_BY_DEVICE_FINANCE' }
  ];

 

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
    setDisplayName(null);
  };

  const handleButtonClick = () => {
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(displayName);
      setOpen(false);
      setDisplayName(null);
    }
  };

  const handleChangePolicy = async (selectionOption) => {
    console.log('selectionOption',selectionOption);
    dispatch(setPolicyName(selectionOption))
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
        <DialogContent>
          <div style={{ margin: "auto", width: "90%" }}>
              <Label
                    check
                    for="Enterprise Name"
                  >
                    Enterprise Name
                </Label>
              <Input
                id="enterprise"
                name="enterprise"
                placeholder="eneterprise"
                type="text"
                disabled={true}
                value={message}
              />
            <br/>
            <Input
                id="displayName"
                name="displayName"
                placeholder="Please Enter displayName"
                type="text"
                onChange= {(e) => setDisplayName(e.target.value)}
              />
            <br/>
            <Select
              options={listofPolicy || []}
              value={policyName}
              onChange={handleChangePolicy}
              placeholder="Select Policy"
              className="select-dropdown"
            />
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

export default ModalEditDevices
;
