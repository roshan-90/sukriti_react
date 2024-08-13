import React, { useState , useEffect} from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import './enrollDevice.css';
import Select from 'react-select'; // Importing react-select
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Importing the styles for react-datepicker
import {
  executeCreateCabinLambda,
  executelistIotDynamicLambda,
  executelistIotSingleLambda,
  executelistDDbCityLambda,
  executeAddDdbStateLambda,
  executeAddBillingroupLambda,
  executelistListUserTypeLambda,
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
  const [selectedBwtLevel, setSelectedBwtLevel] = useState(null);
  
  const userChargeType = [
    { label: 'None', value: 'None' },
    { label: 'COIN', value: 'COIN' },
    { label: 'COIN_RF', value: 'COIN_RF' },
    { label: 'RF', value: 'RF' }
  ];

  const bwtLevel = [
    { label: 'BWT_G0', value: 'BWT_G0' },
    { label: 'BWT_G1', value: 'BWT_G1' },
    { label: 'BWT_G2', value: 'BWT_G2' },
    { label: 'BWT_G3', value: 'BWT_G3' }
  ];

  const [formData, setFormData] = useState({
    COMPLEX : "",
    ADDRESS : "",
    LATITUDE : "",
    LONGITUDE : "",
    DATE : "",
    CLIENT : "",
    SMART_LEVEL : "",
    STATE : "",
    DISTRICT : "",
    CITY : "",
    STATE_CODE : "",
    DISTRICT_CODE : "",
    CITY_CODE : "",
    SHORT_THING_NAME : "",
    BILLING_GROUP : "",
    USER_TYPE : "",
    USAGE_CHARGE : "", 
    CABIN_NUM : "",
    ThingType: "",
    ThingGroup : "", 
    BWT_KLD: "",
    BWT_LVL: "",
    CAMERA_SERIAL_NUM: ""
  });

  console.log('ComplexIotDetails',ComplexIotDetails);


  useEffect(() => {
    if(complexName) {
      ListOfIotCabinType(complexName)
      setFormData((prevFormData )=> ({
        ...prevFormData,
        STATE: ComplexIotDetails.STATE_NAME,
        DISTRICT: ComplexIotDetails.DISTRICT_NAME,
        CITY: ComplexIotDetails.CITY_NAME,
        STATE_CODE: ComplexIotDetails.STATE_CODE,
        DISTRICT_CODE: ComplexIotDetails.DISTRICT_CODE,
        CITY_CODE: ComplexIotDetails.CITY_CODE,
        ADDRESS: ComplexIotDetails.ADDR,
        LATITUDE: ComplexIotDetails.LATT,
        LONGITUDE: ComplexIotDetails.LONG,
        CLIENT: ComplexIotDetails.CLNT,
        BILLING_GROUP: ComplexIotDetails.BILL,
        DATE: ComplexIotDetails.DATE,
        COMPLEX: complexName,
        SMART_LEVEL: ComplexIotDetails.SLVL,
        ThingGroup: complexName
      }));
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

  const ListOfIotUserType = async (value, cabinType) => {
    try {
      console.log('CabinTypeList', cabinType)
      dispatch(startLoading());
      let command = "list-iot-UserType";
      var result = await executelistListUserTypeLambda('test_rk_mandi', user?.credentials, value, command, cabinType);
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
    setModal(!modal)
    setModalToggle(false)
  };

  const handleChangeSmartnessLevel = (selectedOption) => {
    console.log('handleChangeSmartnessLevel',selectedOption);
    setFormData({ ...formData, SLVL: selectedOption.value });
    setSelectedSmartness(selectedOption)
  }

  const handleChangeDeviceType = (selectedOption) => {
    console.log('handleChangeDeviceType',selectedOption);
    setSelectedDeviceType(selectedOption)
    setFormData({ ...formData, ThingType: selectedOption.value });
    ListOfIotUserType(complexName,selectedOption.value)

  }
  
  const handleChangeUserType = (selectedOption) => {
    console.log('handleChangeUserType',selectedOption);
    setSelectedUserType(selectedOption)
    setFormData({ ...formData, USER_TYPE: selectedOption.value });
  }

  const handleChangeUserChargeType = async (selectedOption) => {
    console.log('handleChangeUserChargeType',selectedOption);
    setSelectedUserChargeType(selectedOption);
    if(selectedUserType.value == null) {
      setDialogData({
        title: "Error",
        message: "please Select User ChargeType",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log('handleChangeUserChargeType');
        },
      });
      return
    }

    let cabin_count = await formatted3DigitNumber(complexIotList.length)
    let uuid_value = await setUUID(complexIotList.length);
    let splitsting = uuid_value.split("_");
    
    setFormData( prevFormData => ({
      ...prevFormData,
      CABIN_NUM: cabin_count,
      Name: uuid_value,
      SHORT_THING_NAME: splitsting[3] + "_" + splitsting[4],
      USAGE_CHARGE: selectedOption.value
    }));

    console.log('check uuid',uuid_value);
    // setFormData({ ...formData, USAGE_CHARGE: selectedOption.value });
  }

  const handleChangeBwtLevel = (selectedOption) => {
    setSelectedBwtLevel(selectedOption);
    setFormData({ ...formData, BWT_LVL: selectedOption.value });
  }

  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    console.log('formattedDate',formattedDate);
    setFormData({ ...formData, DATE: formattedDate });
  };

  // Update form state when form values change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    console.log('cheking :->', { name, value });
    if(name == "BWT_LVL") {
      setFormData({ ...formData, [name]: value });
      if(formData.BWT_KLD == "" ||formData.BWT_LVL == "" ) {
        setDialogData({
          title: "Validation Error",
          message: `Error Please fill all input fields`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log('setWarnings complex');
          },
        });
        return true;
      }
      let cabin_count = await formatted3DigitNumber(complexIotList.length)
      let uuid_value = await setUUID(complexIotList.length);
      let splitsting = uuid_value.split("_");
      
      setFormData( prevFormData => ({
        ...prevFormData,
        CABIN_NUM: cabin_count,
        Name: uuid_value,
        SHORT_THING_NAME: splitsting[3] + "_" + splitsting[4],
        USAGE_CHARGE: selectedOption?.value
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }

  };


  const formatDate = (date) => {
    // Format the date to 'dd/MM/yyyy' format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const createCabin = async (value, object) => {
    try {
      let command = "create-iot-thing";
      var result = await executeCreateCabinLambda(user.username, user?.credentials, command, value, object);
      console.log('result createCabin', result.body);
      toggle();
    } catch (error) {
      handleError(error, 'Error createCabin')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const submitForm = (e) => {
    dispatch(startLoading());
      console.log('formData check data', formData);
      let object = {
        name :  formData.Name,
        DefaultClientId :  formData.Name,
        ThingType :  formData.ThingType,
        ThingGroup :  formData.ThingGroup
      }
  
      // Deleting the keys
      delete formData.Name;
      delete formData.ThingType;
      delete formData.ThingGroup;
  
        const outputArray = [];
        for (const key in formData) {
            if (formData.hasOwnProperty(key)) {
                const value = formData[key];
                outputArray.push({ "Name": key, "Value": value });
            }
        }
      console.log('formData',outputArray)
      console.log('object',object)
      createCabin(outputArray,object);
  }


  const setWarnings = async () => {
    if((formData.ThingType == "WC" || formData.ThingType == "URINAL")) {
      if((formData.USAGE_CHARGE == "" || formData.USER_TYPE == "")) {
        setDialogData({
          title: "Validation Error",
          message: `Error Please fill all input fields`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log('setWarnings complex');
          },
        });
        return true;
      } 
    } else if(formData.ThingType == "BWT") {
      if((formData.BWT_KLD == "" || formData.BWT_LVL == "")) {
        setDialogData({
          title: "Validation Error",
          message: `Error Please fill all input fields`,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log('setWarnings complex');
          },
        });
        return true;
      } 
    } else if(formData.CAMERA_SERIAL_NUM == "" || formData.ThingType == "") {
      setDialogData({
        title: "Validation Error",
        message: `Error Please fill all input fields`,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log('setWarnings complex');
        },
      });
      return true;
    }

    if((formData.ThingType == "WC" || formData.ThingType == "URINAL")) {
      delete formData.BWT_KLD;
      delete formData.BWT_LVL;
    } else if(formData.ThingType == "BWT") {
      delete formData.USAGE_CHARGE;
      delete formData.USER_TYPE;
    }
    console.log('form setwarning for submit form',formData);
    setDialogData({
      title: "Confirms",
      message: `Are you sure you want to create new Cabin`,
      onClickAction: () => {
        // Handle the action when the user clicks OK
        console.log('submitForm Cabin');
          submitForm();
       
      },
    });
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
    if(selectedDeviceType?.value == "URINAL") {
      if(selectedUserType?.value == "Male") {
        UUID += "_" + "MUR";
      } else if(selectedUserType?.value == "Female") {
        UUID += "_" + "FUR";
      } else if(selectedUserType?.value == "PD") {
        UUID += "_" + "PWC";
      } 
    } else if (selectedDeviceType?.value == "WC") {
      if(selectedUserType?.value == "Male") {
        UUID += "_" + "MWC";
      } else if(selectedUserType?.value == "Female") {
        UUID += "_" + "FWC";
      } else if(selectedUserType?.value == "PD") {
        UUID += "_" + "PWC";
      } 
    } else if(selectedDeviceType?.value == "BWT") {
      UUID += "_" + "BWT";
    }
    UUID += "_" + strCount;

    return UUID;
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
                        id="Name"
                        name="Name"
                        placeholder="Name"
                        type="text"
                        disabled={true}
                        onChange={handleChange}
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
                      {selectedDeviceType?.value == "WC" && (
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
                    {selectedDeviceType?.value == "URINAL" && (  
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
                          <Label for="URINAL Count" sm={4}>
                            <b style={{ fontSize: "small" }}>URINAL Count </b>
                          </Label>
                          <Col sm={8}>
                            <Input
                              id="urinal_count"
                              name="urinal_count"
                              placeholder="URINAL Count"
                              type="text"
                              required
                              onChange={handleChange}
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
                              id="BWT_KLD"
                              name="BWT_KLD"
                              placeholder="BWT Capacity"
                              type="text"
                              required
                              onChange={handleChange}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="BWT Level" sm={4}>
                            <b style={{ fontSize: "small" }}>BWT Level</b>
                          </Label>
                          <Col sm={8}>
                            {/* <Input
                              id="BWT_LVL"
                              name="BWT_LVL"
                              placeholder="BWT Level"
                              type="text"
                              required
                              onChange={handleChange}
                            /> */}
                            <Select options={bwtLevel || []} value={selectedBwtLevel} onChange={handleChangeBwtLevel} placeholder="BWT Level" />
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
                          <Input
                            id="SLVL"
                            name="SLVL"
                            placeholder="SLVL"
                            type="text"
                            value={ComplexIotDetails.SLVL}
                            disabled={true}
                            />                      
                        </Col>
                    </FormGroup>
                    <FormGroup row>                    
                        <Label
                            for="WC Count"
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
                                value={ComplexIotDetails.QMWC}
                                disabled={true}
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
                                value={ComplexIotDetails.QFWC}
                                disabled={true}
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
                                value={ComplexIotDetails.
                                  QPWC}
                                  disabled={true}
                                  />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="URINAL Count"
                            sm={3}
                          >
                          <b style={{fontSize:"small"}}> URINAL Count </b>
                          </Label>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of URINALs">
                                Number of URINALs
                              </Label>
                              <Input
                                id="QURI"
                                name="QURI"
                                placeholder="latitude"
                                type="text"
                                value={ComplexIotDetails.QURI}
                                disabled={true}
                                />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of URINAL Cabins">
                                URINAL Cabins
                              </Label>
                              <Input
                                id="QURC"
                                name="QURC"
                                placeholder="Number of URINAL Cabins"
                                type="text"
                                value={ComplexIotDetails.QURC}
                                disabled={true}
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
                                value={ComplexIotDetails.QBWT}
                                disabled={true}
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
                    <CardTitle><b>Client Details</b></CardTitle>
                    <br/>
                    <Form>
                      <FormGroup row>
                        <Label
                          for="Address"
                          sm={2}
                        >
                        <b style={{fontSize:"small"}}> Address </b> 
                        </Label>
                        <Col sm={10}>
                          <Input
                            id="ADDRESS"
                            name="ADDRESS"
                            type="textarea"
                            disabled={true}
                            value={ComplexIotDetails.ADDR}
                          />
                        </Col>
                    </FormGroup>
                      <Row>
                      <Label
                          for="GeoLocation"
                          sm={2}
                        >
                        <b style={{fontSize:"small"}}> Geo Location </b>
                        </Label>
                        <Col md={5}>
                          <FormGroup>
                            <Label for="LATITUDE">
                            LATITUDE
                            </Label>
                            <Input
                              id="LATITUDE"
                              name="LATITUDE"
                              placeholder="LATITUDE"
                              type="text"
                              value={ComplexIotDetails.LATT}
                              disabled={true}
                              />
                          </FormGroup>
                        </Col>
                        <Col md={5}>
                          <FormGroup>
                            <Label for="LONGITUDE">
                            LONGITUDE
                            </Label>
                            <Input
                              id="LONGITUDE"
                              name="LONGITUDE"
                              placeholder="LONGITUDE placeholder"
                              type="text"
                              value={ComplexIotDetails.LONG}
                              disabled={true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    <FormGroup row>
                      <Label
                        for="client name"
                        sm={2}
                      >
                        <b style={{fontSize:"small"}}>Client Name</b>
                      </Label>

                      <Col sm={10}>
                        <Input
                              id="CLIENT"
                              name="CLIENT"
                              placeholder="CLIENT placeholder"
                              type="text"
                              value={ComplexIotDetails.CLNT}
                              disabled={true}
                            /> 
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Billing Group"
                        sm={2}
                      >
                      <b style={{fontSize:"small"}}>  Billing Group</b>
                      </Label>
                      <Col sm={10}>
                        <Input
                              id="BILLING_GROUP"
                              name="BILLING_GROUP"
                              placeholder="BILLING_GROUP placeholder"
                              type="text"
                              value={ComplexIotDetails.BILL}
                              disabled={true}
                            />                      
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Date"
                        sm={2}
                      >
                      <b style={{fontSize:"small"}}> Date </b>
                      </Label>
                      <Col sm={10} >
                      <DatePicker
                        id="selectDate"
                        value={ComplexIotDetails.DATE}
                        disabled={true}
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
                    <CardTitle><b>Camera Details</b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="Camera Serial Num"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Camera Serial Num</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="CAMERA_SERIAL_NUM"
                          name="CAMERA_SERIAL_NUM"
                          placeholder="Camera serial number"
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

export default RegisterCabin;
