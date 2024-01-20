import React, { useCallback, useState, useRef, useEffect } from "react";
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
} from "reactstrap";
import { whiteSurface } from "../../jsStyles/Style";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import { executeUpdateVendorLambda } from "../../awsClients/vendorLambda";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/authenticationSlice";
import { executeReadVendorLambda } from "../../awsClients/vendorLambda";
import { setTeamList } from "../../features/vendorSlice";

const UpdateVendorMember = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  let List = useSelector((state) => state.vendor.teamList);
  let vendorList = useSelector((state) => state.vendor.vendorList);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);
  const navigate = useNavigate();
  const [teamList] = List.filter((data) => data?.vendor_name === id);
  const user = useSelector(selectUser);

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

  const fetchAndInitTeam = useCallback(async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeReadVendorLambda(
        user?.user?.userName,
        user?.credentials
      );
      console.log("Updatevendormember -:👉", result);
      console.log("UpdateVendorMember -:👉", result);
      dispatch(setTeamList({ teamList: result.teamDetails }));
    } catch (err) {
      handleError(err, "fetchAndInitTeam");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }, [dispatch, executeReadVendorLambda, user]);

  useEffect(() => {
    fetchAndInitTeam();
  }, []);

  console.log("update member vendorList", teamList);
  console.log("update member data", vendorList);

  const [formDetails, setFormDetails] = useState({
    vendor_id: teamList?.vendor_id,
    vendor_name: teamList?.vendor_name,
    admin: user?.user?.userName,
    adminRole: user?.user?.userRole,
    assigned_by: user?.user?.userName,
    beneficiary: teamList?.beneficiary,
    buisnessName: teamList?.buisnessName,
    contact: teamList?.contact,
    email: teamList?.email,
    gstNumber: teamList?.gstNumber,
    ifsc_code: teamList?.ifsc_code,
    userName: teamList?.userName,
    vendor_admin: teamList?.vendor_admin,
    accountNumber: teamList?.accountNumber,
    prev_admin: teamList?.vendor_name,
    account_id: teamList?.account_id,
  });

  // const messageDialog = useRef(null);
  // const loadingDialog = useRef(null);
  const confirmationDialog = useRef(null);

  const initCreateVendorRequest = async (createUserRequest) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      console.log("checking request", createUserRequest);
      await executeUpdateVendorLambda(createUserRequest, user?.credentials);
      setDialogData({
        title: "Success",
        message: "Vendor updated successfully",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("executeUpdateVendorLambda clicked");
          navigate("/vendor");
        },
      });
    } catch (err) {
      handleError(err, "initCreateVendorRequest");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const onClientSelected = (index, value) => {
    console.log("index-index -:👉", index);
    if (teamList.vendor_name) {
      // Do something
    }
    setFormDetails((prevDetails) => ({ ...prevDetails, vendor_admin: value }));
  };

  const populateClientList = () => {
    var clientNameList = [];
    if (vendorList != undefined) {
      for (let mClient of vendorList) {
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

  const handleUpdateVendorMember = (e) => {
    console.log("handleUpdateVendorMember", e.target.name, e.target.value);
    setFormDetails({
      ...formDetails,
      [e.target.name]: e.target.value,
    });
  };

  if (teamList == null || teamList == undefined) {
    return null;
  }
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
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <ConfirmationDialog ref={confirmationDialog} />

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
                      name="account_id"
                      defaultValue={teamList.account_id}
                      disabled="true"
                      // onChange={(event) =>
                      //     (formDetails.account_id = event.target.value)
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
                      name="vendor_name"
                      placeholder="Contact Name"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.vendor_name}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Contact Email"
                      name="email"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.email}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Contact Number"
                      name="contact"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.contact}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      name="buisnessName"
                      placeholder="Business Name"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.buisnessName}
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
                      name="ifsc_code"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.ifsc_code}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Account Number"
                      name="accountNumber"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.accountNumber}
                    />
                  </InputGroup>
                  <InputGroup className="mb-4">
                    <Input
                      type="text"
                      placeholder="Beneficiary"
                      name="beneficiary"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.beneficiary}
                    />
                  </InputGroup>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="User Name"
                      name="userName"
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.userName}
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
                      onChange={handleUpdateVendorMember}
                      defaultValue={teamList.gstNumber}
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
                      name="vendor_admin"
                      onChange={handleUpdateVendorMember}
                    >
                      <option>{teamList.vendor_admin}</option>
                      {vendorList.map((alluserrole) => {
                        return (
                          <option key={alluserrole} value={alluserrole}>
                            {alluserrole}
                          </option>
                        );
                      })}
                    </Input>
                    {/* <select
                                                // value={this.props.location.vendorList.includes(teamList.vendor_admin) && teamList.vendor_admin
                                                // }
                                                defaultValue={teamList.vendor_admin}
                                            // onChange={(e) => this.changeRole(e)}
                                            >
                                                {this.props.location.vendorList.map((alluserrole) => {
                                                    return (
                                                        <option
                                                            key={alluserrole}
                                                            value={alluserrole}
                                                            selected={teamList.vendor_admin}
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
            style={{ margin: "auto", width: "100px" }}
            color="primary"
            className="px-4"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

// const mapStateToProps = (state) => {
//   return {
//     credentials: state.authentication.credentials,
//   };
// };

// const mapActionsToProps = {};

export default UpdateVendorMember;
