import React, { useState , useEffect} from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import './enrollDevice.css';
import Select from 'react-select'; // Importing react-select
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'; // Importing the styles for react-datepicker
import {
  executeUpdateComplexLambda,
  executelistIotDynamicLambda
} from "../../awsClients/androidEnterpriseLambda";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { selectUser } from "../../features/authenticationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { setResetData } from "../../features/androidManagementSlice";

export const ReadCabinDetails = ({ dialogCabinDetails , setDialogCabinDetails}) => { // Receive dialogCabinDetails as a prop
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

  
  // useEffect(() => {
  //   // Find the option corresponding to ComplexIotDetails.SLVL
  //   const selectedOption = smartnessLevels.find(option => option.value === ComplexIotDetails.SLVL);
  //   // If the option is found, set it as the smartnessLevel, otherwise set it to null
  //   setSelectedSmartness(selectedOption || null);
  // }, [ComplexIotDetails.SLVL]);


  // useEffect(() => {
  //   if(ListclientName && ListbillingGroups ) {
  //     const selectedClientOption = ListclientName.find(option => option.value === ComplexIotDetails.CLNT)
  //     const selectetBillingOption = ListbillingGroups.find(option => option.value === ComplexIotDetails.BILL)
  //     setSelectedClientName(selectedClientOption || null);
  //     setSelectedbillingGroups(selectetBillingOption || null);
  //   }
  // },[ListclientName,ListbillingGroups])

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

  // console.log('ComplexIotDetails',ComplexIotDetails);
  // console.log('ListclientName',ListclientName);
  // console.log('selected', selected);

  const toggle = () => {
    setModal(!modal)
    setDialogCabinDetails(false)
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



  console.log('dialogCabinDetails',dialogCabinDetails);
  console.log('formData',formData);
  return (
    <div>
      {(dialogCabinDetails) && ( // Conditionally render based on dialogCabinDetails prop
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
            <ModalHeader toggle={toggle}><b>Cabin Details</b></ModalHeader>
            <ModalBody>
            <Card>
                <CardBody>
                  <CardTitle><b>Selected Complex</b></CardTitle>
                  <br/>
                  <Form>
                  <FormGroup row>
                    <Label
                      for="State"
                      sm={2}
                    >
                      <b style={{fontSize:"small"}}>State</b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="state"
                        name="state"
                        placeholder="state"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.STATE_NAME}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="District"
                      sm={2}
                    >
                    <b style={{fontSize:"small"}}> District</b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="district"
                        name="district"
                        placeholder="district"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.DISTRICT_NAME}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label
                      for="City"
                      sm={2}
                    >
                    <b style={{fontSize:"small"}}> City </b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="city"
                        name="city"
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
                        value={""}
                      />
                    </Col>
                  </FormGroup>
                  </Form>
                </CardBody>
              </Card>
                    <br/>
              <Card>
                <CardBody>
                    <CardTitle><b>Cabin Attributes </b></CardTitle>
                    <br/>
                    <Form>
                    <FormGroup row>
                      <Label
                        for="cabin name"
                        sm={2}
                      >
                        <b style={{fontSize:"small"}}>Cabin Name</b>
                      </Label>

                      <Col sm={10}>
                        <Input
                          id="cabin_name"
                          name="cabin_name"
                          placeholder="Cabin name"
                          type="text"
                          disabled={true}
                          value={""}
                        />                      
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="Cabin Type"
                        sm={2}
                      >
                      <b style={{fontSize:"small"}}>  Cabin Type</b>
                      </Label>
                      <Col sm={10}>
                        <Input
                            id="cabin_type"
                            name="cabin_type"
                            placeholder="Cabin type"
                            type="text"
                            disabled={true}
                            value={""}
                          />                         
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="BWT Capacity"
                        sm={2}
                      >
                      <b style={{fontSize:"small"}}> BWT Capacity</b>
                      </Label>
                      <Col sm={10}>
                        <Input
                            id="bwt_capacity"
                            name="cabin_type"
                            placeholder="BWT Capacity"
                            type="text"
                            disabled={true}
                            value={""}
                          />                         
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="BWT Level"
                        sm={2}
                      >
                      <b style={{fontSize:"small"}}> BWT Level</b>
                      </Label>
                      <Col sm={10}>
                        <Input
                            id="bwt_level"
                            name="cabin_type"
                            placeholder="BWT Level"
                            type="text"
                            disabled={true}
                            value={""}
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
                        for="UUID"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}>UUID</b>
                      </Label>
                      <Col sm={9}>
                        <Input
                          id="UUID"
                          name="UUID"
                          placeholder="UUID"
                          type="text"
                          disabled={true}
                          value={formData.DEVT}
                        />                      
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Label
                        for="commissioning status"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Commissioning Status</b>
                      </Label>
                      <Col sm={9}>
                      <Input
                        id="COCO"
                        name="COCO"
                        placeholder="COCO"
                        type="text"
                        disabled={true}
                        value={formData.COCO}
                      />
                      </Col>
                    </FormGroup>
                    
                    <FormGroup row>
                    <Label
                        for="Smartness Level"
                        sm={3}
                      >
                      <b style={{fontSize:"small"}}> Smartness Level</b>
                      </Label>
                      <Col sm={9}>
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
                                value={formData.QMWC}
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
                                value={formData.QFWC}
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
                                value={formData.
                                  QPWC}
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
                                value={formData.QURI}
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
                                value={formData.QURC}
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
                                value={formData.QBWT}
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
                            id="ADDR"
                            name="ADDR"
                            type="textarea"
                            value={formData.ADDR}
                            onChange={handleChange}
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
                            <Label for="lattitude">
                              Latitude
                            </Label>
                            <Input
                              id="LATT"
                              name="LATT"
                              placeholder="latitude"
                              type="text"
                              value={formData.LATT}
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
                              value={formData.LONG}
                              onChange={handleChange}
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
                      <Select options={ListclientName || []} value={selectedClientName} onChange={handleChangeClientName} placeholder="Client Name" />
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
                      <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} placeholder="Billing Group Name" />
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
                          id="ROUTER_IMEI"
                          name="ROUTER_IMEI"
                          placeholder="Router IMEI placeholder"
                          type="text"
                          value={formData.ROUTER_IMEI}
                          onChange={handleChange}
                        />
                      </Col>
                    </FormGroup>
                    
                    </Form>
                </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
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

export default ReadCabinDetails;
