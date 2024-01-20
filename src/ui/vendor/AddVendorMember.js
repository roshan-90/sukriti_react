import React, { useState, useEffect, useRef } from "react";
// import { connect } from "react-redux";
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
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import ValidationMessageDialog from "../../dialogs/MessageDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import {
  executelistVendorAdminsLambda,
  executeCreateVendorLambda,
  executeRazorpayLambda,
} from "../../awsClients/vendorLambda";
// import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { setVendorList } from "../../features/vendorSlice";
import DropDown from "../../components/DropDown";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddVendorMember = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const vendorList = useSelector((state) => state.vendor.vendorList);
  const [linkedResponse, setLinkedResponse] = useState("");
  const [formDetails, setFormDetails] = useState({
    vendor_name: "",
    admin: user?.user?.userName,
    adminRole: user?.user?.userRole,
    assigned_by: user?.user?.userName,
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
  const [dialogData, setDialogData] = useState(null);

  const messageDialog = useRef(null);
  const loadingDialog = useRef(null);
  const confirmationDialog = useRef(null);

  useEffect(() => {
    fetchAndInitClientList();
  }, []);

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

  const fetchAndInitClientList = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistVendorAdminsLambda(user?.credentials);
      dispatch(setVendorList({ vendorList: result.vendorList }));
    } catch (err) {
      handleError(err, "fetchAndInitClientList");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const initCreateVendorRequest = async (createUserRequest) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      let result = await executeCreateVendorLambda(
        createUserRequest,
        user?.credentials
      );
      setDialogData({
        title: result.message,
        message:
          result.status === 1
            ? "Vendor added successfully"
            : result.status === -1
            ? "Please try again!"
            : result.status === -2 &&
              "Vendor Admin is already assigned to other complexes. Please choose other Admin",
        onClickAction: () => {
          navigate("/vendor");
          // Handle the action when the user clicks OK
          console.error(" AddVendorMember initCreateVendorRequest");
        },
      });
    } catch (err) {
      handleError(err, "initCreateVendorRequest");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const handleDeleteAction = () => {
    confirmationDialog.current.showDialog(
      "Confirm Action",
      "To delete the user permanently, type 'DELETE' below",
      "DELETE"
      // initAdminDeleteAction
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
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      let linkedAccountId = formDetails.account_id;
      let result = await executeRazorpayLambda(
        linkedAccountId,
        user?.credentials
      );
      setLinkedResponse(result);
    } catch (err) {
      handleError(err, "fetchRazorpayLinkedAcc");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const onVerify = () => {
    if (formDetails.account_id === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid Linked Account ID.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddVendorMemeber onVerify");
        },
      });
    } else {
      fetchRazorpayLinkedAcc();
    }
  };

  const onSubmit = () => {
    if (formDetails.account_id === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid Linked Account ID",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddVendorMemeber fetchAndInitClientList Error:->");
        },
      });
    } else if (linkedResponse.message !== "success") {
      setDialogData({
        title: "Validation Error",
        message: "Please verify your Linked Account ID.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddVendorMemeber fetchAndInitClientList Error:->");
        },
      });
    } else if (formDetails.vendor_admin === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please select a Vendor Admin",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddVendorMemeber fetchAndInitClientList Error:->");
        },
      });
    } else if (formDetails.accountNumber === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid Account Number.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddVendorMemeber fetchAndInitClientList Error:->");
        },
      });
    } else if (formDetails.gstNumber === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a GST Number.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddVendorMemeber fetchAndInitClientList Error:->");
        },
      });
    } else {
      initCreateVendorRequest(formDetails);
    }
  };

  const handleAddVendorMember = (e) => {
    console.log("handleAddVendorMember", e.target.name, e.target.value);
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
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
      <ConfirmationDialog ref={confirmationDialog} />
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <ValidationMessageDialog data={dialogData} />
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
                        name="account_id"
                        onChange={handleAddVendorMember}
                        valid={
                          linkedResponse.message === "success" ? true : false
                        }
                        invalid={
                          linkedResponse.message === "failure" ? true : false
                        }
                      />
                      <FormFeedback
                        tooltip
                        valid={
                          linkedResponse.message === "success" ? true : false
                        }
                      >
                        This is a verified account
                      </FormFeedback>
                      <FormFeedback
                        tooltip
                        invalid={
                          linkedResponse.message === "failure" ? true : false
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
                  onClick={onVerify}
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
                        name="vendor_name"
                        onChange={handleAddVendorMember}
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <Input
                        type="text"
                        placeholder="Contact Email"
                        name="email"
                        onChange={handleAddVendorMember}
                      />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <Input
                        type="text"
                        placeholder="Contact Number"
                        name="contact"
                        onChange={handleAddVendorMember}
                      />
                    </InputGroup>
                    <InputGroup>
                      <Input
                        type="text"
                        placeholder="Business Name"
                        name="buisnessName"
                        onChange={handleAddVendorMember}
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
                      name="ifsc_code"
                      onChange={handleAddVendorMember}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Account Number"
                      name="accountNumber"
                      onChange={handleAddVendorMember}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Beneficiary"
                      name="beneficiary"
                      onChange={handleAddVendorMember}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="User Name"
                      name="userName"
                      onChange={handleAddVendorMember}
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
                      name="gstNumber"
                      onChange={handleAddVendorMember}
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
                      options={populateClientList()}
                      onSelection={onClientSelected}
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
            style={{ margin: "auto", width: "100px" }}
            color="primary"
            className="px-4"
            onClick={onSubmit}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddVendorMember;
