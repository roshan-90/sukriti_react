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
  executeCreatePolicyLambda,
  executeShareQrLambda,
  executedFetchListWIFILambda
} from "../../awsClients/androidEnterpriseLambda";
import StepButton from '@mui/material/StepButton';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
// import {
//   Card,
// } from "reactstrap";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { selectUser } from "../../features/authenticationSlice";
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setComplexName, setCabinList, setCabinDetails, setCabinName, setListOfPolicy, setPolicyName, setPolicyDetails, setResetData, setwifiList} from "../../features/androidManagementSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import Select from 'react-select'; // Importing react-select
import UpdateComplex from './UpdateComplex'
import RegisterComplex from './RegisterComplex';
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import {
  whiteSurfaceCircularBorder
} from "../../jsStyles/Style";
import { Card, Input, CardBody, CardTitle, CardText, ListGroup, ListGroupItem, CardLink ,Row,Col} from 'reactstrap';
import { BiMaleFemale } from "react-icons/bi";
import ReadCabinDetails from './ReadCabinDetails';
import RegisterCabin from './RegisterCabin';
import ModalCreatePolicy from './ModalCreatePolicy';
import AddIcon from '@mui/icons-material/Add';
import ShareIcon from '@mui/icons-material/Share';
import ModalShareQR from "./ModalShareQR";
import MessageDialogTable from '../../dialogs/MessageDialogTable';

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
  const listOfWifi = useSelector((state) => state.androidManagement.wifiList);
  const [complexChanged, setComplexChanged] = useState(false);
  const [registerComplex, setRegisterComplex] = useState(false);
  const [registerCabin, setRegisterCabin] = useState(false);
  const cabinList = useSelector((state) => state.androidManagement.cabinList);
  const [dialogData, setDialogData] = useState(null);
  const [dialogCabinDetails, setDialogCabinDetails] = useState(false);
  const selectedOptionEnterprise = useSelector((state) => state.androidManagement.selectedOptionEnterprise);
  const [dialogTableData, setDialogTableData] = useState(null);

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
    margin_bottom: "",
    isAmsEnabled: "",
    wifiCredentials: [], // Initialize as an empty array
    defaultWifi: {},
  })
  const [qrImage, setQrImage] = useState(null);
  const [serialNumberEnable, setSerialNumberEnable] = useState(false);
  const [applicationDetails, setApplicationDetails] = useState(false);
  const [qrShare , setQrShare] = useState(null);
  const [nextBtn , setNextBtn] = useState(false);
  const [policyEnabled, setPolicyEnabled] = useState(false)
  const [amsEnableOptions, setAmsEnableOption] = useState(false);

  // State to track checkbox states and selected items
  const [checkedState, setCheckedState] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showRadios, setShowRadios] = useState(false); // To toggle radio buttons
  const [defaultWifi, setDefaultWifi] = useState(null); // To store selected default Wi-Fi
  const [dummyCabinShow, setDummyCabinShow] = useState(false);
  const [dummyCabin, setDummyCabin] = useState(null);

  useEffect(() => {
    setApplicationTypeOption({ label: 'Cabin Automation System Without BWT', value: 'Cabin Automation System without BWT'})
    setUpiPaymentStatus({ label: 'No', value: 'No' })
    setSelectedOptionLanguage({ label: 'Hindi', value: 'Hindi' })
    setApplicationFormData({
      unattended_timmer: 20,
      application_type: 'Cabin Automation System without BWT',
      upi_payment_status: 'No',
      language: 'Hindi',
      margin_left: 0,
      margin_right: 0,
      margin_top: 0,
      margin_bottom: 0,
      isAmsEnabled: false
    });
    setAmsEnableOption({ label: 'False', value: false})
    setSelectedOption(null);
    setSelectedOptionIotDistrict(null)
    setSelectedOptionIotCity(null);
    setSelectedOptionIotComplex(null);
    dispatch(setListOfPolicy(null))
    dispatch(setCabinList([]));
    dispatch(setPolicyName(null));
    dispatch(setCabinName(null));
    setSerialNumberEnable(false);
    setApplicationDetails(false);
    console.log('dddd')
    setDummyCabinShow(false)
    
  },[]);

  // Update checkedState when listOfWifi changes
  useEffect(() => {
    if (listOfWifi?.length > 0) {
      setCheckedState(new Array(listOfWifi?.length).fill(false));
    }
  }, [listOfWifi]);

    // Handle Set Default button click
    const handleSetDefaultClick = () => {
      setShowRadios(!showRadios); // Toggle visibility of radio buttons
    };

    // Handle radio button selection
    const handleRadioWifiDefaultChange = (index) => {
      setDefaultWifi(index); // Store the selected Wi-Fi index
      console.log(listOfWifi[index])
      setApplicationFormData( prevFormData => ({
        ...prevFormData,
        defaultWifi: listOfWifi[index],
      }));
    };

  const handleRadioChange = (cabin) => {
    dispatch(setCabinName(cabin));
    setNextBtn(true)
    if(cabin.includes('BWT')) {
      setApplicationTypeOption({ label: 'Black Water Treatment', value: 'Black Water Treatment'})
    } else if (cabin.includes('UR')) {
      setApplicationTypeOption({ label: 'Entry Management System', value: 'Entry Management System'})
    } else if (cabin.includes('WC')) {
      setApplicationTypeOption({ label: 'Cabin Automation System Without BWT', value: 'Cabin Automation System without BWT'})
    }
  };

  const handlePolicy = (value) => {
    dispatch(setPolicyName(value));
  }
  console.log('Selected Items:', selectedItems);
  console.log('defaultWifi', defaultWifi);
  console.log('showRadios', showRadios);
  console.log('applicationFormData', applicationFormData);

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

  const AmsEnable = [
    { label: 'True', value: true},
    { label: 'False', value: false}
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

  const  AttributeFilter = (complexDetails,value) => {
      if (value == 1) {
          const stateNameAttribute = complexDetails.Attributes.find(attribute => attribute.Name === 'STATE_NAME');
          const stateName = stateNameAttribute ? stateNameAttribute.Value : 'Not Found';
          return stateName;
      } else if (value == 2) {
          const districtNameAttribute = complexDetails.Attributes.find(attribute => attribute.Name === 'DISTRICT_NAME');
          const districtName = districtNameAttribute ? districtNameAttribute.Value : 'Not Found';
          return districtName;
      } else if (value == 3) {
          const cityNameAttribute = complexDetails.Attributes.find(attribute => attribute.Name === 'CITY_NAME');
          const cityName = cityNameAttribute ? cityNameAttribute.Value : 'Not Found';
          return cityName;
      } else {
          
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
  
  // Function to handle checkbox change and store selected items
  const handleCheckboxChange = (index, item) => {
    const updatedCheckedState = checkedState.map((_, i) => (i === index ? !checkedState[i] : checkedState[i]));
    setCheckedState(updatedCheckedState);
  
    // Ensure that wifiCredentials is an array before working with it
    const currentWifiCredentials = Array.isArray(applicationFormData.wifiCredentials) 
      ? applicationFormData.wifiCredentials 
      : [];  // If somehow it's not an array, fall back to an empty array
  
    let updatedWifiCredentials = [...currentWifiCredentials];
  
    if (!checkedState[index]) {
      // If unchecked -> checked, add listOfWifi[index] to wifiCredentials
      updatedWifiCredentials.push(listOfWifi[index]); // Push the selected wifi data (name & password)
      setSelectedItems([...selectedItems, item]);
    } else {
      // If checked -> unchecked, remove listOfWifi[index] from wifiCredentials
      updatedWifiCredentials = updatedWifiCredentials.filter(
        (wifi) => wifi.name !== listOfWifi[index].name
      ); // Remove by comparing the `name` field (or any unique field)
      setSelectedItems(selectedItems.filter((selectedItem) => selectedItem !== item));
    }
  
    // Update application form data with new wifiCredentials
    setApplicationFormData({
      ...applicationFormData,
      wifiCredentials: updatedWifiCredentials
    });
  
    console.log('updatedWifiCredentials', updatedWifiCredentials);
  };
  


  const FetchListOFWIFI = async () => {
    try {
      dispatch(startLoading());
      var result = await executedFetchListWIFILambda(user?.credentials); 
      if(result.statusCode == 200) {
        dispatch(setwifiList(result.body));
      } else {
        console.log(' error result.body',result.body)
      }
    } catch (error) {
      handleError(error, 'Error FetchListOFWIFI')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  console.log('listOfWifi', listOfWifi);

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

  const handleQr = async (qr) => {
    if(serialNumber) {
      console.log('qr',qr);
      setQrShare({
        title: "Share QR",
        message: "Share Qr",
        onClickAction: async (data) => {
          try{
            console.log('check qr', qr);
            console.log('data',data);
            dispatch(startLoading()); // Dispatch the startLoading action
            // Handle the action when the user clicks OK
            let result_data =  await executeShareQrLambda(user?.credentials, data, qr,serialNumber);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              setDialogData({
                title: "Success",
                message: " Qr is sent to your email successfully",
                onClickAction: async () => {
                  // Handle the action when the user clicks OK
                  console.log("handleQr");
                },
              })
            } else {
              setDialogData({
                title: "Error",
                message: "Something went wrong please try again later",
                onClickAction: () => {
                  // Handle the action when the user clicks OK
                  console.log("error handleQr");
                },
              })
            }
          } catch( err) {
            handleError(err, 'Error handleQr')
          } finally {
            dispatch(stopLoading()); // Dispatch the stopLoading action
          }
        },
      })

    } else {
      setDialogData({
        title: "Error",
        message: "Serial Number Not found",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("error handleQr");
        },
      })
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
  const handleChangeIotComplex = async (selectedOption) => {
    console.log('handleChangeIotComplex',selectedOption);
    dispatch(setComplexName(selectedOption.value));
    setSelectedOptionIotComplex(selectedOption);
    ListOfIotComplexDetails(selectedOption.value)
    ListOfIotClientName();
    ListOfIotBillingGroup();
    setComplexChanged(true)
    ListOfIotCabin(selectedOption.value);
    setNextBtn(true)
  }

  const handleChangeLanguage = (selectedOption) => {
    console.log('handleChangeLanguage', selectedOption);
    setSelectedOptionLanguage(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      language: selectedOption.value,
    }));
  }

  const handleChangeAmsField = (selectedOption) => {
      setAmsEnableOption(selectedOption);
      setApplicationFormData( prevFormData => ({
        ...prevFormData,
        isAmsEnabled: selectedOption.value,
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

  const handleChangeDummyCabin = async(selectedOption) => {
    console.log('handleChangeDummyCabin', selectedOption);
    setDummyCabin(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      dummy_bwt_cabin: selectedOption.value,
    }));

  }

  const handleChangeApplicationType = (selectedOption) => {
    console.log('handleChangeApplicationType',selectedOption);
    setApplicationTypeOption(selectedOption);
    setApplicationFormData( prevFormData => ({
      ...prevFormData,
      application_type: selectedOption.value,
    }));
    if(selectedOption.value == "Cabin Automation System with BWT") {
      setDummyCabinShow(true)
    } else {
      setDummyCabinShow(false);
      setDummyCabin(null);
      setApplicationFormData(prevFormData => {
        const updatedFormData = { ...prevFormData };
        delete updatedFormData.dummy_bwt_cabin;
        return updatedFormData;
      });
    }
  }

  const totalSteps = () => {
    console.log('totalSteps', steps.length);
    return steps.length;
  };

  const completedSteps = () => {
    console.log('Object.keys(completed).length',Object.keys(completed).length);
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
    setNextBtn(false)
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setNextBtn(true)
  };

  const handleStep = (step) => () => {
    setActiveStep(step);
  };

  console.log('activeStep', activeStep);
  console.log('completed', completed);

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
    dispatch(setStateIotList([]))
    dispatch(setDistrictIotList([]))
    dispatch(setCityIotList([]))
    dispatch(setComplexIotList([]))
    dispatch(setComplexIotDetail({}))
    dispatch(setComplexName(null))
    setApplicationTypeOption({ label: 'Cabin Automation System Without BWT', value: 'Cabin Automation System without BWT'})
    setUpiPaymentStatus({ label: 'No', value: 'No' })
    setSelectedOptionLanguage({ label: 'Hindi', value: 'Hindi' })
    setApplicationFormData({
      unattended_timmer: 20,
      application_type: 'Cabin Automation System without BWT',
      upi_payment_status: 'No',
      language: 'Hindi',
      margin_left: 0,
      margin_right: 0,
      margin_top: 0,
      margin_bottom: 0
    });
    setQrImage(null);
    setSerialNumber(null);
    dispatch(setListOfPolicy(null))
    dispatch(setPolicyName(null));
    dispatch(setPolicyDetails(null));
    dispatch(setCabinList([]));
    dispatch(setCabinDetails(null));
    dispatch(setCabinName(null));
    setSerialNumberEnable(false);
    setApplicationDetails(false);
    setPolicyEnabled(false)
    setNextBtn(false)
    setQrShare(false)
  };

  const handleResetComplex = () => {
    console.log('handleResetComplex clicked')
    handleReset();
  }

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
    console.log('registerCabin',registerCabin);
    if(registerCabin == true) {
      ListOfIotCabin(complexName);
    }
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

  const listOfPolicyLambda = async () => {
    try{
        dispatch(startLoading());
        let enterprise_id = selectedOptionEnterprise.value;
        let listPolicy = await executeListPolicyLambda(user?.credentials, enterprise_id);
        console.log('listPolicy', listPolicy);
        const options = listPolicy.body.map(item => ({
          value: item.name,
          label: item.name
        }));
        console.log('options',options)
        dispatch(setListOfPolicy(options));
        if(listPolicy.statusCode == 200) {
          // setSerialNumberEnable(true);
          // setNextBtn(true)
          // setDialogData({
          //   title: "Success",
          //   message: "Poli",
          //   onClickAction: () => {
          //     // Handle the action when the user clicks OK
          //     console.log(`listOfPolicyLambda function -->`);
          //   },
          // });
        } else {
          setDialogData({
            title: "Error",
            message: 'SomethingWent wrong Please try again',
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log(`listOfPolicyLambda -->`);
            },
          });
        }
      } catch (error) {
        handleError(error, 'Error listOfPolicyLambda')
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
          enterprises_id: selectedOptionEnterprise?.value,
          cabin_name: selectedCabin,
          cabin_details: Cabin_value_update,
          complex_details: complex_value_update,
          extra_details: {
            serial_number: serialNumber
          },
          enterpriseId: selectedOptionEnterprise.value
        }
        console.log('object',object);
        let result = await executeSaveDevicesLambda(user?.credentials, object);
        console.log('executeSaveDevicesLambda result', result);
        if(result.statusCode == 403) {
          setDialogTableData({
            title: "Success",
            message: result.body,
            table:  `
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr>
                  <th style="border: 1px solid #ddd; padding: 8px;">Sr.No.</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Serial Name</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">State</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">District</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">City</th>
                  <th style="border: 1px solid #ddd; padding: 8px;">Complex</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style="border: 1px solid #ddd; padding: 8px;">1</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${result.data.serial_number}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${AttributeFilter(result.data.complex_details,1)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${AttributeFilter(result.data.complex_details,2)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${AttributeFilter(result.data.complex_details,3)}</td>
                  <td style="border: 1px solid #ddd; padding: 8px;">${result.data.complex_name}</td>
                </tr>
              </tbody>
            </table>
          `,
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log(`handleSaveData function -->`);
            },
          });
          return;
        } 
        let enterprise_id = selectedOptionEnterprise.value;
        let listPolicy = await executeListPolicyLambda(user?.credentials, enterprise_id);
        console.log('listPolicy', listPolicy);
        const options = listPolicy.body.map(item => ({
          value: item.name,
          label: item.name
        }));
        console.log('options',options)
        dispatch(setListOfPolicy(options));
        await FetchListOFWIFI();
        if(result.statusCode == 200) {
          setSerialNumberEnable(true);
          setNextBtn(true)
          setDialogData({
            title: "Success",
            message: result.body,
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log(`handleSaveData function -->`);
              handleComplete();
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

  const handlePolicySave = async() => {
    try{
      dispatch(startLoading());
      let policy_details_section = {
        serial_number: serialNumber,
        command: "update-data",
        details_type: "policy_details",
        value : {
          policy_name : policyName
        },
      }
      console.log('policy_details_section', policy_details_section);
      let policy_update = await executeUpdateDeviceLambda(user?.credentials,policy_details_section);
      console.log('policy_update',policy_update);
      if(policy_update.statusCode == 200) {
        setPolicyEnabled(true);
        setNextBtn(true)
        setDialogData({
          title: "Success",
          message: "Policy Details " + policy_update.body,
          onClickAction: async () => {
            console.log('handlePolicySave clicked')
            handleComplete()
          },
        });
        dispatch(stopLoading()); // Dispatch the stopLoading action
      } else {
        setDialogData({
          title: "Error",
          message: 'Policy Details not save Please try again',
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handlePolicySave -->`);
          },
        });
        dispatch(stopLoading()); // Dispatch the stopLoading action
        return true;
      }
    } catch (error) {
      handleError(error, 'Error handlePolicySave')
      dispatch(stopLoading()); // Dispatch the stopLoading action

    } finally {
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
         return;
        } else if (applicationFormData.wifiCredentials == undefined || applicationFormData.defaultWifi == undefined || applicationFormData.wifiCredentials?.length == 0 || Object.keys(applicationFormData.defaultWifi)?.length === 0) {
          setDialogData({
            title: "Validation Error",
            message: "Please Select Wifi Credentials and select default wifi credentials",
            onClickAction: () => {
              // Handle the action when the user clicks OK
              console.log("handleSaveDetails");
            },
          })
          return;
        }
        if(applicationFormData.application_type == "Cabin Automation System with BWT") {
          if(dummyCabin == '' || dummyCabin == null || dummyCabin == undefined) {
            setDialogData({
              title: "Validation Error",
              message: "Please Select BWT",
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log("handleSaveDetails");
              },
            })
            return;
          }
        }
    dispatch(startLoading());
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
      setApplicationDetails(true);
      setNextBtn(true)
      setDialogData({
        title: "Success",
        message: "Application Details " + application_update.body,
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
            handleComplete()
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
    } finally {
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
        onClose: async()=>{
          setDialogCreatePolicy(false)
        },
        onClickAction: async (data) => {
          data.enterprises_id = selectedOptionEnterprise.value;
          console.log('data',data);
          try{
            dispatch(startLoading()); // Dispatch the startLoading action
            
            let result_data =  await executeCreatePolicyLambda(user?.credentials, data);
            console.log('result_data',result_data);
            if(result_data.statusCode == 200) {
              await listOfPolicyLambda();
              setDialogData({
                title: "Success",
                message: "Policy Created is successfully",
                onClickAction: async () => {
                  // window.location.reload();
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
                  navigate("/android_management")
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

  const handleRedirect = () => {
    navigate("/android_management")
  }

  useEffect(() => {
    if (nextBtn) {
    } else {
      enabled();
    }
  }, [nextBtn]);

  function enabled() {

    let key_array = Object.keys(completed);
    console.log('key_array',key_array);
    console.log(key_array.indexOf(String(activeStep)))
    let check = key_array.indexOf(String(activeStep))
    console.log('key check', check)
    if(check == 1) {
      console.log('ttt')
      setNextBtn(true)
    } else {
      console.log('ttt33')
    }

    if(selectedCabin && activeStep == 1) {
      console.log('aaaa')
      setNextBtn(true)
    }

    if(serialNumberEnable == true && activeStep == 2) {
      console.log('aaaa')
      setNextBtn(true)
    }

    if(policyEnabled == true && activeStep == 3) {
      console.log('bb')
      setNextBtn(true)
    }

    if(applicationDetails == true && activeStep == 4) {
      console.log('ccc')
      setNextBtn(true)
    }
    return
    // console.log('function is call',activeStep)
    // console.log('check', completed[activeStep]);
    // if(activeStep == 0 && selectedOptionIotComplex.value !== '' ) {
    //   console.log('first component ');
    //   if(activeStep == 1) {
    //     if(selectedCabin) {
    //       console.log('second component ');
    //       console.log('checking true',selectedCabin)
    //       setNextBtn(true)
    //     }
    //   }
    //   setNextBtn(true)
    // }

    // if(activeStep == 1 && selectedCabin) {
    //   console.log('second component ');
    //   console.log('checking true',selectedCabin)
    //   setNextBtn(true)
    // }


    // if(activeStep == 0 && selectedOptionIotComplex.value !== '' ) {
    //   setNextBtn(true)
    // }

    // if(activeStep == 1 && selectedCabin) {
    //   console.log('second page')
    //   setNextBtn(true)
    // }
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
        <MessageDialogTable data={dialogTableData} />
        <ModalShareQR data={qrShare} />
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label} completed={completed[index]}>
            {/* <StepButton color="inherit" onClick={handleStep(index)}> */}
            <StepButton color="inherit">
              {label}
            </StepButton>
          </Step>
        ))}
      <Button variant="contained" sx={{borderRadius: '26px'}} className="close_btn" onClick={handleRedirect}><CloseIcon /></Button>
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
              <Button variant="contained" onClick={handleReset}>Reset</Button>
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
                    <UpdateComplex complexChanged={complexChanged} selected={selectedOptionIotComplex} setComplexChanged={setComplexChanged} 
                    handleResetComplex={handleResetComplex} /> // Pass complexChanged as a prop
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
                      isDisabled={selectedOptionIotComplex && selectedOptionIotComplex.value !== ''} 
                      />
                    <br />
                    <Select options={districtIotList || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District"
                                          isDisabled={selectedOptionIotComplex && selectedOptionIotComplex.value !== ''} 
                                          />
                    <br />
                    <Select options={cityIotList || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select City" 
                                          isDisabled={selectedOptionIotComplex && selectedOptionIotComplex.value !== ''} 
                    />
                    <br />
                    <Select options={complexIotList || []} value={selectedOptionIotComplex} onChange={handleChangeIotComplex} placeholder="Select Complex" 
                                          isDisabled={selectedOptionIotComplex && selectedOptionIotComplex.value !== ''} 
/> 
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
                    <p>Note :- If you are going to select product type as Cabin Automation System with BWT, please register a BWT Cabin if you haven't already registered it. </p>
                    <h3> Cabin Details </h3>
                    <br/>
                  {dialogCabinDetails &&(
                    <ReadCabinDetails dialogCabinDetails={dialogCabinDetails} setDialogCabinDetails={openCabinModal}/>
                  )}
                  {(registerCabin) && (
                    <RegisterCabin openModal={registerCabin} selected={selectedOptionIotComplex} setModalToggle={OpenRegisterCabinModal} /> // Pass complexChanged as a prop
                  )}
                 {cabinList && cabinList.map((cabin, index) => (
                  <Row key={index} style={{ marginBottom: '10px', alignItems: 'center', backgroundColor: 'ghostwhite', width: '100%' }} className="cabin-row clickable-row"     onClick={() => !selectedCabin && handleCabinDetails(cabin)} // Disable row click if selectedCabin exists

                  >
                     <Col xs="auto">
                      <Input
                        type="radio"
                        name="selectedCabin"
                        value={cabin}
                        checked={selectedCabin === cabin}
                        onChange={() => handleRadioChange(cabin)}
                        disabled={!!selectedCabin} // Disable radio button if selectedCabin exists
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
                    
                    {serialNumberEnable == true ? <>
                        <Input
                        id="serial_number"
                        name="serial_number"
                        placeholder="Please Enter Serial Number"
                        type="text"
                        value={serialNumber}
                        disabled = {serialNumberEnable == true ? true: false}
                        />
                    </>: (
                      <>
                      <Input
                      id="serial_number"
                      name="serial_number"
                      placeholder="Please Enter Serial Number"
                      type="text"
                      onChange={(e) => setSerialNumber(e.target.value)}
                      disabled = {serialNumberEnable == true ? true: false}
                    />
                        <br/>
                      <Button
                        variant="contained"
                        onClick={handleSaveData}
                      >
                        Submit
                      </Button>
                      </>
                    )}
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
                    variant="contained"
                    color="primary"
                    className="add-button"
                  >
                    <AddIcon /> Create Policy 
                  </Button>
                  <br />
                  <br />
                  {(listOfPolicy?.length > 0 && serialNumberEnable == true) && (
                    <>
                    
                    {listOfPolicy && listOfPolicy.map((policy, index) => (
                    <Row key={index} style={{ marginBottom: '10px', alignItems: 'center', backgroundColor: 'ghostwhite', width: '100%' }} className="cabin-row clickable-row" onClick={() => !policyEnabled && handlePolicy(policy.value)}
                    >
                       <Col xs="auto">
                        <Input
                          type="radio"
                          name="selectedPolcy"
                          value={policy.value}
                          checked={policyName === policy.value}
                          onChange={() => handlePolicy(policy.value)}
                          disabled={!!policyEnabled}
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
                    {policyEnabled == true ? <></> : (
                     <Button
                        variant="contained"
                        onClick={handlePolicySave}
                      >
                        Submit
                      </Button>
                    )}
                    </>
                  )}
                </div>
              )}
              {activeStep === 4 && (
                <div>
                  <h3> Application Details</h3>
                  {policyName && (
                    <>
                    {console.log('checking log')}
                    {console.log('application', cabinDetails.thingName)}
                    <label>Unattended Timmer</label>
                      <Input
                      id="unattended_timmer"
                      name="unattended_timmer"
                      placeholder="unattended timmer"
                      type="number"
                      onChange={(e) => handleChange(e)}
                      value = {applicationFormData.unattended_timmer}
                    />
                      <br />
                      <label>Application Type</label>
                      {cabinDetails.thingName.includes('BWT') && (
                        <Select 
                          options={applicationType.filter(option => option.value === 'Black Water Treatment')} 
                          value={applicationTypeOption} 
                          onChange={handleChangeApplicationType} 
                          placeholder="Application Type" 
                        />
                      )}
                      {cabinDetails.thingName.includes('WC') && (
                        <Select 
                          options={applicationType.filter(option => option.value !== 'Black Water Treatment')} 
                          value={applicationTypeOption} 
                          onChange={handleChangeApplicationType} 
                          placeholder="Application Type" 
                        />
                      )}
                       {cabinDetails.thingName.includes('UR') && (
                        <Select 
                          options={applicationType.filter(option => option.value === 'Entry Management System')} 
                          value={applicationTypeOption} 
                          onChange={handleChangeApplicationType} 
                          placeholder="Application Type" 
                        />
                      )}
                      <br />
                      {/* <label>Please selecte BWT</label> */}
                      {dummyCabinShow && (
                        <Select 
                        options={cabinList
                          .filter(cabin => cabin.includes('BWT'))
                          .map(cabin => ({ label: cabin, value: cabin }))
                        }
                        value={dummyCabin} 
                        onChange={handleChangeDummyCabin} 
                        placeholder="List of BWT" 
                      />
                      )}
                      <br />
                      <label>Upi Payment Status</label>
                      <Select options={upiPaymentStatusOption || []} value={upiPaymentStatus} onChange={handleChangeUpiPaymentStatus} placeholder="UPI Payment Status" />
                      <br />
                      <label>Select Language</label>
                      <Select options={language || []} value={selectedOptionLanguage} onChange={handleChangeLanguage} placeholder="Select Language" />
                      <br />
                      <label>Ams Enable</label> 
                      <Select options={AmsEnable} value={amsEnableOptions} onChange={handleChangeAmsField} placeholder="Select Ams Field" />
                      <br />
                      <label>Margin Left</label>
                      <Input
                      id="margin_left"
                      name="margin_left"
                      placeholder="Margin Left"
                      type="number"
                      onChange={(e) => handleChange(e)}
                      value = {applicationFormData.margin_left}
                    />
                    <br />
                    <label>Margin Right</label>
                    <Input
                      id="margin_right"
                      name="margin_right"
                      placeholder="Margin Right"
                      type="number"
                      onChange={(e) => handleChange(e)}
                      value = {applicationFormData.margin_right}
                    />
                    <br />
                    <label>Margin Top</label>
                    <Input
                      id="margin_top"
                      name="margin_top"
                      placeholder="Margin Top"
                      type="number"
                      onChange={(e) => handleChange(e)}
                      value = {applicationFormData.margin_top}
                    />
                    <br />
                    <label>Margin Bottom</label>
                    <Input
                      id="margin_bottom"
                      name="margin_bottom"
                      placeholder="Margin Bottom"
                      type="number"
                      onChange={(e) => handleChange(e)}
                      value = {applicationFormData.margin_bottom}
                    />
                    <br />
                    <label>Wifi Credentials</label>
                    {/*  Component rendering Wi-Fi list with checkboxes */}
                    {listOfWifi.map((item, index) => (
                        <>
                          <Card variant="outlined" key={index} style={{ margin: "10px", padding: "15px", width: "100%" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between", // Space between checkbox, text, and radio button
                                width: "100%",  // Full width to avoid content breaking
                                position: "relative",
                              }}
                            >
                              {/* Left section (Checkbox + Wi-Fi info) */}
                              <div style={{ display: "flex", alignItems: "center", width: "80%" }}>
                                {/* Checkbox */}
                                <input
                                  type="checkbox"
                                  id={`checkbox-${index}`}
                                  checked={checkedState[index] || false} // Ensure checkedState[index] is boolean
                                  onChange={() => handleCheckboxChange(index, item)} // Pass index and item for selection
                                  style={{
                                    marginRight: "20px", // Adds space between checkbox and text
                                  }}
                                />

                                {/* Display Wi-Fi name and password */}
                                <div style={{ flexGrow: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  <div>{item.name}</div>
                                  <div>{item.password}</div>
                                </div>
                              </div>

                              {/* Right section (Radio Button for Set Default) */}
                              {checkedState[index] && showRadios && (
                                <input
                                  type="radio"
                                  name="defaultWifi"
                                  checked={defaultWifi === index}
                                  onChange={() => handleRadioWifiDefaultChange(index)}
                                  style={{ marginLeft: "20px" }}
                                />
                              )}
                            </div>
                          </Card>
                          <br />
                        </>
                      ))}

                      <br />
                      
                      <Button variant="contained" onClick={handleSetDefaultClick}>
                        {showRadios ? 'Choose Default wifi' : 'Set Default Wifi'}
                      </Button>
                      <br />
                      <br />
                      {applicationDetails == true ? <></> : (
                        <Button variant="contained" onClick={handleSaveDetails}>
                          Save Details
                        </Button>
                      )}


                    </>
                    )} 
                </div>
              )}
              {activeStep === 5 && (
                <div>
                  <h3 className="image-text">QR Show</h3>
                  {(listOfPolicy?.length > 0 && applicationDetails == true ) &&(
                   <div className="image-container">
                   <img src={qrImage} alt="QR Image" className="centered-image" />
                   <Button
                      onClick={() => handleQr(qrImage)}
                      color="primary"
                      className="px-2 d-flex align-items-center edit_button_device" // Adjust padding and add flex properties
                      style={{
                        ...whiteSurfaceCircularBorder,
                        width: "50px",
                        height: "35px",
                        fontSize: "14px", // Adjust font size here
                        marginLeft: "15px"
                      }}
                        // Add the inert attribute conditionally
                        inert={true}
                    >
                      <span style={{ marginRight: '2px', color: "blue"}}><ShareIcon/></span>
                    </Button>
                 </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <br />
        <Box  sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="contained" disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {nextBtn && (
              <Button
                variant="contained"
                onClick={handleComplete}
              >
                {/* {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Next'} */}
                {'Next'}
              </Button>
            )}
            </Box >
          {/* {activeStep === steps.length ? <> </> : (
            <Button
              variant="contained"
              onClick={handleComplete}
            >
              {'Next'}
            </Button>
            )} */}
             {/* <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} /> */}
              <Button variant="contained" onClick={handleReset}>Reset</Button>
            {/* </Box> */}
        </Box >
      </div>
    </Box>
    </div>
  );
};
