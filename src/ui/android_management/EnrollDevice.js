import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import {
  executelistIotSingleLambda,
  executelistIotDynamicLambda,
  executelistIotCabinDynamicLambda,
  executeSaveDevicesLambda,
  executeListPolicyLambda,
  executelistProvisionLambda,
  executeUpdateDeviceLambda,
  executeCreatePolicyLambda
} from "../../awsClients/androidEnterpriseLambda";
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
// import {
//   Card,
// } from "reactstrap";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { selectUser } from "../../features/authenticationSlice";
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setComplexName, setCabinList, setCabinDetails, setCabinName, setListOfPolicy, setPolicyName, setResetData} from "../../features/androidManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import Select from 'react-select'; // Importing react-select
import UpdateComplex from './UpdateComplex'
import RegisterComplex from './RegisterComplex';
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { Card, Input, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, CardLink ,Row,Col} from 'reactstrap';
import { BiMaleFemale } from "react-icons/bi";
import ReadCabinDetails from './ReadCabinDetails';
import RegisterCabin from './RegisterCabin';
import ModalCreatePolicy from './ModalCreatePolicy';
import AddIcon from '@mui/icons-material/Add';

const steps = ['Step 1', 'Step 2', 'Step 3','step 4', 'step 5', 'step 6'];

export default function EnrollDevice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const stateIotList = useSelector((state) => state.androidManagement.stateIotList);
  const districtIotList = useSelector((state) => state.androidManagement.districtIotList);
  const cityIotList = useSelector((state) => state.androidManagement.cityIotList);
  const complexIotList = useSelector((state) => state.androidManagement.complexIotList);
  const ComplexIotDetails = useSelector((state) => state.androidManagement.complexIotDetail);
  const complexName = useSelector((state) => state.androidManagement.complexName);
  const cabinDetails = useSelector((state) => state.androidManagement.cabinDetails);
  const selectedCabin = useSelector((state) => state.androidManagement.cabinName);
  const listOfPolicy = useSelector((state) => state.androidManagement.listOfPolicy);
  const policyName = useSelector((state) => state.androidManagement.policyName);
  const [complexChanged, setComplexChanged] = useState(false);
  const [registerComplex, setRegisterComplex] = useState(false);
  const [registerCabin, setRegisterCabin] = useState(false);
  const cabinList = useSelector((state) => state.androidManagement.cabinList);
  const [dialogData, setDialogData] = useState(null);
  const [dialogCabinDetails, setDialogCabinDetails] = useState(false);
  const selectedOptionEnterprise = useSelector((state) => state.androidManagement.selectedOptionEnterprise);

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [formData, setFormData] = React.useState({
    campaignSettings: '',
    adGroup: '',
    ad: ''
  });
  const [dialogCreatePolicy, setDialogCreatePolicy] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const [selectedOptionIotDistrict, setSelectedOptionIotDistrict] = useState(null); // State for react-select
  const [selectedOptionIotCity, setSelectedOptionIotCity] = useState(null); // State for react-select
  const [selectedOptionIotComplex, setSelectedOptionIotComplex] = useState(null); // State for react-select
  const [serialNumber, setSerialNumber] = useState(null);
  const [selectedOptionLanguage, setSelectedOptionLanguage] = useState(null);
  const [upiPaymentStatus, setUpiPaymentStatus] = useState(null);
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
  

  const handleRadioChange = (cabin) => {
    dispatch(setCabinName(cabin));
  };

  const handlePolicy = (value) => {
    dispatch(setPolicyName(value));
  }

  const applicationType = [
    { label: 'Entry Management System', value: 'Entry Management System'},
    { label: 'Toilet Monitoring System', value: 'Toilet Monitoring System'},
    { label: 'Cabin Automation System Without BWT', value: 'Cabin Automation System without BWT'},
    { label: 'Ambient Monitoring System', value: 'Ambient Monitoring System'},
    { label: 'Black Water Treatment', value: 'Black Water Treatment'},
    { label: 'Cabin Automation System with BWT', value: 'Cabin Automation System with BWT'}
  ];

  const upiPaymentStatusOption = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
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
  
  const ListOfIotState = async () => {
    try {
      dispatch(startLoading());
      let command = "list-iot-state";
      var result = await executelistIotSingleLambda(user.username,user?.credentials, command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.CODE,
        label: item.NAME
      }));
      dispatch(setStateIotList(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotState')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotDistrict = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-district";
      var result = await executelistIotDynamicLambda(user.username, user?.credentials, value,command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.CODE,
        label: item.NAME
      }));
      dispatch(setDistrictIotList(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotDistrict')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotCity = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-city";
      var result = await executelistIotDynamicLambda(user.username, user?.credentials, value, command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.CODE,
        label: item.NAME
      }));
      dispatch(setCityIotList(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotCity')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotComplex = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-complex";
      var result = await executelistIotDynamicLambda(user.username, user?.credentials, value, command);
      console.log('result',result);
      if(result.statusCode == 200) {
        // Map raw data to react-select format
        const options = result.body.map(item => ({
          value: item.Name,
          label: item.Name
        }));
        dispatch(setComplexIotList(options));
      } else {
        console.log('result.body',result.body)
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotComplex')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }
  
  const ListOfIotComplexDetails = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-complexDetail";
      var result = await executelistIotDynamicLambda(user.username, user?.credentials, value, command);
      console.log('result complexDetail',result.body);
      dispatch(setComplexIotDetail(result.body));
    } catch (error) {
      handleError(error, 'Error ListOfIotComplex')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotClientName = async () => {
    try {
      dispatch(startLoading());
      let command = "list-iot-clientName";
      var result = await executelistIotSingleLambda(user.username, user?.credentials, command);
      console.log('result ClientName', result.body);
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      dispatch(setClientName(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotClientName')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotBillingGroup = async () => {
    try {
      dispatch(startLoading());
      let command = "list-billing-groups";
      var result = await executelistIotSingleLambda(user.username, user?.credentials, command);
      console.log('result ListOfIotBillingGroup', result.body);
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      dispatch(setBillingGroup(options));
    } catch (error) {
      handleError(error, 'Error ListOfIotBillingGroup')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  // Handle change in react-select 
  const handleChangeIotState = (selectedOption) => {
    console.log('check', selectedOption.value);
    dispatch(setDistrictIotList([]));
    dispatch(setCityIotList([]));
    dispatch(setComplexIotList([]));
    setSelectedOptionIotDistrict(null)
    setSelectedOptionIotCity(null);
    setSelectedOptionIotComplex(null)
    setSelectedOption(selectedOption); // Update state if selectedOption is not null
    ListOfIotDistrict(selectedOption.value)
  };

  const handleChangeIotDistrict = (selectedOption) => {
    dispatch(setCityIotList([]));
    dispatch(setComplexIotList([]));
    setSelectedOptionIotCity(null)
    setSelectedOptionIotComplex(null)
    console.log('handleChangeIotDistrict',selectedOption);
    setSelectedOptionIotDistrict(selectedOption);
    ListOfIotCity(selectedOption.value)
  }

  const handleChangeIotCity = (selectedOption) => {
    dispatch(setComplexIotList([]));
    setSelectedOptionIotComplex(null)
    console.log('handleChangeIotCity',selectedOption);
    setSelectedOptionIotCity(selectedOption);
    ListOfIotComplex(selectedOption.value)
  }
  const handleChangeIotComplex = (selectedOption) => {
    console.log('handleChangeIotComplex',selectedOption);
    dispatch(setComplexName(selectedOption.value));
    setSelectedOptionIotComplex(selectedOption);
    ListOfIotComplexDetails(selectedOption.value)
    ListOfIotClientName();
    ListOfIotBillingGroup();
    setComplexChanged(true)
    ListOfIotCabin(selectedOption.value);
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

  const handleChangeApplicationType = (selectedOption) => {
    console.log('handleChangeApplicationType',selectedOption);
    setApplicationTypeOption(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      application_type: selectedOption.value,
    }));
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
    setFormData({
      campaignSettings: '',
      adGroup: '',
      ad: ''
    });
    setSelectedOption(null);
    setSelectedOptionIotDistrict(null);
    setSelectedOptionIotCity(null);
    setSelectedOptionIotComplex(null);
    dispatch(setResetData());
    setApplicationFormData({
      application_details: "",
      application_type: "",
      upi_payment_status: "",
      language: "",
      margin_left: "",
      margin_right: "",
      margin_top: "",
      margin_bottom: ""
    })
    setQrImage(null);
    setSerialNumber(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setApplicationFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const OpenRegisterModal = () => {
    setRegisterComplex(!registerComplex);
  }

  const OpenRegisterCabinModal = () => {
    setRegisterCabin(!registerCabin);
  }

  const openCabinModal = () => {
    setDialogCabinDetails(!dialogCabinDetails);
  }

  const ListOfIotCabin = async (value) => {
    try {
        console.log('selectedOptionIotComplex',value);
      dispatch(startLoading());
      let command = "list-iot-thing";
      var result = await executelistIotCabinDynamicLambda(user?.username, user?.credentials, value, command);
      console.log('result',result.body.things);
      dispatch(setCabinList(result.body.things));
    } catch (error) {
      handleError(error, 'Error ListOfIotCabin')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleCabinDetails = async (value) => {
    console.log('value',value);
    try {
      dispatch(startLoading());
      let command = "describe-iot-thing";
      var result = await executelistIotCabinDynamicLambda(user?.username, user?.credentials, value, command);
      console.log('result',result.body);
      dispatch(setCabinDetails(result.body));
      openCabinModal();
    } catch (error) {
      handleError(error, 'Error handleCabinDetails')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleSaveData = async () => {
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
       return;
      }
    if(serialNumber != null && selectedCabin != null && ComplexIotDetails != null && cabinDetails != null) {
    try {
      dispatch(startLoading());
      console.log('serialNumber', serialNumber);
      console.log('selectedCabin',selectedCabin);
      console.log('ComplexIotDetails',ComplexIotDetails);
      console.log('cabinDetails',cabinDetails)

      const convertToAttributes = (details) => {
        return Object.keys(details).map(key => ({
          Name: key,
          Value: details[key]
        }));
      };
      
      const complex_value_update = {
        Attributes: convertToAttributes(ComplexIotDetails),
        Description: "",
        Name: complexName,
        Parent: ComplexIotDetails.CITY_CODE
      };
      console.log('complext_ value_update',complex_value_update);

      const CabinconvertToAttributes = (details) => {
        return Object.keys(details).map(key => ({
          Name: key,
          Value: details[key]
        }));
      };
      const Cabin_value_update = {
        Attributes: CabinconvertToAttributes(cabinDetails.attributes),
        DefaultClientId: cabinDetails.defaultClientId,
        Id: cabinDetails.thingId,
        Name: cabinDetails.thingName,
        ThingType: cabinDetails.thingTypeName,
        Arn: cabinDetails.thingArn,
        version: cabinDetails.version,
        BillingGroupName: cabinDetails.billingGroupName
      };
      console.log('Cabin_value_update',Cabin_value_update);
        let object = {
          command: "save-data",
          serial_number: serialNumber,
          cabin_name: selectedCabin,
          cabin_details: Cabin_value_update,
          complex_details: complex_value_update,
          extra_details: {
            serial_number: serialNumber
          }
        }
        console.log('object',object);
        let result = await executeSaveDevicesLambda(user?.credentials, object);
        console.log('executeSaveDevicesLambda result', result);
        let enterprise_id = selectedOptionEnterprise.value;
        let listPolicy = await executeListPolicyLambda(user?.credentials, enterprise_id);
        console.log('listPolicy', listPolicy);
        const options = listPolicy.body.map(item => ({
          value: item.name.split("/")[3],
          label: item.name.split("/")[3]
        }));
        console.log('options',options)
        dispatch(setListOfPolicy(options));
        if(result.statusCode == 200) {
          setDialogData({
            title: "Success",
            message: result.body,
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log(`handleSaveData function -->`);
            },
          });
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
    } else {
      setDialogData({
        title: "Error",
        message: 'Please Field previous state',
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`handleSaveData -->`);
        },
      });
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

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

  const createPolicy =  async() => {
    console.log('createPolicy clicked',selectedOptionEnterprise?.value);
    if(selectedOptionEnterprise?.value == "" || selectedOptionEnterprise == null || selectedOptionEnterprise?.value == undefined) 
     { 
        setDialogData({
        title: "Validation Error",
        message: "Please Select Enterprise",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("handleEditDevice");
        },
      })
    } else {
      setDialogCreatePolicy({
        title: "Create Policy",
        message: selectedOptionEnterprise.label,
        onClickAction: async (data) => {
          data.enterprises_id = selectedOptionEnterprise.value;
          console.log('data',data);
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            
            let result_data =  await executeCreatePolicyLambda(user?.credentials, data);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              setDialogData({
                title: "Success",
                message: "Policy Created is successfully",
                onClickAction: async () => {
                  window.location.reload();
                  console.log("createPolicy function");
                },
              })
            } else {
              setDialogData({
                title: "Error",
                message: "Something went wrong",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error createPolicy");
                  window.location.reload();
                },
              })
            }
          } catch( err) {
            handleError(err, 'Error createPolicy')
          } finally {
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
        },
      })
    }
  }


  return (
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
                  {(ComplexIotDetails['key'] !== null && complexChanged) && (
                    <UpdateComplex complexChanged={complexChanged} selected={selectedOptionIotComplex} setComplexChanged={setComplexChanged} /> // Pass complexChanged as a prop
                  )}
                  {(registerComplex) && (
                    <RegisterComplex openModal={registerComplex} selected={selectedOptionIotComplex} setModalToggle={OpenRegisterModal} /> // Pass complexChanged as a prop
                  )}
                    <Select options={stateIotList || []} value={selectedOption} onChange={handleChangeIotState}         
                      onMenuOpen={() => {
                        if (!stateIotList || stateIotList.length === 0) {
                          ListOfIotState();
                        }
                      }} placeholder="Select State" 
                      />
                    <br />
                    <Select options={districtIotList || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District" />
                    <br />
                    <Select options={cityIotList || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select City" />
                    <br />
                    <Select options={complexIotList || []} value={selectedOptionIotComplex} onChange={handleChangeIotComplex} placeholder="Select Complex"/> 
                    <br />
                    <Button
                      variant="contained"
                      onClick={OpenRegisterModal}
                    >
                      Register New Complex
                    </Button>
                </div>
              )}
              {activeStep === 1 && (
                 <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    <h3> Cabin Details </h3>
                    <br/>
                  {dialogCabinDetails &&(
                    <ReadCabinDetails dialogCabinDetails={dialogCabinDetails} setDialogCabinDetails={openCabinModal}/>
                  )}
                  {(registerCabin) && (
                    <RegisterCabin openModal={registerCabin} selected={selectedOptionIotComplex} setModalToggle={OpenRegisterCabinModal} /> // Pass complexChanged as a prop
                  )}
                 {cabinList && cabinList.map((cabin, index) => (
                  <Row key={index} style={{ marginBottom: '10px', alignItems: 'center', backgroundColor: 'ghostwhite', width: '100%' }} className="cabin-row clickable-row" onClick={() => handleCabinDetails(cabin)}
                  >
                     <Col xs="auto">
                      <Input
                        type="radio"
                        name="selectedCabin"
                        value={cabin}
                        checked={selectedCabin === cabin}
                        onChange={() => handleRadioChange(cabin)}
                      />
                    </Col>
                    <Col xs="auto" className="cabin-icon-col">
                      <BiMaleFemale />
                    </Col>
                    <Col className="cabin-text">
                      <span>{cabin}</span>
                    </Col>
                  </Row>
                ))}
                <br />
                {(registerCabin == false && complexName) && (
                    <Button
                      variant="contained"
                      onClick={OpenRegisterCabinModal}
                    >
                      Register New Cabin
                    </Button>
                  )}
                  </div>
                )}
              {activeStep === 2 && (
                <div>
                  <h3> Device Details</h3>
                 {selectedCabin && (
                  <>
                    <Input
                      id="serial_number"
                      name="serial_number"
                      placeholder="Serial Number"
                      type="text"
                      onChange={(e) => setSerialNumber(e.target.value)}
                    />
                    <br/>
                      <Button
                        variant="contained"
                        onClick={handleSaveData}
                      >
                        serial Number
                      </Button>
                  </>
                 )}
                </div>
              )}
              {activeStep === 3 && (
                <div>
                    <ModalCreatePolicy data={dialogCreatePolicy} />
                  <h3>Lists of Policy</h3>
                  <Button
                    onClick={() => {
                      createPolicy();
                    }}
                    outline
                    color="primary"
                    className="add-button"
                  >
                    Create Policy <AddIcon />
                  </Button>
                  {listOfPolicy?.length > 0 && (
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
                        <span>{policy.value}</span>
                      </Col>
                    </Row>
                    ))}
                    </>
                  )}
                </div>
              )}
              {activeStep === 4 && (
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
                    />
                    <br />
                    <Input
                      id="margin_right"
                      name="margin_right"
                      placeholder="Margin Right"
                      type="text"
                      onChange={(e) => handleChange(e)}
                    />
                    <br />
                    <Input
                      id="margin_top"
                      name="margin_top"
                      placeholder="Margin Top"
                      type="text"
                      onChange={(e) => handleChange(e)}
                    />
                    <br />
                    <Input
                      id="margin_bottom"
                      name="margin_bottom"
                      placeholder="Margin Bottom"
                      type="text"
                      onChange={(e) => handleChange(e)}
                    />
                    <br />
                      <Button
                        variant="contained"
                        onClick={handleSaveDetails}
                      >
                        Save Details
                      </Button>
                    </>
                  )}
                </div>
              )}
              {activeStep === 5 && (
                <div>
                  {listOfPolicy.length > 0 && (
                   <div className="image-container">
                   <h3 className="image-text">QR Show</h3>
                   <img src={qrImage} alt="QR Image" className="centered-image" />
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
  );
};
