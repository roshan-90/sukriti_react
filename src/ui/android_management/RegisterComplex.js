import React, { useState , useEffect} from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import './enrollDevice.css';
import Select from 'react-select'; // Importing react-select
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Importing the styles for react-datepicker
import {
  executeUpdateComplexLambda,
  executelistIotDynamicLambda,
  executelistIotSingleLambda,
  executelistDDbCityLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { selectUser } from "../../features/authenticationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { setResetData } from "../../features/androidManagementSlice";
import { setStateIotList, setDistrictIotList, setCityIotList, setComplexIotList, setComplexIotDetail,setClientName, setBillingGroup , setComplexName} from "../../features/androidManagementSlice";
import ModalSelect from '../../dialogs/ModalSelect';

export const RegisterComplex = ({ openModal , selected, setModalToggle}) => { // Receive complexChanged as a prop
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
    COCO : "",
    CWTM : "",
    DATE : "",
    DEVT : "",
    DISTRICT_CODE : "",
    DISTRICT_NAME : "",
    LATT : "",
    LONG : "",
    MANU : "", 
    MODIFIED_BY : "",
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
    THINGGROUPTYPE : "", 
    UUID : ""
  });

  useEffect(() => {
    if(ComplexIotDetails){
      setFormData({
        ADDR : ComplexIotDetails.ADDR,
        ARSR : ComplexIotDetails.ARSR,
        AR_K : ComplexIotDetails.AR_K,
        BILL : ComplexIotDetails.BILL,
        CITY_CODE : ComplexIotDetails.CITY_CODE,
        CITY_NAME : ComplexIotDetails.CITY_NAME,
        CIVL : ComplexIotDetails.CIVL,
        CLNT : ComplexIotDetails.CLNT,
        COCO : ComplexIotDetails.COCO,
        CWTM : ComplexIotDetails.CWTM,
        DATE : ComplexIotDetails.DATE,
        DEVT : ComplexIotDetails.DEVT,
        DISTRICT_CODE : ComplexIotDetails.DISTRICT_CODE,
        DISTRICT_NAME : ComplexIotDetails.DISTRICT_NAME,
        LATT : ComplexIotDetails.LATT,
        LONG : ComplexIotDetails.LONG,
        MANU : ComplexIotDetails.MANU, 
        MODIFIED_BY : ComplexIotDetails.MODIFIED_BY,
        MSNI : ComplexIotDetails.MSNI,
        MSNV : ComplexIotDetails.MSNV,
        ONMP : ComplexIotDetails.ONMP,
        QBWT : ComplexIotDetails.QBWT,
        QFWC : ComplexIotDetails.QFWC,
        QMWC : ComplexIotDetails.QMWC,
        QPWC : ComplexIotDetails.QPWC,
        QSNI : ComplexIotDetails.QSNI,
        QSNV : ComplexIotDetails.QSNV,
        QURC : ComplexIotDetails.QURC,
        QURI : ComplexIotDetails.QURI,
        ROUTER_IMEI : ComplexIotDetails.ROUTER_IMEI,
        ROUTER_MOBILE : ComplexIotDetails.ROUTER_MOBILE,
        SLVL : ComplexIotDetails.SLVL,
        STATE_CODE : ComplexIotDetails.STATE_CODE,
        STATE_NAME : ComplexIotDetails.STATE_NAME,
        TECH : ComplexIotDetails.TECH,
        THINGGROUPTYPE : ComplexIotDetails.THINGGROUPTYPE, 
        UUID : ComplexIotDetails.UUID
      })
    }

    // Check if ComplexIotDetails is available and DATE is in the correct format
    if (ComplexIotDetails && ComplexIotDetails.DATE) {
      const initialDateString = ComplexIotDetails.DATE;
      const dateParts = initialDateString.split("/");
      if (dateParts.length === 3) {
        // Parse the initial date string into a Date object
        const initialDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        setSelectedDate(initialDate);
      }
    } else {
      // If ComplexIotDetails or DATE is not available, set the initial date to the current date
      setSelectedDate(new Date());
    }
  }, [ComplexIotDetails]);

  
  useEffect(() => {
    // Find the option corresponding to ComplexIotDetails.SLVL
    const selectedOption = smartnessLevels.find(option => option.value === ComplexIotDetails.SLVL);
    // If the option is found, set it as the smartnessLevel, otherwise set it to null
    setSelectedSmartness(selectedOption || null);
  }, [ComplexIotDetails.SLVL]);


  useEffect(() => {
    if(ListclientName && ListbillingGroups ) {
      const selectedClientOption = ListclientName.find(option => option.value === ComplexIotDetails.CLNT)
      const selectetBillingOption = ListbillingGroups.find(option => option.value === ComplexIotDetails.BILL)
      setSelectedClientName(selectedClientOption || null);
      setSelectedbillingGroups(selectetBillingOption || null);
    }
  },[ListclientName,ListbillingGroups])

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


  const handleChangeIotState = (selectedOption) => {
    console.log('check', selectedOption.value);
    dispatch(setDistrictIotList([]));
    dispatch(setCityIotList([]));
    dispatch(setComplexIotList([]));
    setSelectedOptionIotDistrict(null)
    setSelectedOptionIotCity(null);
    setSelectedOption(selectedOption); // Update state if selectedOption is not null
    ListOfIotDistrict(selectedOption.value)
  };

  const handleChangeIotDistrict = (selectedOption) => {
    dispatch(setCityIotList([]));
    setSelectedOptionIotCity(null)
    console.log('handleChangeIotDistrict',selectedOption);
    setSelectedOptionIotDistrict(selectedOption);
    ListOfIotCity(selectedOption.value)
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

  const handleChangeIotCity = (selectedOption) => {
    dispatch(setComplexIotList([]));
    console.log('handleChangeIotCity',selectedOption);
    setSelectedOptionIotCity(selectedOption);
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

  const updateComplex = async (value) => {
    try {
      if(!complexName) {
        setDialogData({
          title: "Error",
          message: "complex is not Selected",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log('complex is not select');
          },
        });
        return
      }
      dispatch(startLoading());
      let command = "update-iot-complex";
      var result = await executeUpdateComplexLambda('test_rk_mandi', user?.credentials, command, value, complexName);
      console.log('result ClientName', result.body);
      
    } catch (error) {
      handleError(error, 'Error ListOfIotClientName')
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }

  const submitForm = (e) => {
      const outputArray = [];
      for (const key in formData) {
          if (formData.hasOwnProperty(key)) {
              const value = formData[key];
              outputArray.push({ "Name": key, "Value": value });
          }
      }
    console.log('formData',outputArray)
    updateComplex(outputArray);
  }

  const deleteComplex = async() => {
    try{
      console.log('deleted complex');
      let command = "delete-iot-complex";
      var result = await executelistIotDynamicLambda('dev_000000', user?.credentials, complexName, command );
      console.log('result deleteComplex', result.body);
      setDialogData({
        title: "Deleted",
        message: result.body,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          toggle();        },
      });
      } catch (error) {
        handleError(error, 'Error deleteComplex')
      } finally {
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }
  }

  const setWarnings = () => {
    setDialogData({
      title: "Confirms",
      message: `Are you Sure Delete ${complexName} Complex`,
      onClickAction: () => {
        // Handle the action when the user clicks OK
        console.log('delete complex');
        deleteComplex();
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
        onClickAction: (data) => {
          // Handle the action when the user clicks OK
          console.log('handleState triggers',data);
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
        onClickAction: (data) => {
          // Handle the action when the user clicks OK
          console.log('handleState triggers',data);
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
      var result = await executelistIotSingleLambda('test_rk_mandi',user?.credentials, command);
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
        },
      });
    } catch (error) {
      handleError(error, 'Error handleState')
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
            <ModalHeader toggle={toggle}><b>Register Complex</b></ModalHeader>
            <ModalBody>
            <Card>
                <CardBody>
                  <CardTitle><b>Location Details</b></CardTitle>
                  <br/>
                  <Form>
                  <FormGroup row>
                    <Label
                      for="State"
                      sm={2}
                    >
                      <b>State</b>
                    </Label>
                    <Col sm={7}>
                    <Select options={stateIotList || []} value={selectedOption} onChange={handleChangeIotState}         
                      onMenuOpen={() => {
                        if (!stateIotList || stateIotList.length === 0) {
                          ListOfIotState();
                        }
                      }} placeholder="Select State" />
                    </Col>
                    <Col sm={3}>
                      <Button color="success" onClick={handleState}>
                        New State
                      </Button>{' '}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="District"
                      sm={2}
                    >
                    <b>  District</b>
                    </Label>
                    <Col sm={7}>
                      <Select options={districtIotList || []} value={selectedOptionIotDistrict} onChange={handleChangeIotDistrict} placeholder="Select District" />
                    </Col>
                    <Col sm={3}>
                      <Button color="success" onClick={handleNewDistrict}>
                        New District
                      </Button>{' '}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="City"
                      sm={2}
                    >
                    <b> City </b>
                    </Label>
                    <Col sm={7}>
                      <Select options={cityIotList || []} value={selectedOptionIotCity} onChange={handleChangeIotCity} placeholder="Select District" />
                    </Col>
                    <Col sm={3}>
                      <Button color="success" onClick={handleNewCity}>
                        New City
                      </Button>{' '}
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="Complex"
                      sm={2}
                    >
                    <b> Complex </b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="complex"
                        name="complex"
                        placeholder="complex"
                        type="text"
                        value={""}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                      <Label
                        for="Address"
                        sm={2}
                      >
                      <b> Address </b> 
                      </Label>
                      <Col sm={10}>
                        <Input
                          id="ADDR"
                          name="ADDR"
                          type="textarea"
                          value={""}
                          onChange={handleChange}
                        />
                      </Col>
                  </FormGroup>
                    <Row>
                    <Label
                        for="GeoLocation"
                        sm={2}
                      >
                      <b> Geo Location </b>
                      </Label>
                      <Col md={5}>
                        <FormGroup>
                          <Label for="lattitude">
                            Latitude
                          </Label>
                          <Input
                            id="LATT"
                            name="LATT"
                            placeholder="latitude"
                            type="text"
                            value={""}
                            onChange={handleChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={5}>
                        <FormGroup>
                          <Label for="longitude">
                            Longitude
                          </Label>
                          <Input
                            id="LONG"
                            name="LONG"
                            placeholder="longitude placeholder"
                            type="text"
                            value={""}
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
                        sm={2}
                      >
                        <b>Client Name</b>
                      </Label>

                      <Col sm={10}>
                      <Select options={ListclientName || []} value={selectedClientName} onChange={handleChangeClientName} placeholder="Client Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Billing Group"
                        sm={2}
                      >
                      <b>  Billing Group</b>
                      </Label>
                      <Col sm={10}>
                      <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} placeholder="Billing Group Name" />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Select Date"
                        sm={2}
                      >
                      <b> Select Date </b>
                      </Label>
                      <Col sm={10} >
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
                        sm={2}
                      >
                        <b>Commissioning Status</b>
                      </Label>
                      <Col sm={10}>
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
                        sm={2}
                      >
                      <b>  Device Type</b>
                      </Label>
                      <Col sm={10}>
                        <Input
                          id="DEVT"
                          name="DEVT"
                          placeholder="DEVT"
                          type="text"
                          disabled={true}
                          value={""}
                        />                      
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                    <Label
                        for="Smartness Level"
                        sm={2}
                      >
                      <b>  Smartness Level</b>
                      </Label>
                      <Col sm={10}>
                          <Select options={smartnessLevels || []} value={selectedSmartness} onChange={handleChangeSmartnessLevel} placeholder="Smartness Level" />
                      </Col>
                    </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Wc Count"
                            sm={2}
                          >
                          <b> WC Count </b>
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
                                value={""}
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
                                value={""}
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
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Urinal Count"
                            sm={2}
                          >
                          <b> Urinal Count </b>
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
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number of Urinal Cabins">
                                Number of Urinal Cabins
                              </Label>
                              <Input
                                id="QURC"
                                name="QURC"
                                placeholder="Number of Urinal Cabins"
                                type="text"
                                value={""}
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
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Napkin Vending Machine"
                            sm={2}
                          >
                          <b> Napkin Vending Machine </b>
                          </Label>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number Napkin Vending Machine">
                                Number of Napkin Vending Machine
                              </Label>
                              <Input
                                id="QSNV"
                                name="QSNV"
                                placeholder="Number Napkin Vending Machine"
                                type="text"
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Manufacturer of Napkin VM">
                                Manufacturer of Napkin VM
                              </Label>
                              <Input
                                id="MSNV"
                                name="MSNV"
                                placeholder="Manufacturer of Napkin VM"
                                type="text"
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Napkin incinerator"
                            sm={2}
                          >
                          <b> Napkin incinerator</b>
                          </Label>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Number Napkin incinerator">
                                Number Napkin incinerator
                              </Label>
                              <Input
                                id="QSNI"
                                name="QSNI"
                                placeholder="Number Napkin incinerator"
                                type="text"
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                          <Col md={3}>
                            <FormGroup>
                              <Label for="Manufacturer of Napkin incinerator">
                                Manufacturer of Napkin incinerator
                              </Label>
                              <Input
                                id="MSNI"
                                name="MSNI"
                                placeholder="Manufacturer of Napkin incinerator"
                                type="text"
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Area of KIOSK"
                            sm={2}
                          >
                          <b> Area of KIOSK</b>
                          </Label>
                          <Col md={3}>
                            <FormGroup>
                              <Input
                                id="AR_K"
                                name="AR_K"
                                placeholder="Area of KIOSK"
                                type="text"
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Water Atm Capacity"
                            sm={2}
                          >
                          <b> Water Atm Capacity</b>
                          </Label>
                          <Col md={5}>
                            <FormGroup>
                              <Label for="LPH">
                                LPH
                              </Label>
                              <Input
                                id="CWTM"
                                name="CWTM"
                                placeholder="LPH"
                                type="text"
                                value={""}
                                onChange={handleChange}
                              />
                            </FormGroup>
                          </Col>
                      </FormGroup>
                      <FormGroup row>                    
                        <Label
                            for="Supervisior Room Size"
                            sm={2}
                          >
                          <b> Supervisior Room Size</b>
                          </Label>
                          <Col md={5}>
                            <FormGroup>
                              <Input
                                id="ARSR"
                                name="ARSR"
                                placeholder="ARSR"
                                type="text"
                                value={""}
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
                        sm={2}
                      >
                        <b>Manufacturer</b>
                      </Label>

                      <Col sm={10}>
                        <Input
                          id="MANU"
                          name="MANU"
                          placeholder="manufacturer placeholder"
                          type="text"
                          value={""}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Tech Provider"
                        sm={2}
                      >
                        <b>Tech Provider</b>
                      </Label>

                      <Col sm={10}>
                        <Input
                          id="TECH"
                          name="TECH"
                          placeholder="Tech Provider placeholder"
                          type="text"
                          value={""}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Civil Partner"
                        sm={2}
                      >
                        <b>Civil Partner</b>
                      </Label>

                      <Col sm={10}>
                        <Input
                          id="CIVL"
                          name="CIVL"
                          placeholder="CivilPartner placeholder"
                          type="text"
                          value={""}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="O&M Partner"
                        sm={2}
                      >
                        <b>O&M Partner</b>
                      </Label>

                      <Col sm={10}>
                        <Input
                          id="ONMP"
                          name="ONMP"
                          placeholder="O&M Partner placeholder"
                          type="text"
                          value={""}
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
                        <b>Router IMEI</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="ROUTER_IMEI"
                          name="ROUTER_IMEI"
                          placeholder="Router IMEI placeholder"
                          type="text"
                          value={""}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Router Mobile"
                        sm={3}
                      >
                        <b>Router Mobile</b>
                      </Label>

                      <Col sm={9}>
                        <Input
                          id="ROUTER_MOBILE"
                          name="ROUTER_MOBILE"
                          placeholder="Router Mobile placeholder"
                          type="text"
                          value={""}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    </Form>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="success" onClick={submitForm}>
                Update
              </Button>{' '}
              <Button color="danger" onClick={setWarnings}>
                Delete
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
