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

const ModalEditEnterprise = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [displayName, setDisplayName] = useState(""); // State for react-select
  const [contactEmail, setContactEmail] = useState(""); // State for react-select
  const [dataProtectionOfficerName, setDataProtectionOfficerName] = useState(""); // State for react-select
  const [dataProtectionOfficerEmail, setDataProtectionOfficerEmail] = useState(""); // State for react-select
  const [dataProtectionOfficerPhone, setDataProtectionOfficerPhone] = useState(""); // State for react-select
  const [euRepredentativeName, setEuRepredentativeName] = useState(""); // State for react-select
  const [euRepredentativeEmail, setEuRepredentativeEmail] = useState(""); // State for react-select
  const [euRepredentativePhone, setEuRepredentativePhone] = useState(""); // State for react-select

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
    let contactInfo = {
      contactEmail: contactEmail,
      dataProtectionOfficerEmail: dataProtectionOfficerEmail,
      dataProtectionOfficerName: dataProtectionOfficerName,
      dataProtectionOfficerPhone: dataProtectionOfficerPhone,
      euRepresentativeEmail: euRepredentativeEmail,
      euRepresentativeName: euRepredentativeName,
      euRepresentativePhone: euRepredentativePhone
    }
    console.log('object', {displayName, contactEmail, dataProtectionOfficerName, dataProtectionOfficerEmail, dataProtectionOfficerPhone, euRepredentativeName, euRepredentativeEmail, euRepredentativePhone});

    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(displayName, contactInfo);
      setOpen(false);
      setDisplayName(null);
    }
  };

  // const handleChange = (selected) => {
  //   console.log('selected',selected);
  //   setSelectedOption(selected)
  // }
  
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
              <Label
                check
                for="Contact Info"
              >
                  Contact Info
              </Label>
              <br/>
              <Input
                id="contactEmail"
                name="contactEmail"
                placeholder="Please Enter contact Email"
                type="text"
                onChange= {(e) => setContactEmail(e.target.value)}
              />
              <br/>
               <Input
                id="dataProtectionOfficerName"
                name="dataProtectionOfficerName"
                placeholder="data Protection Officer Name"
                type="text"
                onChange= {(e) => setDataProtectionOfficerName(e.target.value)}
              />
              <br/>
               <Input
                id="dataProtectionOfficerEmail"
                name="dataProtectionOfficerEmail"
                placeholder="data Protection Officer Email"
                type="text"
                onChange= {(e) => setDataProtectionOfficerEmail(e.target.value)}
              />
              <br/>
               <Input
                id="dataProtectionOfficerPhone"
                name="dataProtectionOfficerPhone"
                placeholder="data Protection Officer Phone"
                type="text"
                onChange= {(e) => setDataProtectionOfficerPhone(e.target.value)}
              />
              <br/>
               <Input
                id="EURepresentativeName"
                name="EURepresentativeName"
                placeholder="EU Representative Name"
                type="text"
                onChange= {(e) => setEuRepredentativeName(e.target.value)}
              />
              <br/>
               <Input
                id="EURepresentativeEmail"
                name="EURepresentativeEmail"
                placeholder="EU Representative Email"
                type="text"
                onChange= {(e) => setEuRepredentativeEmail(e.target.value)}
              />
              <br/>
               <Input
                id="EURepresentativePhone"
                name="EURepresentativePhone"
                placeholder="EU Representative Phone"
                type="text"
                onChange= {(e) => setEuRepredentativePhone(e.target.value)}
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

export default ModalEditEnterprise
;
