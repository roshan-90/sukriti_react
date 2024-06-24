import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'; // Importing react-select
import { setPolicyName } from "../../features/androidManagementSlice";

const ModalCreatePolicy = ({ data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [displayName, setDisplayName] = useState(null); // State for react-select
  const listofPolicy = useSelector((state) => state.androidManagement.listOfPolicy);
  const policyName = useSelector((state) => state.androidManagement.policyName);
  const [selectedDeviceState, setSelectedDeviceState] = useState(null);
  const [formData, setFormData] = useState({
    "cameraDisabled": true,
    "addUserDisabled": true,
    "removeUserDisabled": false,
    "factoryResetDisabled": true,
    "mountPhysicalMediaDisabled": true,
    "safeBootDisabled": true,
    "uninstallAppsDisabled": false,
    "bluetoothConfigDisabled": true,
    "vpnConfigDisabled": false,
    "networkResetDisabled": false,
    "smsDisabled": false,
    "modifyAccountsDisabled": true,
    "outgoingCallsDisabled": true,
    "kioskCustomLauncherEnabled": true,
  })
  const [applicationState, setApplicationState] = useState(false);
  const [kioskCustomization , setkioskCustomization] = useState(false)
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
      let requestBody = {
        state : selectedDeviceState.value,
        policyName: policyName.value,
        name: displayName
      }
      onClickAction(requestBody);
      setOpen(false);
      setDisplayName(null);
    }
  };

  const handleChangePolicy = async (selectionOption) => {
    console.log('selectionOption',selectionOption);
    dispatch(setPolicyName(selectionOption))
  }

  const handleChangeDeviceState = async (selectionOption) => {
    setSelectedDeviceState(selectionOption);
  }
  
  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '85%', // Adjust the maximum height as needed
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
            <Form>
            <FormGroup switch>
              <Label> cameraDisabled </Label>
              <Input
                type="switch"
                checked={formData.cameraDisabled}
                onClick={() => {
                  setFormData(!formData.cameraDisabled);
                }}
              />
            </FormGroup>
            <FormGroup switch>
               <Label> addUserDisabled </Label>
              <Input
                type="switch"
                checked={formData.addUserDisabled}
                onClick={() => {
                  setFormData(!formData.addUserDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> removeUserDisabled </Label>
              <Input
                type="switch"
                checked={formData.removeUserDisabled}
                onClick={() => {
                  setFormData(!formData.removeUserDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> factoryResetDisabled </Label>
              <Input
                type="switch"
                checked={formData.factoryResetDisabled}
                onClick={() => {
                  setFormData(!formData.factoryResetDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> mountPhysicalMediaDisabled </Label>
              <Input
                type="switch"
                checked={formData.mountPhysicalMediaDisabled}
                onClick={() => {
                  setFormData(!formData.mountPhysicalMediaDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> safeBootDisabled </Label>
              <Input
                type="switch"
                checked={formData.safeBootDisabled}
                onClick={() => {
                  setFormData(!formData.safeBootDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> uninstallAppsDisabled </Label>
              <Input
                type="switch"
                checked={formData.uninstallAppsDisabled}
                onClick={() => {
                  setFormData(!formData.uninstallAppsDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> bluetoothConfigDisabled </Label>
              <Input
                type="switch"
                checked={formData.bluetoothConfigDisabled}
                onClick={() => {
                  setFormData(!formData.bluetoothConfigDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> vpnConfigDisabled </Label>
              <Input
                type="switch"
                checked={formData.vpnConfigDisabled}
                onClick={() => {
                  setFormData(!formData.vpnConfigDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> networkResetDisabled </Label>
              <Input
                type="switch"
                checked={formData.networkResetDisabled}
                onClick={() => {
                  setFormData(!formData.networkResetDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> smsDisabled </Label>
              <Input
                type="switch"
                checked={formData.smsDisabled}
                onClick={() => {
                  setFormData(!formData.smsDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> modifyAccountsDisabled </Label>
              <Input
                type="switch"
                checked={formData.modifyAccountsDisabled}
                onClick={() => {
                  setFormData(!formData.modifyAccountsDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> outgoingCallsDisabled </Label>
              <Input
                type="switch"
                checked={formData.outgoingCallsDisabled}
                onClick={() => {
                  setFormData(!formData.outgoingCallsDisabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> kioskCustomLauncherEnabled </Label>
              <Input
                type="switch"
                checked={formData.kioskCustomLauncherEnabled}
                onClick={() => {
                  setFormData(!formData.kioskCustomLauncherEnabled);
                }}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> applications </Label>
              <Input
                type="switch"
                checked={applicationState}
                onClick={() => {
                  setApplicationState(!applicationState);
                }}
              />
              </FormGroup>
              <>
                {applicationState && (
                  <>
                    <Select
                      options={listofPolicy || []}
                      value={policyName}
                      onChange={handleChangePolicy}
                      placeholder="Select Policy"
                      className="select-dropdown"
                    />
                    <br />
                    <Select
                      options={device_state || []}
                      value={selectedDeviceState}
                      onChange={handleChangeDeviceState}
                      placeholder="Select Device State"
                      className="select-dropdown"
                    />
                    <br />
                  </>
                )}
              </>
              <FormGroup switch>
               <Label> kioskCustomization </Label>
              <Input
                type="switch"
                checked={kioskCustomization}
                onClick={() => {
                  setkioskCustomization(!kioskCustomization);
                }}
              />
              </FormGroup>
            </Form>
            <br/>
            <Select
              options={listofPolicy || []}
              value={policyName}
              onChange={handleChangePolicy}
              placeholder="Select Policy"
              className="select-dropdown"
            />
            <br/>
            <Select
              options={device_state || []}
              value={selectedDeviceState}
              onChange={handleChangeDeviceState}
              placeholder="Select Device State"
              className="select-dropdown"
            />
            <br/>
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

export default ModalCreatePolicy;
