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


const ModalAddApplication = ({ data , setApplicationState}) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const user = useSelector(selectUser);
  const selectedOptionEnterprise = useSelector((state) => state.androidManagement.selectedOptionEnterprise);
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [onCloseAction, setOnCloseAction] = useState(undefined);
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
      setOnCloseAction(() => data.onClose || undefined);
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
    setApplicationState(false);
    onCloseAction();
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
  

  const handleButtonClick = async () => {
    console.log('formData',formData);
    let check;
    check = await handleVerify();
    
    if(formData.packageName == '' || formData.installType == '' || formData.defaultPermissionPolicy == '' || formData.autoUpdateMode == '' || formData.userControlSettings == ''){
      setDialogData({
        title: "Validation Error",
        message: "Please Enter and Select all valid field",
        onClickAction: () => {
          // Handle the action when the user clicks OK
         console.log('handleVerify :->')
        },
      });
      return
    }
    console.log('packageNameVerify',check);
    if(check == false) {
      setDialogData({
        title: "Validation Error",
        message: "Please enter valid application package",
        onClickAction: () => {
          // Handle the action when the user clicks OK
         console.log('handleVerify :->')
        },
      });
      return
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
    }
  };

  const handleChange = (field, value) => {
    console.log('data',{field,value})
    setFormData({ ...formData, [field]: value });  
  };

  const handleVerify = async () => {
    console.log('handle verify function is running',formData.packageName);
    console.log("applications",applications)
    if(formData.packageName == '' || selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) {
      setDialogData({
        title: "Validation Error",
        message: "Please Select Package name and Enterprise",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleVerify package name ");
        },
      })
      return false;
    } else {
      try {
        dispatch(startLoading());
        var result = await executeVerifyPackageNameLambda(user.username, user?.credentials, formData.packageName, selectedOptionEnterprise.value);
        console.log('result',result);
        if(result.statusCode == 200) {
          setPackageNameVerify(true);
          return true;
        } else {
          setDialogData({
            title: "Validation Error",
            message: "Please enter valid application package",
            onClickAction: () => {
              // Handle the action when the user clicks OK
             console.log('handleVerify :->')
            },
          });
          return false 
          // setPackageNameVerify(false);
        }
      } catch (error) {
        handleError(error, 'Error handleVerify package')
      } finally {
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }

    }
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
                onChange={(e) =>
                  handleChange('packageName', e.target.value)
                }
              />
              </Col>
              <Col sm={1}>
              {packageNameVerify == true ? <>
                  <Button color="success"  disabled>
                    <FaCheck />
                  </Button>{' '}
                </> :
                <>
                  <Button color="info" onClick={handleVerify}>
                    check
                  </Button>{' '}
                </>}
              </Col>
              </Row>
              <br />
              <Select
                options={InstallType}
                onChange={(selectedOption) =>
                  handleChange('installType', selectedOption.value)
                }
                placeholder="Select Install Type"
                className="select-dropdown"
              />
              <br />
              <Select
                options={DefaultPermissionPolicy}
                onChange={(selectedOption) =>
                  handleChange(
                    'defaultPermissionPolicy',
                    selectedOption.value
                  )
                }
                placeholder="Select Default Permission Policy"
                className="select-dropdown"
              />
              <br />
              <Select
                options={AutoUpdateMode}
                onChange={(selectedOption) =>
                  handleChange('autoUpdateMode', selectedOption.value)
                }
                placeholder="Select Auto Update Mode"
                className="select-dropdown"
              />
              <br />
              <Select
                options={UserControlSettings}
                onChange={(selectedOption) =>
                  handleChange(
                    'userControlSettings',
                    selectedOption.value
                  )
                }
                placeholder="Select User Control Settings"
                className="select-dropdown"
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

export default ModalAddApplication;
