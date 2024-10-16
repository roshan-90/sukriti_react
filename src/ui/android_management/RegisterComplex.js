import React, { useState , useEffect} from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import './enrollDevice.css';
import Select from 'react-select'; // Importing react-select
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Importing the styles for react-datepicker
import {
  executeCreateComplexLambda,
  executelistIotDynamicLambda,
  executelistIotSingleLambda,
  executelistDDbCityLambda,
  executeAddDdbStateLambda,
  executeAddBillingroupLambda,
  executeClientGroupLambda,
  executedFetchListLogoLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { selectUser } from "../../features/authenticationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { setResetData } from "../../features/androidManagementSlice";
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setComplexName, setlogoList} from "../../features/androidManagementSlice";
import ModalSelect from '../../dialogs/ModalSelect';
import ModalClient from './ModalClient';
import ModalBillingGroup from './ModalBillingGroup';
import { FaCheck } from "react-icons/fa";


export const RegisterComplex = ({ openModal , selected, setModalToggle}) => { // Receive complexChanged as a prop
  const [modal, setModal] = useState(true);
  const ComplexIotDetails = useSelector((state) => state.androidManagement.complexIotDetail);
  const ListclientName = useSelector((state) => state.androidManagement.clientName);
  const ListbillingGroups = useSelector((state) => state.androidManagement.billingGroups);
  const complexName = useSelector((state) => state.androidManagement.complexName);
  const ListOfLogo = useSelector((state) => state.androidManagement.logoList);
  const [selectedClientName, setSelectedClientName] = useState(null); // State for react-select
  const [selectedbillingGroups, setSelectedbillingGroups] = useState(null); // State for react-select
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSmartness, setSelectedSmartness] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const stateIotList = useSelector((state) => state.androidManagement.stateIotList);
  const [selectedOption, setSelectedOption] = useState(null); // State for react-select
  const districtIotList = useSelector((state) => state.androidManagement.districtIotList);
  const cityIotList = useSelector((state) => state.androidManagement.cityIotList);
  const [selectedOptionIotDistrict, setSelectedOptionIotDistrict] = useState(null); // State for react-select
  const [selectedOptionIotCity, setSelectedOptionIotCity] = useState(null); // State for react-select
  const [dialogDatas, setdialogDatas] = useState(null);
  const [modalClient, setModalClient] = useState(null);
  const [modalBillingGroup, setModalBillingGroup] = useState(null);
  const [complexVerify, setComplexVerify ] = useState(null);
  const complexIotList = useSelector((state) => state.androidManagement.complexIotList);
  const [checkedState, setCheckedState] = useState([]);

 // Update checkedState when ListOfLogo changes
 useEffect(() => {
  if (ListOfLogo.length > 0) {
    setCheckedState(new Array(ListOfLogo.length).fill(false));
  }
}, [ListOfLogo]);



  const smartnessLevels = [
    { label: 'None', value: 'None' },
    { label: 'Basic', value: 'Basic' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Extra-Premium', value: 'Extra-Premium' }
  ];

  const options = [
    { value: true, label: 'True' },
    { value: false, label: 'False' }
  ];


  const [formData, setFormData] = useState({
    ADDR : "",
    ARSR : "",
    AR_K : "",
    BILL : "",
    CITY_CODE : "",
    CITY_NAME : "",
    CIVL : "",
    CLNT : "",
    CLIENT_LOGO: "https://sukriti-mis-logos.s3.amazonaws.com/IOCL/default.png",
    COCO : "false",
    CWTM : "",
    DATE : "",
    DEVT : "Toilet",
    DISTRICT_CODE : "",
    DISTRICT_NAME : "",
    LATT : "",
    LONG : "",
    MANU : "", 
    MODIFIED_BY : user.username,
    MSNI : "",
    MSNV : "",
    ONMP : "",
    QBWT : "",
    QFWC : "",
    QMWC : "",
    QPWC : "",
    QSNI : "",
    QSNV : "",
    QURC : "",
    QURI : "",
    ROUTER_IMEI : "",
    ROUTER_MOBILE : "",
    SLVL : "",
    STATE_CODE : "",
    STATE_NAME : "",
    TECH : "",
    THINGGROUPTYPE : "COMPLEX", 
    UUID : "",
    Name: "",
    Parent: ""
  });

// Function to handle checkbox change (radio button-like behavior)
const handleCheckboxChange = (index) => {
  const updatedCheckedState = checkedState.map((_, i) =>
    i === index ? true : false
  );
  console.log('logo value', ListOfLogo[index]);
  setFormData({ ...formData, CLIENT_LOGO: ListOfLogo[index] });
  setCheckedState(updatedCheckedState);
};


 // Get all checked items
 const getCheckedValues = () => {
  return ListOfLogo.filter((item, index) => checkedState[index]);
};

console.log('Checked items:', getCheckedValues()); // Logs checked items
console.log('formData', formData);

  // useEffect(() => {
  //   if(ListclientName && ListbillingGroups ) {
  //     const selectedClientOption = ListclientName.find(option => option.value === ComplexIotDetails.CLNT)
  //     const selectetBillingOption = ListbillingGroups.find(option => option.value === ComplexIotDetails.BILL)
  //     setSelectedClientName(selectedClientOption || null);
  //     setSelectedbillingGroups(selectetBillingOption || null);
  //   }
  // },[ListclientName,ListbillingGroups])

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


  const handleChangeIotState = (selectedOption) => {
    console.log('check', selectedOption);
    dispatch(setDistrictIotList([]));
    dispatch(setCityIotList([]));
    dispatch(setComplexIotList([]));
    setSelectedOptionIotDistrict(null)
    setSelectedOptionIotCity(null);
    setSelectedOption(selectedOption); // Update state if selectedOption is not null
    ListOfIotDistrict(selectedOption.value)
    // setFormData({ ...formData,STATE_CODE:selectedOption.value});
    // setFormData({ ...formData,STATE_NAME:selectedOption.label});
  };

  const handleChangeIotDistrict = (selectedOption) => {
    dispatch(setCityIotList([]));
    setSelectedOptionIotCity(null)
    console.log('handleChangeIotDistrict',selectedOption);
    // setFormData({ ...formData, DISTRICT_CODE: selectedOption.value });
    // setFormData({ ...formData, DISTRICT_NAME: selectedOption.label });
    setSelectedOptionIotDistrict(selectedOption);
    ListOfIotCity(selectedOption.value)
  }

  const ListOfIotDistrict = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-district";
      var result = await executelistIotDynamicLambda(user.username, user?.credentials, value,command);
      console.log('result',result);
      console.log('result.body',result.body);
      if(result.statusCode !== 404){
        // Map raw data to react-select format
        const options = result.body.map(item => ({
          value: item.CODE,
          label: item.NAME
        }));
        dispatch(setDistrictIotList(options));
      }
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
      if(result.statusCode !== 404){
        // Map raw data to react-select format
        const options = result.body.map(item => ({
          value: item.CODE,
          label: item.NAME
        }));
        dispatch(setCityIotList(options));
        // ListOfIotClientName();
        // ListOfIotBillingGroup();
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotCity')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleChangeIotCity = (selectedOption) => {
    dispatch(setComplexIotList([]));
    console.log('handleChangeIotCity',selectedOption);
    setFormData({ ...formData, Parent: selectedOption.value });
    setSelectedOptionIotCity(selectedOption);
    setFormData(prevFormData => ({
      ...prevFormData,
      CITY_NAME: selectedOption.label,
      CITY_CODE: selectedOption.value,
  }));
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

  console.log('ComplexIotDetails',ComplexIotDetails);
  console.log('ListclientName',ListclientName);
  console.log('selected', selected);

  const toggle = () => {
    // dispatch(setStateIotList([]));
    // dispatch(setDistrictIotList([]));
    // dispatch(setCityIotList([]));
    // dispatch(setComplexIotList([]));
    dispatch(setlogoList([]));
    setModal(!modal)
    setModalToggle(false)
  };

  const handleChangeClientName = (selectedOption) => {
    console.log('handleChangeClientName',selectedOption)
    setFormData({ ...formData, CLNT: selectedOption.value });
    setSelectedClientName(selectedOption)
    FetchListOfLogo(selectedOption.value)

  }

  const handleChangeBillingGroup = (selectedOption) => {
    console.log('handleChangeBillingGroup',selectedOption)
    setFormData({ ...formData, BILL: selectedOption.value });
    setSelectedbillingGroups(selectedOption)
  }

  const handleChangeSmartnessLevel = (selectedOption) => {
    console.log('handleChangeSmartnessLevel',selectedOption);
    setFormData({ ...formData, SLVL: selectedOption.value });
    setSelectedSmartness(selectedOption)
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    console.log('formattedDate',formattedDate);
    setFormData({ ...formData, DATE: formattedDate });
  };

  // Update form state when form values change
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log('cheking :->', { name, value });
    setFormData({ ...formData, [name]: value });
  };


  const formatDate = (date) => {
    // Format the date to 'dd/MM/yyyy' format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const createComplex = async (value, name,parent) => {
    try {
      // if(!complexName) {
      //   setDialogData({
      //     title: "Error",
      //     message: "complex is not Selected",
      //     onClickAction: () => {
      //       // Handle the action when the user clicks OK
      //       console.log('complex is not select');
      //     },
      //   });
      //   return
      // }
      console.log('name, parent', {name, parent})
      dispatch(startLoading());
      let command = "add-iot-complex";
      var result = await executeCreateComplexLambda(user.username, user?.credentials, command, value, name, parent);
      console.log('result ClientName', result.body);
      toggle();
    } catch (error) {
      handleError(error, 'Error createComplex')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const submitForm = (e) => {
    let name = formData.Name
    let Parent = formData.Parent;
    // Deleting the keys
    delete formData.Name;
    delete formData.Parent;

      const outputArray = [];
      for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
              const value = formData[key];
              outputArray.push({ "Name": key, "Value": value });
          }
      }
    console.log('formData',outputArray)
    createComplex(outputArray,name,Parent);
  }


  const setWarnings = () => {
    if(complexVerify == true) {
      setDialogData({
        title: "Confirms",
        message: `Are you sure you want to create new Complex`,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`submitForm complex ${formData.Name}`);
          submitForm();
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: "Please Verify Complex Name",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log('Please Verify Complex Name');
        },
      });
      return
    }
  }
  const handleNewDistrict = async (value) => {
    try {
      console.log('selectedOption', selectedOption);
      if(selectedOption == null) {
        setDialogData({
          title: "Error",
          message: "Please Select State",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`Empty data found ${selectedOption}`);
          },
        });
        return;
      }
      dispatch(startLoading());
      let command = "list-ddb-district";
      var result = await executelistIotDynamicLambda(user.username,user?.credentials, selectedOption.value, command);
      console.log('result New District',result);
      const options = result.body.map(item => ({
        value: item.Code,
        label: item.Name
      }));
      setdialogDatas({
        title: "Add New District",
        options: options,
        placeHolder: 'Select District',
        onClickAction: async (data) => {
          // Handle the action when the user clicks OK
          console.log('handleNewDistrict triggers', data);

          let modify_data = {
            CODE: data.value,
            NAME: data.label.toUpperCase().replace(/ /g, "_"),
            PARENT: selectedOption.value
          }
          let command = "add-iot-district";
          await saveDdbSDC(command, modify_data);
          setSelectedOption(null);
        },
      });
    } catch (error) {
      handleError(error, 'Error handleNewDistrict')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleNewCity = async (value) => {
    try {
      console.log('selectedOption', selectedOption);
      console.log('selectedOptionIotDistrict',selectedOptionIotDistrict);
      if(selectedOption == null || selectedOptionIotDistrict == null ) {
        setDialogData({
          title: "Error",
          message: "Please Select State and District",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleNewCity Empty data found ${selectedOption}`);
          },
        });
        return;
      }
      dispatch(startLoading());
      let command = "list-ddb-city";
      var result = await executelistDDbCityLambda(user.username,user?.credentials, selectedOption.value, selectedOptionIotDistrict.value, command);
      console.log('result New City',result);
      const options = result.body.map(item => ({
        value: item.Code,
        label: item.Name
      }));
      setdialogDatas({
        title: "Add New City",
        options: options,
        placeHolder: 'Select City',
        onClickAction: async (data) => {
          // Handle the action when the user clicks OK
          console.log('handleNewCity triggers',data);
          let modify_data = {
            CODE: data.value,
            NAME: data.label.toUpperCase().replace(/ /g, "_"),
            PARENT: selectedOptionIotDistrict.value
          }
          let command = "add-iot-city";
          await saveDdbSDC(command, modify_data);
          setSelectedOptionIotDistrict(null);
        },
      });
    } catch (error) {
      handleError(error, 'Error handleNewDistrict')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }


  const handleState = async () => {
    try {
      dispatch(startLoading());
      let command = "list-ddb-state";
      var result = await executelistIotSingleLambda(user.username, user?.credentials, command);
      console.log('result',result);
      const options = result.body.map(item => ({
        value: item.Code,
        label: item.Name
      }));
      setdialogDatas({
        title: "Add New State",
        options: options,
        placeHolder: 'Select State',
        onClickAction: (data) => {
          // Handle the action when the user clicks OK
          console.log('handleState triggers',data);
          let modify_data = {
            CODE: data.value,
            NAME: data.label.toUpperCase()
          }
          let command = "add-iot-state";
          saveDdbSDC(command,modify_data);
        },
      });
    } catch (error) {
      handleError(error, 'Error handleState')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const saveDdbSDC = async (command,data) => {
    try {
      console.log(`saveDdbSDC ${command}`, data);
      dispatch(startLoading());
      var output = await executeAddDdbStateLambda(user.username, user?.credentials, command, data);
      console.log('output', output)
    } catch (error) {
      handleError(error, `Error saveDdbSDC ${command}`)
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const handleModalClient = () => {
    setModalClient({
      title: "Add New Client",
      onClickAction: async (data) => {
        // Handle the action when the user clicks OK
        try {
        console.log('handleModalClient triggers', data);
        let name = data.Name;
        let description = data.Description;

        // Deleting the keys
        delete data.Name;
        delete data.Description;

        // Converting to the desired format
        let resultArray = Object.keys(data).map(key => {
          return {
              "Name": key,
              "Value": data[key].toString()
          };
        });

        console.log(resultArray);

        let command = "add-iot-clientgroupName";
        dispatch(startLoading());
        var output = await executeClientGroupLambda(user.username, user?.credentials, command, resultArray,name,description);
        console.log('output', output)
        } catch (error) { 
          handleError(error, `Error handleModalClient`)
        } finally {
          dispatch(stopLoading()); // Dispatch the stopLoading action
        }
      },
    });
  }

  const handleBillingGroup = () => {
    setModalBillingGroup({
      title: "Add New Billing Group",
      onClickAction: async (data) => {
        try {
        dispatch(startLoading());
        // Handle the action when the user clicks OK
        console.log('handleBillingGroup triggers', data);
        let command = "create-billing-group";
        var output = await executeAddBillingroupLambda(user.username, user?.credentials, command, data);
        console.log('output', output)
        } catch (error) {
          handleError(error, `Error handleBillingGroup`)
        } finally {
          dispatch(stopLoading()); // Dispatch the stopLoading action
        }
      },
    });
  }

  const FetchListOfLogo = async (name) => {
    try {
      dispatch(setlogoList([]));
      dispatch(startLoading());
      var result = await executedFetchListLogoLambda(user?.credentials, name);
      console.log('result FetchListOfLogo', result.body);
      if(result.statusCode == 200) {
        dispatch(setlogoList(result.body));
      } else {
        setDialogData({
          title: "Error",
          message: `Something Went wrong.`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log('FetchListOfLogo showing error')
            },
          });
      }
    } catch (error) {
      handleError(error, 'Error FetchListOfLogo')
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
        return options;
      } else {
        console.log('result.body',result.body)
        return [];
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotComplex')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const formatted3DigitNumber = async (Count) => {
    let strCount = "";
    if(Count<10)
        strCount = "00" + Count;
    else if(Count<100)
        strCount = "0" + Count;
    else
        strCount = "" + Count;
    return strCount;
  }

  const setUUID = async (count) => {
    let strCount = await formatted3DigitNumber(count);
    let UUID;
    let date = formData.DATE.replace("/", "");
    UUID = formData.CITY_CODE;
    UUID += "_" + date.replace("/", "_");
    UUID += "_" + strCount;
    return UUID;
  }

  const handleVerify = async () => {
    try {
      if(formData?.Name && selectedOptionIotCity?.value && selectedOptionIotDistrict?.value && selectedOption?.value){
        setFormData(prevFormData => ({
            ...prevFormData,
            DISTRICT_CODE: selectedOptionIotDistrict.value,
            DISTRICT_NAME: selectedOptionIotDistrict.label,
            STATE_CODE: selectedOption.value,
            STATE_NAME: selectedOption.label
        }));

      if(selectedOptionIotCity?.value) {
        let complexList = await ListOfIotComplex(selectedOptionIotCity.value);
        let uuid = await setUUID(complexList.length ? complexList.length : 0);
        console.log('uuid' , uuid);
        setFormData(prevFormData => ({
            ...prevFormData,
            UUID: uuid,
        }));
      }
        dispatch(startLoading());
        let command = "List-iot-all-complex";
        var result = await executelistIotSingleLambda(user.username, user?.credentials, command);
        console.log('list of complex', result.body.complexList);
        console.log('list of complex', result.body.complexList.length);
  
        // Value to check
        const valueToCheck = formData.Name;
  
        // Check if the value exists
        const valueExists = result.body.complexList.some(item => item.name == valueToCheck);
  
          if (valueExists) {
            setDialogData({
              title: "Not Verified",
              message: `The value "${valueToCheck}" exists .`,
              onClickAction: () => {
                // Handle the action when the user clicks OK
                console.log(`The value "${valueToCheck}" exists.`);
                },
              });
              setComplexVerify(false);
              return;
          }
          setComplexVerify(true);
      } else {
        setDialogData({
          title: "Not Verified",
          message: `Please Select Valid Input.`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            },
          });
      }
    } catch (error) {
      handleError(error, 'Error handleVerify')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  console.log('formData',formData);
  return (
    <div>
      {(openModal) && ( // Conditionally render based on complexChanged prop
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            {isLoading && (
              <div className="loader-container">
                <CircularProgress
                  className="loader"
                  style={{ color: "rgb(93 192 166)" }}
                />
              </div>
            )}
            <MessageDialog data={dialogData} />
            <ModalSelect data={dialogDatas} />
            <ModalClient data={modalClient} />
            <ModalBillingGroup data={modalBillingGroup} />
            <ModalHeader toggle={toggle}><b>Register Complex</b></ModalHeader>
            <ModalBody>
            <Card>
                <CardBody>
                  <CardTitle><b>Location Details</b></CardTitle>
                  <br/>
                  <Form>
                  <FormGroup row>
                    <Label
                      for="Name"
                      sm={3}
                    >
                    <b style={{fontSize:"small"}}> Complex Name</b>
                    </Label>
                    <Col sm={7}>
                      <Input
                        id="Name"
                        name="Name"
                        placeholder="complex Name"
                        type="text"
                        onChange={handleChange}
                      />
                    </Col>
                    <Col sm={2}>
                      {complexVerify == true ? <>
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
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="State"
                      sm={3}
                    >
                      <b style={{fontSize:"small"}}>State</b>
                    </Label>
                    <Col sm={7}>
                    <Select options={stateIotList || []} value={selectedOption} onChange={handleChangeIotState}         
                      onMenuOpen={() => {
                        if (!stateIotList || stateIotList.length === 0) {
                          ListOfIotState();
                        }
                      }} placeholder="Select State" />
                    </Col>
                    <Col sm={2}>
                      <Button color="success" onClick={handleState}>
                        New
                      </Button>{' '}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="District"
                      sm={3}
                    >
                    <b style={{fontSize:"small"}}> District</b>
                    </Label>
                    <Col sm={7}>
                      <Select options={districtIotList || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District" />
                    </Col>
                    <Col sm={2}>
                      <Button color="success" onClick={handleNewDistrict}>
                        New
                      </Button>{' '}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="City"
                      sm={3}
                    >
                    <b style={{fontSize:"small"}}> City </b>
                    </Label>
                    <Col sm={7}>
                      <Select options={cityIotList || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select City" />
                    </Col>
                    <Col sm={2}>
                      <Button color="success" onClick={handleNewCity}>
                        New
                      </Button>{' '}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                      <Label
                        for="Address"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}> Address </b> 
                      </Label>
                      <Col sm={9}>
                        <Input
                          id="ADDR"
                          name="ADDR"
                          type="textarea"
                          onChange={handleChange}
                        />
                      </Col>
                  </FormGroup>
                    <Row>
                    <Label
                        for="GeoLocation"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}> Geo Location </b>
                      </Label>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="lattitude">
                            Latitude
                          </Label>
                          <Input
                            id="LATT"
                            name="LATT"
                            placeholder="latitude"
                            type="text"
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={4}>
                        <FormGroup>
                          <Label for="longitude">
                            Longitude
                          </Label>
                          <Input
                            id="LONG"
                            name="LONG"
                            placeholder="longitude placeholder"
                            type="text"
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
                    <br/>
              <Card>
                <CardBody>
                    <CardTitle><b>Client Details</b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="client name"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Client Name</b>
                      </Label>

                      <Col sm={7}>
                      <Select options={ListclientName || []} value={selectedClientName} onChange={handleChangeClientName}  onMenuOpen={() => {
                        if (!ListclientName || ListclientName.length === 0) {
                          ListOfIotClientName();
                        }
                      }} placeholder="Client Name" />
                      </Col>
                      <Col sm={2}>
                        <Button color="success" onClick={handleModalClient}>
                          New
                        </Button>{' '}
                    </Col>
                    <Row style={{ margin: "10px" }}>
                        {ListOfLogo.length > 0 && ListOfLogo.map((item, index) => (
                          <div key={index} style={{ position: "relative", width: "20%", margin: "10px" }}>
                            {/* Checkbox */}
                            <input
                              type="checkbox"
                              id={`checkbox-${index}`}
                              checked={checkedState[index]}
                              onChange={() => handleCheckboxChange(index)}
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                                zIndex: 1 // Ensure checkbox is above the image
                              }}
                            />
                            {/* Image */}
                            <img src={item} alt={`logo-${index}`} style={{ width: "100%" }} />
                          </div>
                        ))}
                      </Row>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Billing Group"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}>  Billing Group</b>
                      </Label>
                      <Col sm={7}>
                        <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} onMenuOpen={() => {
                        if (!ListbillingGroups || ListbillingGroups.length === 0) {
                          ListOfIotBillingGroup();
                        }
                      }} placeholder="Billing Group Name" />
                      </Col>
                      <Col sm={2}>
                        <Button color="success" onClick={handleBillingGroup}>
                          New
                        </Button>{' '}
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Select Date"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}> Select Date </b>
                      </Label>
                      <Col sm={9} >
                      <DatePicker
                        id="selectDate"
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select date"
                      />
                      </Col>
                    </FormGroup>
                    </Form>
                </CardBody>
              </Card>
              <br/>
              <Card>
                <CardBody>
                    <CardTitle><b>Complex Attribute</b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="commissioning status"
                        sm={4}
                      >
                        <b style={{fontSize:"small"}}>Commissioning Status</b>
                      </Label>
                      <Col sm={8}>
                      <Input
                        id="COCO"
                        name="COCO"
                        placeholder="COCO"
                        type="text"
                        disabled={true}
                        value={"false"}
                      />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Device Type"
                        sm={4}
                      >
                      <b style={{fontSize:"small"}}>  Device Type</b>
                      </Label>
                      <Col sm={8}>
                        <Input
                          id="DEVT"
                          name="DEVT"
                          placeholder="DEVT"
                          type="text"
                          disabled={true}
                          value={"Toilet"}
                          onChange={handleChange}
                        />                      
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Label
                        for="Smartness Level"
                        sm={4}
                      >
                      <b style={{fontSize:"small"}}> Smartness Level</b>
                      </Label>
                      <Col sm={8}>
                          <Select options={smartnessLevels || []} value={selectedSmartness} onChange={handleChangeSmartnessLevel} placeholder="Smartness Level" />
                      </Col>
                    </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Wc Count"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> WC Count </b>
                          </Label>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of Male WC's">
                                Male WCs
                              </Label>
                              <Input
                                id="QMWC"
                                name="QMWC"
                                placeholder="Number of Male WC's"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of female WC's">
                                Female WCs
                              </Label>
                              <Input
                                id="QFWC"
                                name="QFWC"
                                placeholder="Number of female WC's"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="number of PD WC's">
                                PD WCs
                              </Label>
                              <Input
                                id="QPWC"
                                name="QPWC"
                                placeholder="Number of PD WC's"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Urinal Count"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> Urinal Count </b>
                          </Label>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of Urinals">
                                Number of Urinals
                              </Label>
                              <Input
                                id="QURI"
                                name="QURI"
                                placeholder="latitude"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of Urinal Cabins">
                                 Urinal Cabins
                              </Label>
                              <Input
                                id="QURC"
                                name="QURC"
                                placeholder="Number of Urinal Cabins"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of BWTs">
                                Number of BWTs
                              </Label>
                              <Input
                                id="QBWT"
                                name="QBWT"
                                placeholder="Number of BWTs"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Napkin Vending Machine"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}} > Napkin Vending Machine </b>
                          </Label>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="Number Napkin Vending Machine">
                                 Napkin Vending Machine
                              </Label>
                              <Input
                                id="QSNV"
                                name="QSNV"
                                placeholder="Number Napkin Vending Machine"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={5}>
                            <FormGroup>
                              <Label for="Manufacturer of Napkin VM">
                                Manufacturer of Napkin VM
                              </Label>
                              <Input
                                id="MSNV"
                                name="MSNV"
                                placeholder="Manufacturer of Napkin VM"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Napkin incinerator"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> Napkin incinerator</b>
                          </Label>
                          <Col md={4}>
                            <FormGroup>
                              <Label for="Number Napkin incinerator">
                                Number Napkin incinerator
                              </Label>
                              <Input
                                id="QSNI"
                                name="QSNI"
                                placeholder="Number Napkin incinerator"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={5}>
                            <FormGroup>
                              <Label for="Manufacturer of Napkin incinerator">
                                Manufacturer of Napkin incinerator
                              </Label>
                              <Input
                                id="MSNI"
                                name="MSNI"
                                placeholder="Manufacturer of Napkin incinerator"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Area of KIOSK"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> Area of KIOSK</b>
                          </Label>
                          <Col md={9}>
                            <FormGroup>
                              <Input
                                id="AR_K"
                                name="AR_K"
                                placeholder="Area of KIOSK"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Water Atm Capacity"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> Water Atm Capacity</b>
                          </Label>
                          <Col md={8}>
                            <FormGroup>
                              
                              <Input
                                id="CWTM"
                                name="CWTM"
                                placeholder="LPH"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={1}>
                              <Label for="LPH">
                                <b>LPH</b>
                              </Label>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Supervisior Room Size"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> Supervisior Room Size</b>
                          </Label>
                          <Col md={9}>
                            <FormGroup>
                              <Input
                                id="ARSR"
                                name="ARSR"
                                placeholder="ARSR"
                                type="text"
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                    </Form>
                </CardBody>
              </Card>
              <br/>
              <Card>
                <CardBody>
                    <CardTitle><b>Partners & Providers</b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="Manufacturer"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Manufacturer</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="MANU"
                          name="MANU"
                          placeholder="manufacturer placeholder"
                          type="text"
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Tech Provider"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Tech Provider</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="TECH"
                          name="TECH"
                          placeholder="Tech Provider placeholder"
                          type="text"
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Civil Partner"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Civil Partner</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="CIVL"
                          name="CIVL"
                          placeholder="CivilPartner placeholder"
                          type="text"
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="O&M Partner"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>O&M Partner</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="ONMP"
                          name="ONMP"
                          placeholder="O&M Partner placeholder"
                          type="text"
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    </Form>
                </CardBody>
              </Card>
              <br/>
              <Card>
                <CardBody>
                    <CardTitle><b>Router Details</b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="Router IMEI"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Router IMEI</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="ROUTER_IMEI"
                          name="ROUTER_IMEI"
                          placeholder="Router IMEI placeholder"
                          type="text"
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Router Mobile"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Router Mobile</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="ROUTER_MOBILE"
                          name="ROUTER_MOBILE"
                          placeholder="Router Mobile placeholder"
                          type="text"
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    </Form>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={setWarnings}>
              Submit
              </Button>{' '}
              <Button color="warning" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default RegisterComplex;
