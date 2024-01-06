import React from "react";
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

class AddVendorMember extends React.Component {
  state = {};

  userDetailsNameValueList = [];

  constructor(props) {
    super(props);
    this.state = {
      linkedResponse: "",
    };
    this.initializeFormDetails();
    this.messageDialog = React.createRef();
    this.loadingDialog = React.createRef();
    this.confirmationDialog = React.createRef();
  }

  componentWillUnmount() {
    console.log("_memberDetails", "_restoreProps-saved", this.props);
  }

  componentDidMount() {
    this.fetchAndInitClientList();
  }

  async fetchAndInitClientList() {
    this.loadingDialog.current.showDialog();
    try {
      var result = await executelistVendorAdminsLambda(this.props.credentials);
      this.props.setVendorList(result.vendorList);
      this.loadingDialog.current.closeDialog();
    } catch (err) {
      this.loadingDialog.current.closeDialog();
      this.messageDialog.current.showDialog("Error Alert!", err.message);
    }
  }

  async initCreateVendorRequest(createUserRequest) {
    this.loadingDialog.current.showDialog();
    try {
      let result = await executeCreateVendorLambda(
        createUserRequest,
        this.props.credentials
      );
      this.messageDialog.current.showDialog(
        result.message,
        result.status === 1
          ? "Vendor added successfully"
          : result.status === -1
          ? "Please try again!"
          : result.status === -2 &&
            "Vendor Admin is already assigned to other complexes. Please choose other Admin",
        () => {
          this.props.history.goBack();
        }
      );
      this.loadingDialog.current.closeDialog();
    } catch (err) {
      this.loadingDialog.current.closeDialog();
      this.messageDialog.current.showDialog("Error Alert!", err.message);
    }
  }

  handleDeleteAction = () => {
    this.confirmationDialog.current.showDialog(
      "Confirm Action",
      "To delete the user permenently, type 'DELETE' below",
      "DELETE",
      this.initAdminDeleteAction
    );
  };

  onClientSelected = (index, value) => {
    console.log("index-index -:👉", index);
    this.formDetails.vendor_admin = value;
  };

  populateClientList = () => {
    var clientNameList = [];
    for (let mClient of this.props.vendorList) {
      clientNameList.push(mClient);
    }
    return clientNameList;
  };

  initializeFormDetails() {
    this.formDetails = {
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
    };
  }

  async fetchRazorpayLinkedAcc() {
    this.loadingDialog.current.showDialog();
    try {
      let linkedAccountId = this.formDetails.account_id;
      let result = await executeRazorpayLambda(
        linkedAccountId,
        this.props.credentials
      );
      this.setState({ linkedResponse: result });
      this.loadingDialog.current.closeDialog();
    } catch (err) {
      this.loadingDialog.current.closeDialog();
      this.messageDialog.current.showDialog("Error Alert!", err.message);
    }
  }

  onVerify = () => {
    if (this.formDetails.account_id === "") {
      this.messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a valid Linked Account ID."
      );
    } else {
      // this.setState({ linkedResponse: '' })
      this.fetchRazorpayLinkedAcc();
    }
  };

  onSubmit = () => {
    if (this.formDetails.account_id === "") {
      this.messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a valid Linked Account ID."
      );
    } else if (this.state.linkedResponse.message != "success") {
      this.messageDialog.current.showDialog(
        "Validation Error",
        "Please verify your Linked Account ID."
      );
    } else if (this.formDetails.vendor_admin === "") {
      this.messageDialog.current.showDialog(
        "Validation Error",
        "Please select a Vendor Admin."
      );
    } else if (this.formDetails.accountNumber === "") {
      this.messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a valid Account Number."
      );
    } else if (this.formDetails.gstNumber === "") {
      this.messageDialog.current.showDialog(
        "Validation Error",
        "Please enter a GST Number."
      );
    } else {
      this.initCreateVendorRequest(this.formDetails);
      //this.props.addMember(User.getTestTeamUser(this.formDetails.userName))
      //this.props.addMember(newUser)
      // this.messageDialog.current.showDialog("Success", "Vendor added successfully", () => { this.props.history.goBack() })
    }
  };

  render() {
    //👇
    console.log("USER -:👉", this.props.user);
    console.log("USER -:👉", this.formDetails.account_id);
    //👆
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
          <div
            className={"row justiy-content-center"}
            style={{ width: "100%" }}
          >
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
  }
}

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
