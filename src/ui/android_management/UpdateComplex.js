import React, { useState } from 'react';
import {Row, Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardBody, CardTitle, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch, useSelector } from "react-redux";
import './enrollDevice.css';


export const UpdateComplex = ({ complexChanged , selected}) => { // Receive complexChanged as a prop
  const [modal, setModal] = useState(true);
  const ComplexIotDetails = useSelector((state) => state.androidManagement.complexIotDetail);
  console.log('ComplexIotDetails',ComplexIotDetails);
  console.log('selected', selected);
  const toggle = () => setModal(!modal);

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
                            disabled={true}
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
                            disabled={true}
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
                      <Input
                        id="client_name"
                        name="client_name"
                        placeholder="client_name"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.CLNT}
                      />
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
                      <Input
                        id="billing_group"
                        name="billing_group"
                        placeholder="billing_group"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.BILL}
                      />
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
                      <Input
                        id="select_date"
                        name="select_date"
                        placeholder="select_date"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.DATE}
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
                        id="commissioning_status"
                        name="commissioning_status"
                        placeholder="commissioning_status"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.CLNT}
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
                        id="device_type"
                        name="device_type"
                        placeholder="device_type"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.BILL}
                      />
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
                      <Input
                        id="select_date"
                        name="select_date"
                        placeholder="select_date"
                        type="text"
                        disabled={true}
                        value={ComplexIotDetails.DATE}
                      />
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
