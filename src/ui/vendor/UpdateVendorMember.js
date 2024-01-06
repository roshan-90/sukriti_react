import React, { useState, useRef } from "react";
import { connect } from "react-redux";
import {
  Button,
  Card,
  CardBody,
  Col,
  Form,
  Input,
  InputGroup,
  Row,
  CardHeader,
} from "reactstrap";
import { whiteSurface } from "../../jsStyles/Style";
import MessageDialog from "../../dialogs/MessageDialog";
import LoadingDialog from "../../dialogs/LoadingDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import { executeUpdateVendorLambda } from "../../awsClients/vendorLambda";

const UpdateVendorMember = ({ location, credentials, history }) => {
  const [formDetails, setFormDetails] = useState({
    vendor_id: location.data.vendor_id,
    vendor_name: location.data.vendor_name,
    admin: "ssf_developer",
    adminRole: "Super Admin",
    assigned_by: "ssf_developer",
    beneficiary: location.data.beneficiary,
    buisnessName: location.data.buisnessName,
    contact: location.data.contact,
    email: location.data.email,
    gstNumber: location.data.gstNumber,
    ifsc_code: location.data.ifsc_code,
    userName: location.data.userName,
    vendor_admin: location.data.vendor_admin,
    accountNumber: location.data.accountNumber,
    prev_admin: location.data.vendor_name,
    account_id: location.data.account_id,
  });

  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);
  const confirmationDialog = useRef(null);

  const initCreateVendorRequest = async (createUserRequest) => {
    loadingDialog.current.showDialog();
    try {
      await executeUpdateVendorLambda(createUserRequest);
      messageDialog.current.showDialog(
        "Success",
        "Vendor updated successfully",
        () => {
          history.goBack();
        }
      );
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const onClientSelected = (index, value) => {
    console.log("index-index -:👉", index);
    if (location.data.vendor_name) {
      // Do something
    }
    setFormDetails((prevDetails) => ({ ...prevDetails, vendor_admin: value }));
  };

  const populateClientList = () => {
    var clientNameList = [];
    if (location.vendorList != undefined) {
      for (let mClient of location.vendorList) {
        clientNameList.push(mClient);
      }
    }
    return clientNameList;
  };

  const onSubmit = () => {
    initCreateVendorRequest(formDetails);
  };

  const changeRole = (e) => {
    console.log(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div
      className="col-md-10 offset-md-2"
      style={{
        ...whiteSurface,
        width: "80%",
        margin: "10px auto",
        background: "white",
      }}
    >
      <MessageDialog ref={this.messageDialog} />
      <LoadingDialog ref={this.loadingDialog} />
      <ConfirmationDialog ref={this.confirmationDialog} />

      <div className="" style={{ margin: "50px", clear: "both" }}>
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <b style={{ margin: "auto" }} className="text-muted">
                  Vendor Linked Account ID
                </b>
              </CardHeader>
              <CardBody>
                <Form>
                  <InputGroup className="mb-3">
                    <Input
                      type="text"
                      placeholder="Linked Account"
                      defaultValue={this.props.location.data.account_id}
                      disabled="true"
                      // onChange={(event) =>
                      //     (this.formDetails.account_id = event.target.value)
                      // }
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <b style={{ margin: "auto" }} className="text-muted">
                  Vendor Details
                </b>
              </CardHeader>
              <CardBody>
                <Form>
                  <InputGroup className="mb-3">
                    <Input
                      type="text"
                      placeholder="Contact Name"
                      onChange={(event) =>
                        (this.formDetails.vendor_name = event.target.value)
                      }
                      defaultValue={this.props.location.data.vendor_name}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Contact Email"
                      onChange={(event) =>
                        (this.formDetails.email = event.target.value)
                      }
                      defaultValue={this.props.location.data.email}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Contact Number"
                      onChange={(event) =>
                        (this.formDetails.contact = event.target.value)
                      }
                      defaultValue={this.props.location.data.contact}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Business Name"
                      onChange={(event) =>
                        (this.formDetails.buisnessName = event.target.value)
                      }
                      defaultValue={this.props.location.data.buisnessName}
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <b style={{ margin: "auto" }} className="text-muted">
                  Bank Account
                </b>
              </CardHeader>
              <CardBody>
                <Form>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="IFSC Code"
                      onChange={(event) =>
                        (this.formDetails.ifsc_code = event.target.value)
                      }
                      defaultValue={this.props.location.data.ifsc_code}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Account Number"
                      onChange={(event) =>
                        (this.formDetails.accountNumber = event.target.value)
                      }
                      defaultValue={this.props.location.data.accountNumber}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Beneficiary"
                      onChange={(event) =>
                        (this.formDetails.beneficiary = event.target.value)
                      }
                      defaultValue={this.props.location.data.beneficiary}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="User Name"
                      onChange={(event) =>
                        (this.formDetails.userName = event.target.value)
                      }
                      defaultValue={this.props.location.data.userName}
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <b style={{ margin: "auto" }} className="text-muted">
                  GST Details
                </b>
              </CardHeader>
              <CardBody>
                <Form>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="GST Number"
                      onChange={(event) =>
                        (this.formDetails.gstNumber = event.target.value)
                      }
                      defaultValue={this.props.location.data.gstNumber}
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            <Card>
              <CardHeader>
                <b style={{ margin: "auto" }} className="text-muted">
                  Vendor Admins
                </b>
              </CardHeader>
              <CardBody>
                <Form>
                  <InputGroup>
                    <Input
                      type="select"
                      onChange={(event) =>
                        (this.formDetails.vendor_admin = event.target.value)
                      }
                    >
                      <option>{this.props.location.data.vendor_admin}</option>
                      {this.props.location.vendorList.map((alluserrole) => {
                        return (
                          <option key={alluserrole} value={alluserrole}>
                            {alluserrole}
                          </option>
                        );
                      })}
                    </Input>
                    {/* <select
                                                // value={this.props.location.vendorList.includes(this.props.location.data.vendor_admin) && this.props.location.data.vendor_admin
                                                // }
                                                defaultValue={this.props.location.data.vendor_admin}
                                            // onChange={(e) => this.changeRole(e)}
                                            >
                                                {this.props.location.vendorList.map((alluserrole) => {
                                                    return (
                                                        <option
                                                            key={alluserrole}
                                                            value={alluserrole}
                                                            selected={this.props.location.data.vendor_admin}
                                                        >
                                                            {alluserrole}
                                                        </option>
                                                    );
                                                })}
                                            </select> */}
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div className={"row justiy-content-center"} style={{ width: "100%" }}>
          <Button
            style={{ margin: "auto" }}
            color="primary"
            className="px-4"
            onClick={this.onSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    credentials: state.authentication.credentials,
  };
};

const mapActionsToProps = {};

export default connect(mapStateToProps, mapActionsToProps)(UpdateVendorMember);
