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
  const cabinDetails = useSelector((state) => state.androidManagement.cabinDetails);
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
  const complexIotDetail = useSelector((state) => state.androidManagement.complexIotDetail);

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

  console.log('cabinDetails',cabinDetails);
  
  useEffect(() => {
    // Check if cabinDetails is available and DATE is in the correct format
    if (cabinDetails && cabinDetails.DATE) {
      const initialDateString = cabinDetails.DATE;
      const dateParts = initialDateString.split("/");
      if (dateParts.length === 3) {
        // Parse the initial date string into a Date object
        const initialDate = new Date(`${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`);
        setSelectedDate(initialDate);
      }
    } else {
      // If cabinDetails or DATE is not available, set the initial date to the current date
      setSelectedDate(new Date());
    }
  }, [cabinDetails]);

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

  const toggle = () => {
    setModal(!modal)
    setDialogCabinDetails(false)
  };

  // const handleChangeClientName = (selectedOption) => {
  //   console.log('handleChangeClientName',selectedOption)
  //   setFormData({ ...formData, CLNT: selectedOption.value });
  //   setSelectedClientName(selectedOption)

  // }

  // const handleChangeBillingGroup = (selectedOption) => {
  //   console.log('handleChangeBillingGroup',selectedOption)
  //   setFormData({ ...formData, BILL: selectedOption.value });
  //   setSelectedbillingGroups(selectedOption)
  // }

  // const handleChangeSmartnessLevel = (selectedOption) => {
  //   console.log('handleChangeSmartnessLevel',selectedOption);
  //   setFormData({ ...formData, SLVL: selectedOption.value });
  //   setSelectedSmartness(selectedOption)
  // }

  // const handleDateChange = (date) => {
  //   setSelectedDate(date);
  //   const formattedDate = formatDate(date);
  //   console.log('formattedDate',formattedDate);
  //   setFormData({ ...formData, DATE: formattedDate });
  // };

  // Update form state when form values change
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   console.log('cheking :->', { name, value });
  //   setFormData({ ...formData, [name]: value });
  // };


  // const formatDate = (date) => {
  //   // Format the date to 'dd/MM/yyyy' format
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  // const updateComplex = async (value) => {
  //   try {
  //     if(!complexName) {
  //       setDialogData({
  //         title: "Error",
  //         message: "complex is not Selected",
  //         onClickAction: () => {
  //           // Handle the action when the user clicks OK
  //           console.log('complex is not select');
  //         },
  //       });
  //       return
  //     }
  //     dispatch(startLoading());
  //     let command = "update-iot-complex";
  //     var result = await executeUpdateComplexLambda('test_rk_mandi', user?.credentials, command, value, complexName);
  //     console.log('result ClientName', result.body);
      
  //   } catch (error) {
  //     handleError(error, 'Error ListOfIotClientName')
  //   } finally {
  //     dispatch(stopLoading()); // Dispatch the stopLoading action
  //   }
  // }

  // const submitForm = (e) => {
  //     const outputArray = [];
  //     for (const key in formData) {
  //         if (formData.hasOwnProperty(key)) {
  //             const value = formData[key];
  //             outputArray.push({ "Name": key, "Value": value });
  //         }
  //     }
  //   console.log('formData',outputArray)
  //   updateComplex(outputArray);
  // }

  // const deleteComplex = async() => {
  //   try{
  //     console.log('deleted complex');
  //     let command = "delete-iot-complex";
  //     var result = await executelistIotDynamicLambda('dev_000000', user?.credentials, complexName, command );
  //     console.log('result deleteComplex', result.body);
  //     setDialogData({
  //       title: "Deleted",
  //       message: result.body,
  //       onClickAction: () => {
  //         // Handle the action when the user clicks OK
  //         toggle();        },
  //     });
  //     } catch (error) {
  //       handleError(error, 'Error deleteComplex')
  //     } finally {
  //       dispatch(stopLoading()); // Dispatch the stopLoading action
  //     }
  // }

  // const setWarnings = () => {
  //   setDialogData({
  //     title: "Confirms",
  //     message: `Are you Sure Delete ${complexName} Complex`,
  //     onClickAction: () => {
  //       // Handle the action when the user clicks OK
  //       console.log('delete complex');
  //       deleteComplex();
  //     },
  //   });
  // }

  console.log('dialogCabinDetails',dialogCabinDetails);
  // console.log('formData',formData);
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
                        value={cabinDetails.attributes.STATE}
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
                        value={cabinDetails.attributes.DISTRICT}
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
                        value={cabinDetails.attributes.CITY}
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
                        value={cabinDetails.attributes.COMPLEX}
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
                          value={cabinDetails.thingName}
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
                            value={cabinDetails.thingTypeName}
                          />                         
                      </Col>
                    </FormGroup>
                    {cabinDetails.thingTypeName === "WC" && (
                      <>
                        <FormGroup row>
                          <Label for="User Type" sm={2}>
                            <b style={{ fontSize: "small" }}>User Type</b>
                          </Label>
                          <Col sm={10}>
                            <Input
                              id="user_type"
                              name="user_type"
                              placeholder="User type"
                              type="text"
                              disabled={true}
                              value={cabinDetails.attributes.USER_TYPE}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="Usage Charge Type" sm={2}>
                            <b style={{ fontSize: "small" }}>Usage Charge Type</b>
                          </Label>
                          <Col sm={10}>
                            <Input
                              id="usage_charge_type"
                              name="usage_charge_type"
                              placeholder="Usage Charge Type"
                              type="text"
                              disabled={true}
                              value={cabinDetails.attributes.USAGE_CHARGE}
                            />
                          </Col>
                        </FormGroup>
                      </>
                    )}

                    {cabinDetails.thingTypeName === "BWT" && (
                      <>
                        <FormGroup row>
                          <Label for="BWT Capacity" sm={2}>
                            <b style={{ fontSize: "small" }}>BWT Capacity</b>
                          </Label>
                          <Col sm={10}>
                            <Input
                              id="bwt_capacity"
                              name="bwt_capacity"
                              placeholder="BWT Capacity"
                              type="text"
                              disabled={true}
                              value={cabinDetails.attributes.BWT_KLD}
                            />
                          </Col>
                        </FormGroup>
                        <FormGroup row>
                          <Label for="BWT Level" sm={2}>
                            <b style={{ fontSize: "small" }}>BWT Level</b>
                          </Label>
                          <Col sm={10}>
                            <Input
                              id="bwt_level"
                              name="bwt_level"
                              placeholder="BWT Level"
                              type="text"
                              disabled={true}
                              value={cabinDetails.attributes.BWT_LVL}
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
                          value={complexIotDetail.UUID}
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
                        value={complexIotDetail.COCO}
                      />
                      </Col>
                    </FormGroup>
                    
                    <FormGroup row>
                    <Label
                        for="Smartness Level"
                        sm={3}
                      >
                        <b style={{fontSize:"small"}}>Commissioning Status</b>
                      </Label>
                      <Col sm={9}>
                      <Input
                        id="SMART_LEVEL"
                        name="SMART_LEVEL"
                        placeholder="SMART_LEVEL"
                        type="text"
                        disabled={true}
                        value={cabinDetails.attributes.SMART_LEVEL}
                      />
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
                                value={complexIotDetail.QMWC}
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
                                value={complexIotDetail.QFWC}
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
                                value={complexIotDetail.
                                  QPWC}
                                  disabled={true}
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
                                value={complexIotDetail.QURI}
                                disabled={true}
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
                                value={complexIotDetail.QURC}
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
                                value={complexIotDetail.QBWT}
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
                            value={cabinDetails.attributes.ADDRESS}
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
                              value={cabinDetails.attributes.LATITUDE}
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
                              value={cabinDetails.attributes.LONGITUDE}
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
                              value={cabinDetails.attributes.CLIENT}
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
                              value={cabinDetails.attributes.BILLING_GROUP}
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
                        value={cabinDetails.attributes.DATE}
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
                          placeholder="CAMERA_SERIAL_NUM placeholder"
                          type="text"
                          value={cabinDetails.attributes.CAMERA_SERIAL_NUM}
                          disabled={true}
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
