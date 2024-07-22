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
import { Card, Input, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, CardLink ,Row,Col} from 'reactstrap';
import { startLoading, stopLoading } from "../../features/loadingSlice";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import CardContent from '@mui/material/CardContent';
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setComplexName, setCabinList, setCabinDetails, setCabinName, setListOfPolicy, setPolicyName, setResetData} from "../../features/androidManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import { BiMaleFemale } from "react-icons/bi";
import { selectUser } from "../../features/authenticationSlice";
import {
  executelistProvisionLambda,
  executeUpdateDeviceLambda,
  executeListPolicyLambda
} from "../../awsClients/androidEnterpriseLambda";

const steps = ['Policy Section', 'Application Section', 'Enrollment Token'];

const ModalReinitiate = ({ data }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [onClickAction, setOnClickAction] = useState(undefined);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [activeStep, setActiveStep] = React.useState(0);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [completed, setCompleted] = React.useState({});
  const [dialogData, setDialogData] = useState(null);
  const listOfPolicy = useSelector((state) => state.androidManagement.listOfPolicy);
  const policyName = useSelector((state) => state.androidManagement.policyName);
  const selectedOptionEnterprise = useSelector((state) => state.androidManagement.selectedOptionEnterprise);
  const [applicationTypeOption, setApplicationTypeOption] = useState(null);
  const [applicationFormData, setApplicationFormData] = React.useState({
    unattended_timmer: "",
    application_type: "",
    upi_payment_status: "",
    language: "",
    margin_left: "",
    margin_right: "",
    margin_top: "",
    margin_bottom: ""
  })
  const [qrImage, setQrImage] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const upiPaymentStatusOption = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];
  const [serialNumber, setSerialNumber] = useState(null);
  const [selectedOptionLanguage, setSelectedOptionLanguage] = useState(null);
  const [upiPaymentStatus, setUpiPaymentStatus] = useState(null);
  const applicationType = [
    { label: 'Entry Management System', value: 'Entry Management System'},
    { label: 'Toilet Monitoring System', value: 'Toilet Monitoring System'},
    { label: 'Cabin Automation System Without BWT', value: 'Cabin Automation System without BWT'},
    { label: 'Ambient Monitoring System', value: 'Ambient Monitoring System'},
    { label: 'Black Water Treatment', value: 'Black Water Treatment'},
    { label: 'Cabin Automation System with BWT', value: 'Cabin Automation System with BWT'}
  ];


  const language = [
    { label: 'Assamese', value: 'Assamese' },
    { label: 'Bangla', value: 'Bangla' },
    { label: 'Tibetan', value: 'Tibetan' },
    { label: 'Bodo', value: 'Bodo' },
    { label: 'Dogri', value: 'Dogri' },
    { label: 'English', value: 'English' },
    { label: 'Gujarati', value: 'Gujarati' },
    { label: 'Hindi', value: 'Hindi' },
    { label: 'Kannada', value: 'Kannada' },
    { label: 'Konkani', value: 'Konkani' },
    { label: 'Kashmiri', value: 'Kashmiri' },
    { label: 'Maithili', value: 'Maithili' },
    { label: 'Malayalam', value: 'Malayalam' },
    { label: 'Manipuri', value: 'Manipuri' },
    { label: 'Marathi', value: 'Marathi' },
    { label: 'Nepali', value: 'Nepali' },
    { label: 'Odia', value: 'Odia' },
    { label: 'Punjabi', value: 'Punjabi' },
    { label: 'Sanskrit', value: 'Sanskrit' },
    { label: 'Santali', value: 'Santali' },
    { label: 'Sindhi', value: 'Sindhi' },
    { label: 'Sindhi Devanagari', value: 'Sindhi Devanagari' },
    { label: 'Tamil', value: 'Tamil' },
    { label: 'Telugu', value: 'Telugu' },
    { label: 'Urdu', value: 'Urdu' }
  ];

  
  useEffect(() => {
    console.log('data',data);
    if (data) {
      setTitle(data.title);
      setOnClickAction(() => data.onClickAction || undefined);
      setOpen(true);
      handleListPolicy();
      if(data.data.DEVICE_POLICY_STATE == "TRUE") {
        dispatch(setPolicyName(data.data.policy_name))
      }
      console.log('data.data.application_details',data.data.application_details);

      if(data.data.DEVICE_APPLICATION_STATE == "TRUE") {
        setApplicationFormData({
          unattended_timmer: data.data.application_details.unattended_timmer ?? '',
          margin_left: data.data.application_details.margin_left ?? '',
          margin_right:data.data.application_details.margin_right ?? '',
          margin_top: data.data.application_details.margin_top ?? '',
          margin_bottom: data.data.application_details.margin_bottom ?? ''
        })
        setApplicationTypeOption({ label: data.data.application_details.application_type, value: data.data.application_details.application_type})
        setUpiPaymentStatus({ label: data.data.application_details.upi_payment_status, value: data.data.application_details.upi_payment_status})
        setSelectedOptionLanguage({ label: data.data.application_details.language, value: data.data.application_details.language})
      }

      if(data.data.QR_CREATED_STATE == "TRUE") {
        setQrImage(data.data.qr_details.qr)
      }
    }
  }, [data,]);

  

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
  const handleChangeApplicationType = (selectedOption) => {
    console.log('handleChangeApplicationType',selectedOption);
    setApplicationTypeOption(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      application_type: selectedOption.value,
    }));
  }
  const handleChange = (e) => {
    const { name , value } = e.target;
    setFormData({ ...formData, [name]: value });
  }
  const handleVerify = () => {
    
  }

  const handleListPolicy = async() => {
    try{
    let enterprise_id = selectedOptionEnterprise.value;
    let listPolicy = await executeListPolicyLambda(user?.credentials, enterprise_id);
    console.log('listPolicy', listPolicy);
    const options = listPolicy.body.map(item => ({
      value: item.name.split("/")[3],
      label: item.name.split("/")[3]
    }));
    console.log('options',options)
    dispatch(setListOfPolicy(options));
    if(listPolicy.statusCode == 200) {
    } else {
      setDialogData({
        title: "Error",
        message: 'SomethingWent wrong Please try again',
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`handleSaveData -->`);
        },
      });
    }
  } catch (error) {
    handleError(error, 'Error handleSaveData')
  } finally {
    dispatch(stopLoading()); // Dispatch the stopLoading action
  }
  }

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
  

  const handlePolicy = (value) => {
    console.log('value',value);
    console.log('data', data);
    dispatch(setPolicyName(value));
  }

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    const newCompleted = completed;
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const handleSaveDetails = async () => {
    try {
      if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
        { 
           setDialogData({
           title: "Validation Error",
           message: "Please Select Enterprise",
           onClickAction: () => {
             // Handle the action when the user clicks OK
             console.log("handleEditEnterprise");
           },
         })
         dispatch(startLoading());
         return;
        }
    let object_application_details = {
      serial_number: serialNumber,
      command: "update-data",
      details_type: "application_details",
      value : applicationFormData
    }
    console.log("object_application_details",object_application_details);
    let application_update = await executeUpdateDeviceLambda(user?.credentials,object_application_details);
    console.log('application_result',application_update);
    if(application_update.statusCode == 200) {
      setDialogData({
        title: "Success",
        message: "Application Details " + application_update.body,
        onClickAction: async () => {
          object_application_details = {
            serial_number: serialNumber,
            command: "update-data",
            details_type: "policy_details",
            value : {
              policy_name : policyName
            },
          }
          let policy_update = await executeUpdateDeviceLambda(user?.credentials,object_application_details);
          console.log('policy_update',policy_update);

          if(policy_update.statusCode == 200) {
            setDialogData({
              title: "Success",
              message: "Policy Details " + policy_update.body,
              onClickAction: async () => {
                let object = {
                  name : selectedOptionEnterprise.value,
                  policy_name: policyName,
                  serial_number: serialNumber
                }
                let Qr_result = await executelistProvisionLambda(user?.credentials, object);
                if(Qr_result.statusCode == 200) {
                  console.log('Qr_result', JSON.parse(Qr_result.body).imageUrl);
                  setQrImage(JSON.parse(Qr_result.body).imageUrl)
                  dispatch(stopLoading()); // Dispatch the stopLoading action
                } else {
                  setDialogData({
                    title: "QR Token Error",
                    message: 'Provision Token Not created Please try again',
                    onClickAction: () => {
                      // Handle the action when the user clicks OK
                      console.log(`handleSaveDetails -->`);
                    },
                  });
                  dispatch(stopLoading()); // Dispatch the stopLoading action
                  return true;
                }
                
              },
            });
          } else {
            setDialogData({
              title: "Error",
              message: 'Policy Details not save Please try again',
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log(`handleSaveDetails -->`);
              },
            });
            dispatch(stopLoading()); // Dispatch the stopLoading action
            return true;
          }
        }
      });
    } else {
      setDialogData({
        title: "Error",
        message: 'Application Details not save Please try again',
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`handleSaveDetails -->`);
        },
      });
      dispatch(stopLoading()); // Dispatch the stopLoading action
      return true;
    }
    object_application_details = {}

    } catch (error) {
      handleError(error, 'Error handleSaveData')
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }
  const handleChangeLanguage = (selectedOption) => {
    console.log('handleChangeLanguage', selectedOption);
    setSelectedOptionLanguage(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      language: selectedOption.value,
    }));
  }

  const handleChangeUpiPaymentStatus = (selectedOption) => {
    console.log('handleChangeUpiPaymentStatus',selectedOption);
    setUpiPaymentStatus(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      upi_payment_status: selectedOption.value,
    }));
  }

  if(data) {
    console.log('data.options',data.options);
    return (
      <Dialog className="dialog-selects" open={open} onClose={handleClose} maxWidth="sm" fullWidth
      PaperProps={{
        style: {
          height: '95%', // Adjust the maximum height as needed
          minWidth: '95%'
        },
      }}>
        <DialogTitle>{title}</DialogTitle>
        <br/>
    <div className="container-fluid" style={{ backgroundColor: '#fff' }}>
    <Box sx={{ width: '62%', backgroundColor: '#fff', padding: '20px', marginLeft: '20%'}}>
       {isLoading && (
          <div className="loader-container">
            <CircularProgress
              className="loader"
              style={{ color: "rgb(93 192 166)" }}
            />
          </div>
        )}
        <MessageDialog data={dialogData} />
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <br />
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {steps[activeStep]}
              </Typography>
              {activeStep === 0 && (
                <div>
                  <h3>Lists of Policy</h3>
                  {listOfPolicy.length > 0 && (
                    <>
                    {listOfPolicy && listOfPolicy.map((policy, index) => (
                    <Row key={index} style={{ marginBottom: '10px', alignItems: 'center', backgroundColor: 'ghostwhite', width: '100%' }} className="cabin-row clickable-row" onClick={() => handlePolicy(policy.value)}
                    >
                       <Col xs="auto">
                        <Input
                          type="radio"
                          name="selectedPolcy"
                          value={policy.value}
                          checked={policyName === policy.value}
                          onChange={() => handlePolicy(policy.value)}
                        />
                      </Col>
                      <Col xs="auto" className="cabin-icon-col">
                        <BiMaleFemale />
                      </Col>
                      <Col className="cabin-text">
                        <span>{policy.value.split('_')[0]}</span>
                      </Col>
                    </Row>
                    ))}
                    </>
                  )}
                  {data.data.DEVICE_POLICY_STATE == "TRUE" ? <> </> : (
                  <Button
                    variant="contained"
                    onClick={handleComplete}
                  >
                    Save Policy
                  </Button>
                  ) }
                </div>
              )}
              {activeStep === 1 && (
                <div>
                  <h3> Application Details</h3>
                  {policyName && (
                    <>
                      <Input
                      id="unattended_timmer"
                      name="unattended_timmer"
                      placeholder="unattended timmer"
                      type="number"
                      onChange={(e) => handleChange(e)}
                      value={applicationFormData.unattended_timmer}
                    />
                      <br />
                      <Select options={applicationType || []} value={applicationTypeOption} onChange={handleChangeApplicationType} placeholder="Application Type" />
                      <br />
                      <Select options={upiPaymentStatusOption || []} value={upiPaymentStatus} onChange={handleChangeUpiPaymentStatus} placeholder="UPI Payment Status" />
                      <br />
                      <Select options={language || []} value={selectedOptionLanguage} onChange={handleChangeLanguage} placeholder="Select Language" />
                      <br />
                      <Input
                      id="margin_left"
                      name="margin_left"
                      placeholder="Margin Left"
                      type="text"
                      onChange={(e) => handleChange(e)}
                      value={applicationFormData.margin_left}
                    />
                    <br />
                    <Input
                      id="margin_right"
                      name="margin_right"
                      placeholder="Margin Right"
                      type="text"
                      onChange={(e) => handleChange(e)}
                      value={applicationFormData.margin_right}
                    />
                    <br />
                    <Input
                      id="margin_top"
                      name="margin_top"
                      placeholder="Margin Top"
                      type="text"
                      onChange={(e) => handleChange(e)}
                      value={applicationFormData.margin_top}
                    />
                    <br />
                    <Input
                      id="margin_bottom"
                      name="margin_bottom"
                      placeholder="Margin Bottom"
                      type="text"
                      onChange={(e) => handleChange(e)}
                      value={applicationFormData.margin_bottom}
                    />
                    <br />
                    {data.data.DEVICE_APPLICATION_STATE == "TRUE" ? <></> : (
                      <Button
                        variant="contained"
                        onClick={handleSaveDetails}
                      >
                        Save Details
                      </Button>
                    )}
                    </>
                  )}
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  {listOfPolicy.length > 0 && (
                   <div className="image-container">
                   <h3 className="image-text">QR Show</h3>
                   <img src={qrImage} alt="QR Image" className="centered-image" />
                   {data.data.QR_CREATED_STATE == "TRUE" ? <> </> : (
                    <Button
                          variant="contained"
                          onClick={handleSaveDetails}
                        >
                          QR Generate
                        </Button>
                   )}
                 </div>
                 
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        <br />
        <div sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleComplete}
          >
            {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </Box>
    </div>
        <DialogActions>
          {/* <Button variant="contained" color="success" onClick={handleButtonClick}>
            Submit
          </Button> */}
          <Button variant="contained" color="primary" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
};

export default ModalReinitiate
;