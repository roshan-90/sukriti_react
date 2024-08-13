import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {  Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import Select from 'react-select'; // Importing react-select
import TableComponent from './TableComponent';
import ModalAddApplication from "./ModalAddApplication";
import ModalUpdateApplication from './ModalUpdateApplication';
import { Row,Col} from 'reactstrap';
import { BiMaleFemale } from "react-icons/bi";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { GoPackage } from "react-icons/go";
import './common.css'

const ModalUpdatePolicy = ({ data }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const listofPolicy = useSelector((state) => state.androidManagement.listOfPolicy);
  const Selectedpolicy = useSelector((state) => state.androidManagement.policyName);
  const [policyName, setPolicyName] = useState('');
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [selectedDeviceState, setSelectedDeviceState] = useState(null);
  const [powerButtonActions, setPowerButtonActions] = useState(null);
  const [systemErrorWarnings , setSystemErrorWarnings] = useState(null);
  const [systemNavigation , setSystemNavigation] = useState(null);
  const [statusBar, setStatusBar] = useState(null);
  const [deviceSettings, setDeviceSettings] = useState(null);
  const [formData, setFormData] = useState({
    "cameraDisabled": false,
    "addUserDisabled": false,
    "removeUserDisabled": false,
    "factoryResetDisabled": false,
    "mountPhysicalMediaDisabled": false,
    "safeBootDisabled": false,
    "uninstallAppsDisabled": false,
    "bluetoothConfigDisabled": false,
    "vpnConfigDisabled": false,
    "networkResetDisabled": false,
    "smsDisabled": false,
    "modifyAccountsDisabled": false,
    "outgoingCallsDisabled": false,
    "kioskCustomLauncherEnabled": false,
  })
  const [applicationState, setApplicationState] = useState(false);
  const [kioskCustomization , setkioskCustomization] = useState(false)
  const [applications, setApplications] = useState([]);
  const [editApplication, setEditApplication] = useState(false)
  const [modalupdateApplication, setModalUpdateApplication] = useState(null);
  const [chooseKiosk , setChooseKiosk] = useState(false);
  const [modalAddApplication, setModalAddApplication] = useState(null);
  const [selectedKiosk, setSelectedKiosk] = useState(null);


  const InstallType = [
    { label: 'INSTALL_TYPE_UNSPECIFIED', value: 'INSTALL_TYPE_UNSPECIFIED' },
    { label: 'PREINSTALLED', value: 'PREINSTALLED' },
    { label: 'FORCE_INSTALLED', value: 'FORCE_INSTALLED' },
    { label: 'BLOCKED', value: 'BLOCKED' },
    { label: 'AVAILABLE', value: 'AVAILABLE' },
    { label: 'REQUIRED_FOR_SETUP', value: 'REQUIRED_FOR_SETUP' },
    { label: 'KIOSK', value: 'KIOSK' }
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

  const UserControlSettings = [
    { label: 'USER_CONTROL_SETTINGS_UNSPECIFIED', value: 'USER_CONTROL_SETTINGS_UNSPECIFIED' },
    { label: 'USER_CONTROL_ALLOWED', value: 'USER_CONTROL_ALLOWED' },
    { label: 'USER_CONTROL_DISALLOWED', value: 'USER_CONTROL_DISALLOWED' },
  ];

 const PowerButtonActions = [
    { label: 'POWER_BUTTON_ACTIONS_UNSPECIFIED', value: 'POWER_BUTTON_ACTIONS_UNSPECIFIED' },
    { label: 'POWER_BUTTON_AVAILABLE', value: 'POWER_BUTTON_AVAILABLE' },
    { label: 'POWER_BUTTON_BLOCKED', value: 'POWER_BUTTON_BLOCKED' },
  ];

  const SystemErrorWarnings = [
    { label: 'SYSTEM_ERROR_WARNINGS_UNSPECIFIED', value: 'SYSTEM_ERROR_WARNINGS_UNSPECIFIED' },
    { label: 'ERROR_AND_WARNINGS_ENABLED', value: 'ERROR_AND_WARNINGS_ENABLED' },
    { label: 'ERROR_AND_WARNINGS_MUTED', value: 'ERROR_AND_WARNINGS_MUTED' }
  ];
  const SystemNavigation = [
    { label: 'SYSTEM_NAVIGATION_UNSPECIFIED', value: 'SYSTEM_NAVIGATION_UNSPECIFIED' },
    { label: 'NAVIGATION_ENABLED', value: 'NAVIGATION_ENABLED' },
    { label: 'NAVIGATION_DISABLED', value: 'NAVIGATION_DISABLED' },
    { label: 'HOME_BUTTON_ONLY', value: 'HOME_BUTTON_ONLY' }
  ];
  const StatusBar = [
    { label: 'STATUS_BAR_UNSPECIFIED', value: 'STATUS_BAR_UNSPECIFIED' },
    { label: 'NOTIFICATIONS_AND_SYSTEM_INFO_ENABLED', value: 'NOTIFICATIONS_AND_SYSTEM_INFO_ENABLED' },
    { label: 'NOTIFICATIONS_AND_SYSTEM_INFO_DISABLED', value: 'NOTIFICATIONS_AND_SYSTEM_INFO_DISABLED' },
    { label: 'SYSTEM_INFO_ONLY', value: 'SYSTEM_INFO_ONLY' }
  ];
  const DeviceSettings = [
    { label: 'DEVICE_SETTINGS_UNSPECIFIED', value: 'DEVICE_SETTINGS_UNSPECIFIED' },
    { label: 'SETTINGS_ACCESS_ALLOWED', value: 'SETTINGS_ACCESS_ALLOWED' },
    { label: 'SETTINGS_ACCESS_BLOCKED', value: 'SETTINGS_ACCESS_BLOCKED' },
  ];

  useEffect(() => {
    console.log('data check',data);
    if (data) {
      setTitle(data.title);
      setMessage(data.message);
      if(Selectedpolicy.label) {
        setPolicyName(Selectedpolicy?.label)
      }
      setFormData({
        "cameraDisabled": data.policyDetails.cameraDisabled ?? false,
        "addUserDisabled": data.policyDetails.addUserDisabled ?? false,
        "removeUserDisabled": data.policyDetails.removeUserDisabled ?? false,
        "factoryResetDisabled": data.policyDetails.factoryResetDisabled ?? false,
        "mountPhysicalMediaDisabled": data.policyDetails.mountPhysicalMediaDisabled ?? false,
        "safeBootDisabled": data.policyDetails.safeBootDisabled ?? false,
        "uninstallAppsDisabled": data.policyDetails.uninstallAppsDisabled ?? false,
        "bluetoothConfigDisabled": data.policyDetails.bluetoothConfigDisabled ?? false,
        "vpnConfigDisabled": data.policyDetails.vpnConfigDisabled ?? false,
        "networkResetDisabled": data.policyDetails.networkResetDisabled ?? false,
        "smsDisabled": data.policyDetails.smsDisabled ?? false,
        "modifyAccountsDisabled": data.policyDetails.modifyAccountsDisabled ?? false,
        "outgoingCallsDisabled": data.policyDetails.outgoingCallsDisabled ?? false,
        "kioskCustomLauncherEnabled": data.policyDetails.kioskCustomLauncherEnabled ?? false,
      })
      if(data.policyDetails?.applications?.length > 0) {
        setApplicationState(true);
        setApplications(data.policyDetails.applications)
        if(data.policyDetails?.kioskPackage) {
          let item = data.policyDetails.applications.filter((datas) => datas.packageName == data.policyDetails.kioskPackage);
          console.log('item kiosk',item)
          setSelectedKiosk(item[0])
        }
      } else {

      }

      if(data.policyDetails.kioskCustomization) {
        if(Object.keys(data.policyDetails.kioskCustomization).length > 0) {
          setPowerButtonActions({ label: data.policyDetails.kioskCustomization.powerButtonActions, value: data.policyDetails.kioskCustomization.powerButtonActions });
          setSystemErrorWarnings({ label: data.policyDetails.kioskCustomization.systemErrorWarnings, value: data.policyDetails.kioskCustomization.systemErrorWarnings });
          setSystemNavigation({ label: data.policyDetails.kioskCustomization.systemNavigation, value: data.policyDetails.kioskCustomization.systemNavigation });
          setStatusBar({ label: data.policyDetails.kioskCustomization.statusBar, value: data.policyDetails.kioskCustomization.statusBar });
          setDeviceSettings({ label: data.policyDetails.kioskCustomization.deviceSettings, value: data.policyDetails.kioskCustomization.deviceSettings });
          setkioskCustomization(true);
        }
      }
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
    }
  }, [data]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddfunction = () => {
    setApplicationState(!applicationState)
    setModalAddApplication({
      title: "Add New Application",
      onClose: async()=>{
        setModalAddApplication(false)
      },
      onClickAction: async (data) => {
        console.log('clicked ', data);
        setApplications((prevApplications) => {
          // Check if the packageName already exists
          const existingIndex = prevApplications.findIndex(
              (app) => app.packageName === data.packageName
          );
      
          // If it exists, replace the existing object with the new data
          if (existingIndex !== -1) {
              return prevApplications.map((app, index) =>
                  index === existingIndex ? data : app
              );
          }
      
          // If it doesn't exist, add the new data to the list
          return [...prevApplications, data];
      });      },
    });
  }

  
  const handleRadioChange = async (item) => {
    setSelectedKiosk(item);
    handleChooseKiosk();
  }


  const handleChooseKiosk = () => {
    setChooseKiosk(!chooseKiosk);
  }

  const handleUpdateapplication = (data, index) => {
    setEditApplication(!editApplication)
    setModalUpdateApplication({
      title: "Update Application",
      data: data,
      onClickAction: async (data) => {
        console.log('update clicked ', data);
        setApplications((prevApplications) =>
          prevApplications.map((app, i) => (i === index ? data : app))
        );
      },
      data: { ...applications[index] },
    });
  }

  const handleButtonClick = () => {
    console.log('applicationState',applicationState);
    console.log('kioskCustomization',kioskCustomization);
    console.log('formData',formData);
    if(policyName) {
      let data = {
        cameraDisabled: formData.cameraDisabled,
        addUserDisabled: formData.addUserDisabled,
        removeUserDisabled: formData.removeUserDisabled,
        factoryResetDisabled: formData.factoryResetDisabled,
        mountPhysicalMediaDisabled: formData.mountPhysicalMediaDisabled,
        safeBootDisabled: formData.safeBootDisabled,
        uninstallAppsDisabled: formData.uninstallAppsDisabled,
        bluetoothConfigDisabled: formData.bluetoothConfigDisabled,
        vpnConfigDisabled: formData.vpnConfigDisabled,
        networkResetDisabled: formData.networkResetDisabled,
        smsDisabled: formData.smsDisabled,
        modifyAccountsDisabled: formData.modifyAccountsDisabled,
        outgoingCallsDisabled: formData.outgoingCallsDisabled,
      };
        if(powerButtonActions?.value && systemErrorWarnings?.value && systemNavigation?.value && statusBar?.value && deviceSettings?.value){
          let kioskCustomization = {
            powerButtonActions: powerButtonActions?.value,
            systemErrorWarnings: systemErrorWarnings?.value,
            systemNavigation: systemNavigation?.value,
            statusBar: statusBar?.value,
            deviceSettings: deviceSettings?.value
          };
          data.kioskCustomization = kioskCustomization;
        } else {
          alert('Please fill kiosk Customization');
          return;
        } 
        if(applications.length  == 0) {
          alert('Please add application Details');
          return
        } else if (selectedKiosk?.packageName == '', selectedKiosk?.packageName == null) {
          alert('Please select Kiosk application');
          return
        }
        console.log('applications',applications);
        data.applications = applications;
        console.log('applications.length',applications.length);
        data.kioskPackage = selectedKiosk.packageName
        console.log('data check',data);
        console.log('selectedKiosk',selectedKiosk);
      handleClose();
      if (onClickAction !== undefined) {
        let requestBody = {
          policy_name: policyName,
          field_to_patch : data
        }
        onClickAction(requestBody);
        setOpen(false);
        setFormData({
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
        })
      }
      setPowerButtonActions(null);
      setSystemErrorWarnings(null);
      setSystemNavigation(null);
      setStatusBar(null);
      setDeviceSettings(null);
      setPolicyName('');
      setSelectedKiosk(null);
      setApplications([]);
    } else {
      alert('Please fill policy name');
      return
    }
  
  };

  const handleChangePowerButtonActions = (selectionOption) => {
    setPowerButtonActions(selectionOption)
  }
  const handleChangeSystemErrorWarnings = (selectionOption) => {
    setSystemErrorWarnings(selectionOption)
  }
  const handleChangeSystemNavigation = (selectionOption) => {
    setSystemNavigation(selectionOption)
  }
  const handleChangeStatusBar = (selectionOption) => {
    setStatusBar(selectionOption)
  }
  const handleChangeDeviceSettings = (selectionOption) => {
    setDeviceSettings(selectionOption)
  }
  const handleAddApplication = () => {
    setApplications([
      ...applications,
      {
        packageName: '',
        installType: null,
        defaultPermissionPolicy: null,
        autoUpdateMode: null,
        userControlSettings: null,
      },
    ]);
  };

  const handleRemoveApplication = (index) => {
    const updatedApplications = applications.filter((_, i) => i !== index);
    setApplications(updatedApplications);
  };

  const handleChange = (index, field, value) => {
    const updatedApplications = applications.map((app, i) =>
      i === index ? { ...app, [field]: value } : app
    );
    setApplications(updatedApplications);
  };

  const validateForm = (application) => {
    return (
      application.packageName &&
      application.installType &&
      application.defaultPermissionPolicy &&
      application.autoUpdateMode &&
      application.userControlSettings
    );
  };

  const handleToggle = (field) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: !prevFormData[field],
    }));
  };

  const handleDeleteapplication = async(index) => {
    console.log('index',index);
    console.log('applications',applications[index])
    if(applications[index].packageName == selectedKiosk.packageName) {
      alert("You can delete this application by exiting kiosk mode.")
    } else {
      setApplications((prevApplications) => 
        prevApplications.filter((_, i) => i !== index)
      );
    }
  }

  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '95%', // Adjust the maximum height as needed
          minWidth: '85%'
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <TableComponent staticData={data.policyDetails.DynamoDB} />
            <br />
            <div style={{ margin: "auto", width: "90%" }}>
          {applicationState && (
            <ModalAddApplication data={modalAddApplication} setApplicationState={setApplicationState}/>
          )}
          {editApplication && (
              <ModalUpdateApplication data={modalupdateApplication} setApplicationState={setEditApplication}/>
          )}
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
            <Label
                    check
                    for="Policy Name"
                  >
                    Policy Name
                </Label>
              <Input
                id="policy_name"
                name="policy_name"
                placeholder="Enter Policy Name"
                type="text"
                onChange= {(e) => setPolicyName(e.target.value)}
                value={policyName}
                disabled
              />
            <br/>
            <Form>
            <FormGroup switch>
              <Label> camera Disabled </Label>
              <Input
                type="switch"
                checked={formData.cameraDisabled}
                onClick={() => handleToggle('cameraDisabled')}
              />
            </FormGroup>
            <FormGroup switch>
               <Label> Add User Disabled </Label>
              <Input
                type="switch"
                checked={formData.addUserDisabled}
                onClick={() => handleToggle('addUserDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Remove User Disabled </Label>
              <Input
                type="switch"
                checked={formData.removeUserDisabled}
                onClick={() => handleToggle('removeUserDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Factory Reset Disabled </Label>
              <Input
                type="switch"
                checked={formData.factoryResetDisabled}
                onClick={() => handleToggle('factoryResetDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Mount Physical Media Disabled </Label>
              <Input
                type="switch"
                checked={formData.mountPhysicalMediaDisabled}
                onClick={() => handleToggle('mountPhysicalMediaDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Safe Boot Disabled </Label>
              <Input
                type="switch"
                checked={formData.safeBootDisabled}
                onClick={() => handleToggle('safeBootDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Uninstall Apps Disabled </Label>
              <Input
                type="switch"
                checked={formData.uninstallAppsDisabled}
                onClick={() => handleToggle('uninstallAppsDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Bluetooth Config Disabled </Label>
              <Input
                type="switch"
                checked={formData.bluetoothConfigDisabled}
                onClick={() => handleToggle('bluetoothConfigDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> VpnConfig Disabled </Label>
              <Input
                type="switch"
                checked={formData.vpnConfigDisabled}
                onClick={() => handleToggle('vpnConfigDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Network Reset Disabled </Label>
              <Input
                type="switch"
                checked={formData.networkResetDisabled}
                onClick={() => handleToggle('networkResetDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Sms Disabled </Label>
              <Input
                type="switch"
                checked={formData.smsDisabled}
                onClick={() => handleToggle('smsDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Modify Accounts Disabled </Label>
              <Input
                type="switch"
                checked={formData.modifyAccountsDisabled}
                onClick={() => handleToggle('modifyAccountsDisabled')}
              />
              </FormGroup>
              <FormGroup switch>
               <Label> Outgoing Calls Disabled </Label>
              <Input
                type="switch"
                checked={formData.outgoingCallsDisabled}
                onClick={() => handleToggle('outgoingCallsDisabled')}
              />
              </FormGroup>
               <Label> <b>kioskCustomization </b></Label>
                  <>
                    <Select
                      options={PowerButtonActions || []}
                      value={powerButtonActions}
                      onChange={handleChangePowerButtonActions}
                      placeholder="Select Power Button Actions"
                      className="select-dropdown"
                    />
                    <br/>
                    <Select
                      options={SystemErrorWarnings || []}
                      value={systemErrorWarnings}
                      onChange={handleChangeSystemErrorWarnings}
                      placeholder="Select System Error Warnings"
                      className="select-dropdown"
                    />
                    <br />
                    <Select
                      options={SystemNavigation || []}
                      value={systemNavigation}
                      onChange={handleChangeSystemNavigation}
                      placeholder="Select System Navigation"
                      className="select-dropdown"
                    />
                    <br />
                    <Select
                      options={StatusBar || []}
                      value={statusBar}
                      onChange={handleChangeStatusBar}
                      placeholder="Select Status Bar"
                      className="select-dropdown"
                    />
                    <br />
                    <Select
                      options={DeviceSettings || []}
                      value={deviceSettings}
                      onChange={handleChangeDeviceSettings}
                      placeholder="Select Device Settings"
                      className="select-dropdown"
                    />
                    <br />
                  </>
              <div>
                <Label> <b> Applications </b></Label>
                <br/>
                  <Button
                    onClick={handleAddfunction}
                    outline
                    color="primary"
                    className="add-button"
                  >
                    ADD Application
                </Button>
                {applications.length > 0 && (
                <Button
                    onClick={handleChooseKiosk}
                    outline
                    color="primary"
                    className="add-button"
                  >
                    Choose Kiosk
                </Button>
                )}
                <br/>
                <br/>
                {applications.length > 0 && (
        <>
          {applications.map((item, index) => (
            <> 
            {chooseKiosk == true ? (
              <> 
              <Row
              key={index}
              style={{
                marginBottom: '10px',
                alignItems: 'center',
                backgroundColor: 'ghostwhite',
                width: '70%',
              }}
              className="cabin-row clickable-row"
            >
              <Col xs="auto">
                  <Input
                    type="radio"
                    name="selectedkiosk"
                    value={item}
                    checked={selectedKiosk === item}
                    onChange={() => handleRadioChange(item)}
                  />
              </Col>
              <Col xs="auto" className="cabin-icon-col">
                <GoPackage />
              </Col>
              <Col className="application-text"  
                style={{
                  fontSize: "small"
                }}>
                  <span>{item?.packageName}</span>
                  <br />
                  <span> &nbsp;&nbsp;&nbsp;&nbsp;{item?.installType}</span>
                  <br />
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;{item?.defaultPermissionPolicy}</span>
                  <br />
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;{item?.autoUpdateMode}</span>
                  <br />
                  <span>&nbsp;&nbsp;&nbsp;&nbsp;{item?.userControlSettings}</span>
                </Col>
            </Row>
              </>
            ) : (
            <Row
              key={index}
              style={{
                marginBottom: '10px',
                alignItems: 'center',
                backgroundColor: 'ghostwhite',
                width: '70%',
              }}
              className="cabin-row clickable-row"
            >
              {/* <Col xs="auto"></Col> */}
              <Col xs="auto" className="cabin-icon-col">
                <GoPackage />
              </Col>
              <Col className="application-text"  
              style={{
                fontSize: "small"
              }}>
                <span>{item?.packageName}</span>
                <br />
                <span> &nbsp;&nbsp;&nbsp;&nbsp;{item?.installType}</span>
                <br />
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{item?.defaultPermissionPolicy}</span>
                <br />
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{item?.autoUpdateMode}</span>
                <br />
                <span>&nbsp;&nbsp;&nbsp;&nbsp;{item?.userControlSettings}</span>
              </Col>
              <Col className="cabin-text">
              <>
                
                  <Button
                      onClick={() => {
                        handleDeleteapplication(index);
                      }}
                      outline
                      color="primary"
                      className="delete-button"
                    >
                      <DeleteIcon  color="error"/>
                  </Button>
                  <Button
                        onClick={() => {
                          handleUpdateapplication(item,index);
                        }}
                        outline
                        color="primary"
                        className="edit-button"
                      >
                        <EditIcon />
                  </Button>
                  <span className="kioskmode_class">&nbsp;&nbsp;&nbsp;&nbsp;<b>{item?.packageName == selectedKiosk?.packageName ? 'Kiosk Mode' : ''}</b></span>

                  </>
              </Col>
            </Row>
            )}
            </>
          ))}
        </>
      )}
      {/* {applications.map((application, index) => (
        <div key={index}>
          {applicationState && (
            <>
              <Label check for={`package_name_${index}`}>
                Package Name
              </Label>
              <Input
                id={`package_name_${index}`}
                name="package_name"
                placeholder="Enter Package name"
                type="text"
                value={application.packageName}
                onChange={(e) =>
                  handleChange(index, 'packageName', e.target.value)
                }
              />
              <br />
              <Select
                options={InstallType}
                value={InstallType.find(
                  (option) => option.value === application.installType
                )}
                onChange={(selectedOption) =>
                  handleChange(index, 'installType', selectedOption.value)
                }
                placeholder="Select Install Type"
                className="select-dropdown"
              />
              <br />
              <Select
                options={DefaultPermissionPolicy}
                value={DefaultPermissionPolicy.find(
                  (option) =>
                    option.value === application.defaultPermissionPolicy
                )}
                onChange={(selectedOption) =>
                  handleChange(
                    index,
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
                value={AutoUpdateMode.find(
                  (option) => option.value === application.autoUpdateMode
                )}
                onChange={(selectedOption) =>
                  handleChange(index, 'autoUpdateMode', selectedOption.value)
                }
                placeholder="Select Auto Update Mode"
                className="select-dropdown"
              />
              <br />
              <Select
                options={UserControlSettings}
                value={UserControlSettings.find(
                  (option) => option.value === application.userControlSettings
                )}
                onChange={(selectedOption) =>
                  handleChange(
                    index,
                    'userControlSettings',
                    selectedOption.value
                  )
                }
                placeholder="Select User Control Settings"
                className="select-dropdown"
              />
              <br />
              <Button
                onClick={() => handleRemoveApplication(index)}
                color="danger"
              >
                Delete Application
              </Button>
            </>
          )}
           </div>
      ))} */}

      {/* <Button
        onClick={() => {
          const isValid = applications.every(validateForm);
          if (isValid) {
            console.log('Applications:', applications);
          } else {
            alert('Please fill out all fields.');
          }
        }}
        color="primary"
      >
        Submit
      </Button> */}
    </div>
            </Form>
            <br/>
            
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

export default ModalUpdatePolicy;
