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
import {Col, Row, FormGroup, Label, Input } from 'reactstrap';
import { FaCheck } from "react-icons/fa";
import { executeVerifyPackageNameLambda } from "../../awsClients/androidEnterpriseLambda";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/authenticationSlice";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure


const ModalUpdateApplication = ({ data , setApplicationState}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const selectedOptionEnterprise = useSelector((state) => state.androidManagement.selectedOptionEnterprise);
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [packageNameVerify, setPackageNameVerify ] = useState(null);
  const [applications, setApplications] = useState([]);
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [formData, setFormData] = useState({
    packageName: '',
    installType: '',
    defaultPermissionPolicy: '',
    autoUpdateMode: '',
    userControlSettings: ''
  });
  const [selectedInstallType,setSelectedInstallType] = useState(null);
  const [selectedDefaultPermissionPolicy,setSelectedDefaultPermissionPolicy] = useState(null);
  const [selectedAutoUpdateMode,setSelectedAutoUpdateMode] = useState(null);
  const [selectedUserControlSettings,setSelectedUserControlSettings] = useState(null);
  
  const UserControlSettings = [
    { label: 'USER_CONTROL_SETTINGS_UNSPECIFIED', value: 'USER_CONTROL_SETTINGS_UNSPECIFIED' },
    { label: 'USER_CONTROL_ALLOWED', value: 'USER_CONTROL_ALLOWED' },
    { label: 'USER_CONTROL_DISALLOWED', value: 'USER_CONTROL_DISALLOWED' },
  ];
  const InstallType = [
    { label: 'INSTALL_TYPE_UNSPECIFIED', value: 'INSTALL_TYPE_UNSPECIFIED' },
    { label: 'PREINSTALLED', value: 'PREINSTALLED' },
    { label: 'FORCE_INSTALLED', value: 'FORCE_INSTALLED' },
    { label: 'BLOCKED', value: 'BLOCKED' },
    { label: 'AVAILABLE', value: 'AVAILABLE' },
    { label: 'REQUIRED_FOR_SETUP', value: 'REQUIRED_FOR_SETUP' },
  ];

  const DefaultPermissionPolicy = [
    { label: 'PERMISSION_POLICY_UNSPECIFIED', value: 'PERMISSION_POLICY_UNSPECIFIED' },
    { label: 'PROMPT', value: 'PROMPT' },
    { label: 'GRANT', value: 'GRANT' },
    { label: 'DENY', value: 'DENY' }
  ];

  const AutoUpdateMode = [
    { label: 'AUTO_UPDATE_MODE_UNSPECIFIED', value: 'AUTO_UPDATE_MODE_UNSPECIFIED' },
    { label: 'AUTO_UPDATE_DEFAULT', value: 'AUTO_UPDATE_DEFAULT' },
    { label: 'AUTO_UPDATE_POSTPONED', value: 'AUTO_UPDATE_POSTPONED' },
    { label: 'AUTO_UPDATE_HIGH_PRIORITY', value: 'AUTO_UPDATE_HIGH_PRIORITY' }
  ];

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
      console.log('data',data.data);
      setFormData({
        packageName: data.data.packageName,
        installType: data.data.installType,
        defaultPermissionPolicy: data.data.defaultPermissionPolicy,
        autoUpdateMode: data.data.autoUpdateMode,
        userControlSettings: data.data.userControlSettings
      })
      setSelectedInstallType({ label: data.data.installType, value: data.data.installType })
      setSelectedDefaultPermissionPolicy({ label: data.data.defaultPermissionPolicy, value: data.data.defaultPermissionPolicy })
      setSelectedAutoUpdateMode({ label: data.data.autoUpdateMode, value: data.data.autoUpdateMode })
      setSelectedUserControlSettings({ label: data.data.userControlSettings, value: data.data.userControlSettings })
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setApplicationState(false);
  };

  const handleError = (err, Custommessage, onclick = null) => {
    console.log("error -->", err);
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    }
  };
  

  const handleButtonClick = () => {
    console.log('formData',formData);
    if(formData.packageName == '' || formData.installType == '' || formData.defaultPermissionPolicy == '' || formData.autoUpdateMode == '' || formData.userControlSettings == ''){
      return true;
    }
    handleClose();
    if (onClickAction !== undefined) {
      onClickAction(formData);
      setOpen(false);
      setFormData({
        packageName: '',
        installType: '',
        defaultPermissionPolicy: '',
        autoUpdateMode: '',
        userControlSettings: ''
      })
      setSelectedInstallType(null)
      setSelectedDefaultPermissionPolicy(null)
      setSelectedAutoUpdateMode(null)
      setSelectedUserControlSettings(null)
    }
  };

  // const handleChange = (field, value) => {
  //   console.log('data',{field,value})
  //   setFormData({ ...formData, [field]: value });  
  // };

  const handleinstallType = (selectOption) => {
    console.log('selectOption',selectOption)
    setSelectedInstallType(selectOption)
    setFormData({ ...formData, installType: selectOption.value });
  }
  const handleDefaultPermissionPolicy = (selectOption) => {
    console.log('selectOption',selectOption)
    setSelectedDefaultPermissionPolicy(selectOption)
    setFormData({ ...formData, defaultPermissionPolicy: selectOption.value });
  }

  const handleAutoUpdateMode = (selectOption) => {
    console.log('selectOption',selectOption)
    setSelectedAutoUpdateMode(selectOption)
    setFormData({ ...formData, autoUpdateMode: selectOption.value });
  }
  const handleUserControlSettings = (selectOption) => {
    console.log('selectOption',selectOption)
    setSelectedUserControlSettings(selectOption)
    setFormData({ ...formData, userControlSettings: selectOption.value });
  }


  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '75%', // Adjust the maximum height as needed
          minWidth: '55%'
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <br/>
        {isLoading && (
          <div className="loader-container">
            <CircularProgress
              className="loader"
              style={{ color: "rgb(93 192 166)" }}
            />
          </div>
        )}
        <MessageDialog data={dialogData} />
        <DialogContent>
          <div style={{ margin: "auto", width: "90%" }}>
          <>
              <Label check for={`package_name`}>
                Package Name
              </Label>
              <Row>
              <Col sm={9}>
              <Input
                id={`package_name`}
                name="package_name"
                placeholder="Enter Package name"
                type="text"
                disabled={true}
                value={formData.packageName}
              />
              </Col>
              </Row>
              <br />
              <Select
                options={InstallType}
                onChange={(selectedOption) =>
                  handleinstallType(selectedOption)
                }
                placeholder="Select Install Type"
                className="select-dropdown"
                value={selectedInstallType}
              />
              <br />
              <Select
                options={DefaultPermissionPolicy}
                onChange={(selectedOption) =>
                  handleDefaultPermissionPolicy(selectedOption)
                }
                placeholder="Select Default Permission Policy"
                className="select-dropdown"
                value={selectedDefaultPermissionPolicy}
              />
              <br />
              <Select
                options={AutoUpdateMode}
                onChange={(selectedOption) =>
                  handleAutoUpdateMode(selectedOption)
                }
                placeholder="Select Auto Update Mode"
                className="select-dropdown"
                value={selectedAutoUpdateMode}
              />
              <br />
              <Select
                options={UserControlSettings}
                onChange={(selectedOption) =>
                  handleUserControlSettings(selectedOption)
                }
                placeholder="Select User Control Settings"
                className="select-dropdown"
                value={selectedUserControlSettings}
              />
              <br />
              {/* <Button
                // onClick={() => handleRemoveApplication()}
                color="danger"
              >
                Delete Application
              </Button> */}
            </>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="success" onClick={handleButtonClick}>
            Update
          </Button>
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ModalUpdateApplication;
