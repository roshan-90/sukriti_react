import React, { useState, useEffect, useRef } from "react";
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
  FormFeedback,
  FormGroup,
} from "reactstrap";
import { whiteSurface } from "../../jsStyles/Style";
import MessageDialog from "../../dialogs/MessageDialog";
import LoadingDialog from "../../dialogs/LoadingDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import {
  executelistVendorAdminsLambda,
  executeCreateVendorLambda,
  executeRazorpayLambda,
} from "../../awsClients/vendorLambda";
import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { setVendorList } from "../../store/actions/vendor-actions";
import DropDown from "../../components/DropDown";

const AddVendorMember = ({
  vendorList,
  user,
  credentials,
  setVendorList,
  pushComponentProps,
}) => {
  const [linkedResponse, setLinkedResponse] = useState("");
  const [formDetails, setFormDetails] = useState({
    vendor_name: "",
    admin: "ssf_developer",
    adminRole: "Super Admin",
    assigned_by: "ssf_developer",
    beneficiary: "asdf",
    buisnessName: "TOKYO",
    contact: "",
    email: "tokyo@tokyo.com",
    gstNumber: "GST11111GST",
    ifsc_code: "HDFC00000",
    userName: "asdfghjkl",
    vendor_admin: "",
    accountNumber: "",
    account_id: "",
  });

  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);
  const confirmationDialog = useRef(null);

  useEffect(() => {
    fetchAndInitClientList();
  }, []);

  const fetchAndInitClientList = async () => {
    loadingDialog.current.showDialog();
    try {
      var result = await executelistVendorAdminsLambda(credentials);
      setVendorList(result.vendorList);
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const initCreateVendorRequest = async (createUserRequest) => {
    loadingDialog.current.showDialog();
    try {
      let result = await executeCreateVendorLambda(
        createUserRequest,
        credentials
      );
      messageDialog.current.showDialog(
        result.message,
        result.status === 1
          ? "Vendor added successfully"
          : result.status === -1
          ? "Please try again!"
          : result.status === -2 &&
            "Vendor Admin is already assigned to other complexes. Please choose other Admin",
        () => {
          pushComponentProps(history.goBack());
        }
      );
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const handleDeleteAction = () => {
    confirmationDialog.current.showDialog(
      "Confirm Action",
      "To delete the user permanently, type 'DELETE' below",
      "DELETE",
      initAdminDeleteAction
    );
  };

  const onClientSelected = (index, value) => {
    setFormDetails((prevDetails) => ({ ...prevDetails, vendor_admin: value }));
  };

  const populateClientList = () => {
    var clientNameList = [];
    for (let mClient of vendorList) {
      clientNameList.push(mClient);
    }
    return clientNameList;
  };

  const fetchRazorpayLinkedAcc = async () => {
    loadingDialog.current.showDialog();
    try {
      let linkedAccountId = formDetails.account_id;
      let result = await executeRazorpayLambda(linkedAccountId, credentials);
      setLinkedResponse(result);
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const onVerify = () => {
    if (formDetails.account_id === "") {
      messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a valid Linked Account ID."
      );
    } else {
      fetchRazorpayLinkedAcc();
    }
  };

  const onSubmit = () => {
    if (formDetails.account_id === "") {
      messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a valid Linked Account ID."
      );
    } else if (linkedResponse.message !== "success") {
      messageDialog.current.showDialog(
        "Validation Error",
        "Please verify your Linked Account ID."
      );
    } else if (formDetails.vendor_admin === "") {
      messageDialog.current.showDialog(
        "Validation Error",
        "Please select a Vendor Admin."
      );
    } else if (formDetails.accountNumber === "") {
      messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a valid Account Number."
      );
    } else if (formDetails.gstNumber === "") {
      messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a GST Number."
      );
    } else {
      initCreateVendorRequest(formDetails);
    }
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
              <CardBody
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Form>
                  <FormGroup>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        placeholder="Linked Account"
                        onChange={(event) =>
                          (this.formDetails.account_id = event.target.value)
                        }
                        valid={
                          this.state.linkedResponse.message === "success"
                            ? true
                            : false
                        }
                        invalid={
                          this.state.linkedResponse.message === "failure"
                            ? true
                            : false
                        }
                      />
                      <FormFeedback
                        tooltip
                        valid={
                          this.state.linkedResponse.message === "success"
                            ? true
                            : false
                        }
                      >
                        This is a verified account
                      </FormFeedback>
                      <FormFeedback
                        tooltip
                        invalid={
                          this.state.linkedResponse.message === "failure"
                            ? true
                            : false
                        }
                      >
                        Try Again! that I'd is not valid
                      </FormFeedback>
                    </InputGroup>
                  </FormGroup>
                </Form>
                <Button
                  style={{ marginBottom: "auto" }}
                  outline
                  color="primary"
                  className="px-4"
                  onClick={this.onVerify}
                >
                  Verify
                </Button>
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
                  <FormGroup>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        placeholder="Contact Name"
                        onChange={(event) =>
                          (this.formDetails.vendor_name = event.target.value)
                        }
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <Input
                        type="text"
                        placeholder="Contact Email"
                        onChange={(event) =>
                          (this.formDetails.email = event.target.value)
                        }
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <Input
                        type="text"
                        placeholder="Contact Number"
                        onChange={(event) =>
                          (this.formDetails.contact = event.target.value)
                        }
                      />
                    </InputGroup>
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Business Name"
                        onChange={(event) =>
                          (this.formDetails.buisnessName = event.target.value)
                        }
                      />
                    </InputGroup>
                  </FormGroup>
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
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Account Number"
                      onChange={(event) =>
                        (this.formDetails.accountNumber = event.target.value)
                      }
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Beneficiary"
                      onChange={(event) =>
                        (this.formDetails.beneficiary = event.target.value)
                      }
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="User Name"
                      onChange={(event) =>
                        (this.formDetails.userName = event.target.value)
                      }
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
                    <DropDown
                      options={this.populateClientList()}
                      onSelection={this.onClientSelected}
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
        {/* <div className={"row justiy-content-center"}
                        style={{ width: "100%" }}>
                        <p
                            style={{
                                margin: "auto",
                                color: "red"
                            }}>
                            To create a Vendor, you need to verify your linked account.
                        </p>
                    </div> */}
        <div className={"row justiy-content-center"} style={{ width: "100%" }}>
          <Button
            style={{ margin: "auto" }}
            color="primary"
            className="px-4"
            onClick={this.onSubmit}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  var lastProps = state.historyStore[UiAdminDestinations.MemberDetails];
  if (lastProps != undefined) {
    return lastProps;
  }

  return {
    vendorList: state.vendor.vendorList,
    user: state.authentication.user,
    credentials: state.authentication.credentials,
  };
};

const mapActionsToProps = {
  pushComponentProps: pushComponentProps,
  setVendorList: setVendorList,
};

export default connect(mapStateToProps, mapActionsToProps)(AddVendorMember);
