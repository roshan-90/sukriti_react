import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import {
  executelistIotSingleLambda,
  executelistIotDynamicLambda
} from "../../awsClients/androidEnterpriseLambda";
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import {
  Card,
  CardBody
} from "reactstrap";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import ValidationMessageDialog from "../../dialogs/MessageDialog";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Select from 'react-select'; // Importing react-select

const steps = ['Step 1', 'Step 2', 'Step 3'];

export default function EnrollDevice() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const clientList = useSelector((state) => state.adminstration.clientList);
  const [dialogData, setDialogData] = useState(null);


  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [formData, setFormData] = React.useState({
    campaignSettings: '',
    adGroup: '',
    ad: ''
  });

  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const [listIotState, setListIotState] = useState(null);
  const [selectedOptionIotDistrict, setSelectedOptionIotDistrict] = useState(null); // State for react-select
  const [listIotDistrict, setListIotDistrict] = useState(null);
  const [selectedOptionIotCity, setSelectedOptionIotCity] = useState(null); // State for react-select
  const [listIotCity, setListIotCity] = useState(null);
  const [selectedOptionIotComplex, setSelectedOptionIotComplex] = useState(null); // State for react-select
  const [listIotComplex, setListIotComplex] = useState(null);

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
      setListIotState(options);
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
      setListIotDistrict(options);
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
      setListIotCity(options);
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
      setListIotComplex(options);
    } catch (error) {
      handleError(error, 'Error ListOfIotComplex')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }
  
  // Handle change in react-select 
  const handleChangeIotState = (selectedOption) => {
    console.log('check', selectedOption.value);
    setListIotDistrict(null);
    setSelectedOptionIotDistrict(null)
    setListIotCity(null);
    setSelectedOptionIotCity(null);
    setListIotComplex(null);
    setSelectedOptionIotComplex(null)
    setSelectedOption(selectedOption); // Update state if selectedOption is not null
    ListOfIotDistrict(selectedOption.value)
  };

  const handleChangeIotDistrict = (selectedOption) => {
    setListIotCity(null)
    setSelectedOptionIotCity(null)
    setListIotComplex(null)
    setSelectedOptionIotComplex(null)
    console.log('handleChangeIotDistrict',selectedOption);
    setSelectedOptionIotDistrict(selectedOption);
    ListOfIotCity(selectedOption.value)
  }

  const handleChangeIotCity = (selectedOption) => {
    setListIotComplex(null)
    setSelectedOptionIotComplex(null)
    console.log('handleChangeIotCity',selectedOption);
    setSelectedOptionIotCity(selectedOption);
    ListOfIotComplex(selectedOption.value)
  }
  const handleChangeIotComplex = (selectedOption) => {
    console.log('handleChangeIotComplex',selectedOption);
    setSelectedOptionIotComplex(selectedOption);
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

  return (
    <Box sx={{ width: '100%' }}>
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
                 <Card className="p-4">
                 <CardBody>
                 <Select options={listIotState || []} value={selectedOption} onChange={handleChangeIotState}         
                     onMenuOpen={() => {
                       if (!listIotState || listIotState.length === 0) {
                         ListOfIotState();
                       }
                     }} placeholder="Select State" />
                     <br />
                     <Select options={listIotDistrict || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District" />
                     <br />
                     <Select options={listIotCity || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select City" />
                     <br />
                     <Select options={listIotComplex || []} value={selectedOptionIotComplex} onChange={handleChangeIotComplex} placeholder="Select Complex"/>
                  
                 </CardBody>
               </Card>
              )}
              {activeStep == 1 && (
                <FormControl fullWidth>
                  <InputLabel>Select</InputLabel>
                  <Select
                    value={formData[steps[activeStep].toLowerCase()]}
                    onChange={handleChange}
                    name={steps[activeStep].toLowerCase()}
                  >
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>
        )}
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
  );
}
