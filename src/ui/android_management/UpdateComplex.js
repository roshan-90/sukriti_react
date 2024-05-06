import React, { useState , useEffect} from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import './enrollDevice.css';
import Select from 'react-select'; // Importing react-select
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const UpdateComplex = ({ complexChanged , selected, setComplexChanged}) => { // Receive complexChanged as a prop
  const [modal, setModal] = useState(true);
  const ComplexIotDetails = useSelector((state) => state.androidManagement.complexIotDetail);
  const ListclientName = useSelector((state) => state.androidManagement.clientName);
  const ListbillingGroups = useSelector((state) => state.androidManagement.billingGroups);
  const [selectedClientName, setSelectedClientName] = useState(null); // State for react-select
  const [selectedbillingGroups, setSelectedbillingGroups] = useState(null); // State for react-select
  const [selectedDate, setSelectedDate] = useState(null);

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
  
  console.log('ComplexIotDetails',ComplexIotDetails);
  console.log('ListclientName',ListclientName);
  console.log('selected', selected);

  const toggle = () => {
    setModal(!modal)
    setComplexChanged(false)
  };

  const handleChangeClientName = (selectedOption) => {
    console.log('handleChangeClientName',selectedOption)
  }

  const handleChangeBillingGroup = (selectedOption) => {
    console.log('handleChangeBillingGroup',selectedOption)
  }


  const handleDateChange = (date) => {
    setSelectedDate(date);
    const formattedDate = formatDate(date);
    console.log('formattedDate',formattedDate);
    setFormData({ ...formData, selectedDate: formattedDate });
  };

  // Update form state when form values change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const formatDate = (date) => {
    // Format the date to 'dd/MM/yyyy' format
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  console.log('complexChanged',complexChanged);
  return (
    <div>
      {(complexChanged) && ( // Conditionally render based on complexChanged prop
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}><b>Complex Details</b></ModalHeader>
            <ModalBody>
            <Card>
                <CardBody>
                  <CardTitle><b>Complex Details</b></CardTitle>
                  <br/>
                  <Form>
                  <FormGroup row>
                    <Label
                      for="State"
                      sm={2}
                    >
                      <b>State</b>
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
                    <b>  District</b>
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
                    <b> City </b>
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
                    <b> Complex </b>
                    </Label>
                    <Col sm={10}>
                      <Input
                        id="complex"
                        name="complex"
                        placeholder="complex"
                        type="text"
                        disabled={true}
                        value={selected.value}
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
                          id="address"
                          name="address"
                          type="textarea"
                          value={ComplexIotDetails.ADDR}
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
                          <Label for="latitude">
                            Latitude
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={5}>
                        <FormGroup>
                          <Label for="longitude">
                            Longitude
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
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
                    <Col sm={10}>
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
                    <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} placeholder="Commissioning Status" />
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
                        <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} placeholder="Device Type" />
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
                        <Select options={ListbillingGroups || []} value={selectedbillingGroups} onChange={handleChangeBillingGroup} placeholder="Smartness Level" />
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
                          <Label for="mwc">
                            Male WCs
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="longitude">
                            Female WCs
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="longitude">
                            PD WCs
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                  <FormGroup row>                    
                    <Label
                        for="Wc Count"
                        sm={2}
                      >
                      <b> Urinal Count </b>
                      </Label>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="mwc">
                            Urinal count
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="longitude">
                            Urinal cabin
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="longitude">
                            Number of BWT
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                  <FormGroup row>                    
                    <Label
                        for="Wc Count"
                        sm={2}
                      >
                      <b> Napkin Vending Machine </b>
                      </Label>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="mwc">
                            Number Napkin Vending Machine
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="longitude">
                            Manufacturer of Napkin incinerator
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                  <FormGroup row>                    
                    <Label
                        for="Wc Count"
                        sm={2}
                      >
                      <b> Napkin incinerator</b>
                      </Label>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="mwc">
                            Number Napkin incinerator
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                      <Col md={3}>
                        <FormGroup>
                          <Label for="longitude">
                            Manufacturer of Napkin incinerator
                          </Label>
                          <Input
                            id="longitude"
                            name="longitude"
                            placeholder="longitude placeholder"
                            type="text"
                            value={ComplexIotDetails.LONG}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                  <FormGroup row>                    
                    <Label
                        for="Wc Count"
                        sm={2}
                      >
                      <b> Area of KIOSK</b>
                      </Label>
                      <Col md={3}>
                        <FormGroup>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={"N/A"}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                  <FormGroup row>                    
                    <Label
                        for="Wc Count"
                        sm={2}
                      >
                      <b> Water Atm Capacity</b>
                      </Label>
                      <Col md={5}>
                        <FormGroup>
                          <Label for="mwc">
                            LPH
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                  <FormGroup row>                    
                    <Label
                        for="Wc Count"
                        sm={2}
                      >
                      <b> Supervisior Room Size</b>
                      </Label>
                      <Col md={5}>
                        <FormGroup>
                          <Label for="mwc">
                            LPH
                          </Label>
                          <Input
                            id="latitude"
                            name="latitude"
                            placeholder="latitude"
                            type="text"
                            value={ComplexIotDetails.LATT}
                          />
                        </FormGroup>
                      </Col>
                  </FormGroup>
                   </Form>
              </CardBody>
              </Card>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={toggle}>
                Do Something
              </Button>{' '}
              <Button color="secondary" onClick={toggle}>
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default UpdateComplex;
