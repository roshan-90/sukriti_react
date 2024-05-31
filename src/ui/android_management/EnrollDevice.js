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
  executeListPolicyLambda
} from "../../awsClients/androidEnterpriseLambda";
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
// import {
//   Card,
// } from "reactstrap";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { selectUser } from "../../features/authenticationSlice";
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setComplexName, setCabinList, setCabinDetails, setCabinName, setListOfPolicy, setPolicyName} from "../../features/androidManagementSlice";
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

  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [formData, setFormData] = React.useState({
    campaignSettings: '',
    adGroup: '',
    ad: ''
  });

  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const [selectedOptionIotDistrict, setSelectedOptionIotDistrict] = useState(null); // State for react-select
  const [selectedOptionIotCity, setSelectedOptionIotCity] = useState(null); // State for react-select
  const [selectedOptionIotComplex, setSelectedOptionIotComplex] = useState(null); // State for react-select
  const [serialNumber, setSerialNumber] = useState(null);

  const handleRadioChange = (cabin) => {
    dispatch(setCabinName(cabin));
  };

  const handlePolicy = (value) => {
    dispatch(setPolicyName(value));
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
  
  const ListOfIotState = async () => {
    try {
      dispatch(startLoading());
      let command = "list-iot-state";
      var result = await executelistIotSingleLambda('test_rk_mandi',user?.credentials, command);
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
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value,command);
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
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value, command);
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
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value, command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      dispatch(setComplexIotList(options));
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
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value, command);
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
      var result = await executelistIotSingleLambda('test_rk_mandi', user?.credentials, command);
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
      var result = await executelistIotSingleLambda('test_rk_mandi', user?.credentials, command);
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
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
    try {
      dispatch(startLoading());
      console.log('serialNumber', serialNumber);
      console.log('selectedCabin',selectedCabin);
      console.log('ComplexIotDetails',ComplexIotDetails);
      console.log('cabinDetails',cabinDetails)
      let object = {
        command: "save-data",
        serial_number: serialNumber,
        cabin_name: selectedCabin,
        cabin_details: cabinDetails,
        complex_details: ComplexIotDetails,
        extra_details: {
          serial_number: serialNumber
        }
      }
      console.log('object',object);
      let result = await executeSaveDevicesLambda(user?.credentials, object);
      console.log('result', result);
      let enterprise_id = "enterprises/LC04ehgfv4";
      let listPolicy = await executeListPolicyLambda(user?.credentials, enterprise_id);
      console.log('listPolicy', listPolicy);
      const options = listPolicy.body.map(item => ({
        value: item.name.split("/")[3],
        label: item.name.split("/")[3]
      }));
      console.log('options',options)
      dispatch(setListOfPolicy(options));
    } catch (error) {
      handleError(error, 'Error handleSaveData')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
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
                  <Input
                    id="serial_number"
                    name="serial_number"
                    placeholder="Serial Number"
                    type="text"
                    onChange={(e) => setSerialNumber(e.target.value)}
                  />
                    <Button
                      variant="contained"
                      onClick={handleSaveData}
                    >
                      serial Number
                    </Button>
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  <h3>Lists of Policy</h3>
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
