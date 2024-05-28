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
  executelistIotCabinDynamicLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { selectUser } from "../../features/authenticationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { setResetData } from "../../features/androidManagementSlice";
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setCabinTypeList, setUserTypeList} from "../../features/androidManagementSlice";
import ModalSelect from '../../dialogs/ModalSelect';
import ModalClient from './ModalClient';
import ModalBillingGroup from './ModalBillingGroup';
import { FaCheck } from "react-icons/fa";


export const RegisterCabin = ({ openModal , selected, setModalToggle}) => { // Receive complexChanged as a prop
  const [modal, setModal] = useState(true);
  const ComplexIotDetails = useSelector((state) => state.androidManagement.complexIotDetail);
  const ListclientName = useSelector((state) => state.androidManagement.clientName);
  const ListbillingGroups = useSelector((state) => state.androidManagement.billingGroups);
  const complexName = useSelector((state) => state.androidManagement.complexName);
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
  const [selectedDeviceType, setSelectedDeviceType] = useState(null);
  const cabinTypeList = useSelector((state) => state.androidManagement.cabinTypeList);
  const userTypeList = useSelector((state) => state.androidManagement.userTypeList);
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [selectedUserChargeType, setSelectedUserChargeType] = useState(null);

  const smartnessLevels = [
    { label: 'None', value: 'None' },
    { label: 'Basic', value: 'Basic' },
    { label: 'Premium', value: 'Premium' },
    { label: 'Extra-Premium', value: 'Extra-Premium' }
  ];

  const userChargeType = [
    { label: 'None', value: 'None' },
    { label: 'COIN', value: 'COIN' },
    { label: 'COIN_RF', value: 'COIN_RF' },
    { label: 'RF', value: 'RF' }
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

  console.log('ComplexIotDetails',ComplexIotDetails);


  useEffect(() => {
    if(complexName) {
      ListOfIotCabinType(complexName)
      ListOfIotUserType(complexName)
    }
  },[complexName])


  const ListOfIotCabinType = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-CabinType";
      var result = await executelistIotCabinDynamicLambda('test_rk_mandi', user?.credentials, value, command);
      console.log('result',result);
      if(result.statusCode == 200){
      console.log('result CabinType', result.body);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item,
        label: item
      }));
      dispatch(setCabinTypeList(options))
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotCabinType')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const ListOfIotUserType = async (value) => {
    try {
      dispatch(startLoading());
      let command = "list-iot-UserType";
      var result = await executelistIotCabinDynamicLambda('test_rk_mandi', user?.credentials, value, command);
      console.log('result',result);
      if(result.statusCode == 200){
      console.log('result UserType', result.body);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item,
        label: item
      }));
      dispatch(setUserTypeList(options))
      }
    } catch (error) {
      handleError(error, 'Error ListOfIotCabinType')
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
    dispatch(setStateIotList([]));
    dispatch(setDistrictIotList([]));
    dispatch(setCityIotList([]));
    dispatch(setComplexIotList([]));
    setModal(!modal)
    setModalToggle(false)
  };

  const handleChangeClientName = (selectedOption) => {
    console.log('handleChangeClientName',selectedOption)
    setFormData({ ...formData, CLNT: selectedOption.value });
    setSelectedClientName(selectedOption)

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

  const handleChangeDeviceType = (selectedOption) => {
    console.log('handleChangeDeviceType',selectedOption);
    setSelectedDeviceType(selectedOption)
  }
  
  const handleChangeUserType = (selectedOption) => {
    console.log('handleChangeUserType',selectedOption);
    setSelectedUserType(selectedOption)
  }

  const handleChangeUserChargeType = (selectedOption) => {
    console.log('handleChangeUserChargeType',selectedOption);
    setSelectedUserChargeType(selectedOption);
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
    setDialogData({
      title: "Confirms",
      message: `Are you Sure submitForm ${formData.Name} Complex`,
      onClickAction: () => {
        // Handle the action when the user clicks OK
        console.log('submitForm complex');
        submitForm();
      },
    });
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
      var result = await executelistIotDynamicLambda('test_rk_mandi',user?.credentials, selectedOption.value, command);
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
      var result = await executelistDDbCityLambda('test_rk_mandi',user?.credentials, selectedOption.value, selectedOptionIotDistrict.value, command);
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
      var result = await executelistIotSingleLambda('test_rk_mandi', user?.credentials, command);
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
      var result = await executelistIotDynamicLambda('test_rk_mandi', user?.credentials, value, command);
      console.log('result',result);
      // Map raw data to react-select format
      const options = result.body.map(item => ({
        value: item.Name,
        label: item.Name
      }));
      dispatch(setComplexIotList(options));
      return options;
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
      if(formData.Name && selectedOptionIotCity.value && selectedOptionIotDistrict.value && selectedOption.value && formData.DATE ){
        setFormData(prevFormData => ({
            ...prevFormData,
            DISTRICT_CODE: selectedOptionIotDistrict.value,
            DISTRICT_NAME: selectedOptionIotDistrict.label,
            STATE_CODE: selectedOption.value,
            STATE_NAME: selectedOption.label
        }));

      if(selectedOptionIotCity.value) {
        let complexList = await ListOfIotComplex(selectedOptionIotCity.value);
        console.log('complexList', complexList.length);
        let uuid = await setUUID(complexList.length);
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
            {/* <ModalSelect data={dialogDatas} />
            <ModalClient data={modalClient} />
            <ModalBillingGroup data={modalBillingGroup} /> */}
            <ModalHeader toggle={toggle}><b>Register Cabin</b></ModalHeader>
            <ModalBody>
            <Card>
                <CardBody>
                  <CardTitle><b>Selected Complex</b></CardTitle>
                  <br/>
                  <Form>
                  <FormGroup row>
                    <Label
                      for="STATE"
                      sm={2}
                    >
                      <b style={{fontSize:"small"}}>STATE</b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="STATE"
                        name="STATE"
                        placeholder="STATE"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.STATE_NAME}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="DISTRICT"
                      sm={2}
                    >
                    <b style={{fontSize:"small"}}> DISTRICT </b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="DISTRICT"
                        name="DISTRICT"
                        placeholder="DISTRICT"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.DISTRICT_NAME}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="CITY"
                      sm={2}
                    >
                    <b style={{fontSize:"small"}}> CITY </b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="CITY"
                        name="CITY"
                        placeholder="city"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.CITY_NAME}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="Complex"
                      sm={2}
                    >
                    <b style={{fontSize:"small"}}> Complex </b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="complex"
                        name="complex"
                        placeholder="complex"
                        type="text"
                        disabled={true}
                        value={complexName}
                      />
                    </Col>
                  </FormGroup>
                  </Form>
                </CardBody>
              </Card>
                    <br/>
              <Card>
                {/* <CardBody>
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
                      <Select options={ListclientName || []} value={selectedClientName} onChange={handleChangeClientName} placeholder="Client Name" />
                      </Col>
                      <Col sm={2}>
                        <Button color="success" onClick={handleModalClient}>
                          New
                        </Button>{' '}
                    </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Billing Group"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}>  Billing Group</b>
                      </Label>
                      <Col sm={7}>
                        <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} placeholder="Billing Group Name" />
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
                </CardBody> */}
              </Card>
              <br/>
              <Card>
                <CardBody>
                    <CardTitle><b>Cabin Attribute</b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="Cabin Name"
                        sm={4}
                      >
                        <b style={{fontSize:"small"}}>Cabin Name</b>
                      </Label>
                      <Col sm={8}>
                      <Input
                        id="cabin_name"
                        name="cabin_name"
                        placeholder="cabin_name"
                        type="text"
                      />
                      </Col>
                    </FormGroup>
                      <FormGroup row>
                        <Label
                            for="Device Type"
                            sm={4}
                          >
                          <b style={{fontSize:"small"}}> Device Type</b>
                          </Label>
                          <Col sm={8}>
                              <Select options={cabinTypeList || []} value={selectedDeviceType} onChange={handleChangeDeviceType} placeholder="Device Type" />
                          </Col>
                      </FormGroup>
                      {selectedDeviceType?.value == "Wc" && (
                      <>
                        <FormGroup row>
                          <Label for="User Type" sm={4}>
                            <b style={{ fontSize: "small" }}>User Type</b>
                          </Label>
                          <Col sm={8}>
                              <Select options={userTypeList || []} value={selectedUserType} onChange={handleChangeUserType} placeholder="User Type" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="Usage Charge Type" sm={4}>
                            <b style={{ fontSize: "small" }}>Usage Charge Type</b>
                          </Label>
                          <Col sm={8}>
                            <Select options={userChargeType || []} value={selectedUserChargeType} onChange={handleChangeUserChargeType} placeholder="Usage Charge Type" />
                          </Col>
                        </FormGroup>
                      </>
                    )}
                    {selectedDeviceType?.value == "Urinal" && (  
                      <>
                        <FormGroup row>
                          <Label for="User Type" sm={4}>
                            <b style={{ fontSize: "small" }}>User Type</b>
                          </Label>
                          <Col sm={8}>
                              <Select options={userTypeList || []} value={selectedUserType} onChange={handleChangeUserType} placeholder="User Type" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="Usage Charge Type" sm={4}>
                            <b style={{ fontSize: "small" }}>Usage Charge Type</b>
                          </Label>
                          <Col sm={8}>
                            <Select options={userChargeType || []} value={selectedUserChargeType} onChange={handleChangeUserChargeType} placeholder="Usage Charge Type" />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="Urinal Count" sm={4}>
                            <b style={{ fontSize: "small" }}>Urinal Count </b>
                          </Label>
                          <Col sm={8}>
                            <Input
                              id="urinal_count"
                              name="urinal_count"
                              placeholder="Urinal Count"
                              type="text"
                              required
                            />
                          </Col>
                        </FormGroup>
                      </>
                    )}
                    {selectedDeviceType?.value == "BWT" && (
                      <>
                        <FormGroup row>
                          <Label for="BWT Capacity" sm={4}>
                            <b style={{ fontSize: "small" }}>BWT Capacity</b>
                          </Label>
                          <Col sm={8}>
                            <Input
                              id="bwt_capacity"
                              name="bwt_capacity"
                              placeholder="BWT Capacity"
                              type="text"
                              required
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="BWT Level" sm={4}>
                            <b style={{ fontSize: "small" }}>BWT Level</b>
                          </Label>
                          <Col sm={8}>
                            <Input
                              id="bwt_level"
                              name="bwt_level"
                              placeholder="BWT Level"
                              type="text"
                              required
                            />
                          </Col>
                        </FormGroup>
                      </>
                    )}
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
                        for="UUID"
                        sm={4}
                      >
                      <b style={{fontSize:"small"}}>UUID</b>
                      </Label>
                      <Col sm={8}>
                        <Input
                          id="UUID"
                          name="UUID"
                          placeholder="UUID"
                          type="text"
                          disabled={true}
                          value={ComplexIotDetails.UUID}
                        />                      
                      </Col>
                    </FormGroup>
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
                    </Form>
                </CardBody>
              </Card>
              <br/>
            
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

export default RegisterCabin;
