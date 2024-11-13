import React, { useState, useRef, useEffect } from "react";
// import { connect } from "react-redux";

import {
  getCreateUserRoleList,
  isClientSpecificRole,
  getRole,
  getRoleName,
} from "./utils/AdminUtils";
import { UserRoles } from "../../nomenclature/nomenclature";
import Dropdown from "../../components/DropDown";
import RxInputText from "../../components/RxInputText";
import * as Styles from "../../jsStyles/Style";
import { useNavigate } from "react-router-dom";
import { setClientList } from "../../features/adminstrationSlice";
import {
  executelistClientsLambda,
  executeCreateUserLambda,
} from "../../awsClients/administrationLambdas";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import Client from "../../Entity/User/Client";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import ValidationMessageDialog from "../../dialogs/MessageDialog";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const AddTeamMember = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const clientList = useSelector((state) => state.adminstration.clientList);
  const [selectedRole, setSelectedRole] = useState(UserRoles.Undefined);
  const [dialogData, setDialogData] = useState(null);
  const formDetails = useRef({
    userName: "",
    tempPassword: "",
    userRole: getRole(getCreateUserRoleList(user?.user?.userRole)[0]),
    clientName: "",
    organisationName: "",
  });
  const [selectUserRole, setSelectedUserRole] = useState(null);

  const organisationNameRef = useRef();

  useEffect(() => {
    fetchAndInitClientList();
  }, []);

  const handleError = (err, Custommessage, onclick = null) => {
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
        },
      });
    }
  };

  const fetchAndInitClientList = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistClientsLambda(user?.credentials);
      dispatch(setClientList(result.clientList));
    } catch (err) {
      handleError(err, "fetchAndInitClientList");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const initCreateUserRequest = async (createUserRequest) => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var roleName = getRoleName(createUserRequest.userRole);
      var requestCopy = { ...createUserRequest, userRole: roleName };
      let result = await executeCreateUserLambda(
        requestCopy,
        user?.user,
        user?.credentials
      );
      if (result.status == "-1") {
        setDialogData({
          title: "Error",
          message: result.result.message,
          onClickAction: () => {
            navigate("/administration");
          },
        });
      } else {
        setDialogData({
          title: "Success",
          message: "User added successfully",
          onClickAction: () => {
            navigate("/administration");
          },
        });
      }
    } catch (err) {
      handleError(err, "initCreateUserRequest");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const onRoleSelected = (index, value) => {
    const userRole = getRole(value);
    formDetails.current.userRole = userRole;
    setSelectedRole(userRole);
    setSelectedUserRole(value)
  };

  const onClientSelected = (index, value) => {
    const selectedRole = formDetails.current.userRole;
    const selectedClient = isClientSpecificRole(selectedRole)
      ? clientList[index]
      : Client.getSSF();

    // Update formDetails.current with the selected client data
    formDetails.current.clientName = selectedClient.name;
    formDetails.current.organisationName = selectedClient.organisation;
  };

  const populateClientList = () => {
    const clientLists = isClientSpecificRole(formDetails.current.userRole)
      ? clientList
      : [Client.getSSF()];

    const clientNameList = clientLists.map((mClient) => mClient.name);

    // Update formDetails.current with the selected client data
    const selectedClient =
      clientLists.length > 0 ? clientLists[0] : Client.getInstance();
    formDetails.current.clientName = selectedClient.name;
    formDetails.current.organisationName = selectedClient.organisation;

    // Check if organisationNameRef.current is defined before accessing setText
    if (organisationNameRef.current) {
      // Update the text using the RxInputText component's setText method
      organisationNameRef.current.setText(formDetails.current.organisationName);

      // Manually trigger a change event to force a re-render
      const changeEvent = new Event("input", { bubbles: true });
      organisationNameRef.current.dispatchEvent(changeEvent);
    }

    return clientNameList;
  };

  const onSubmit = () => {
    if (formDetails.current.userName === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid user name.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddTeamMemeber onsubmit Error:->");
        },
      });
    } else if (formDetails.current.tempPassword === "") {
      setDialogData({
        title: "Validation Error",
        message: "Please enter a valid temporary password.",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("AddTeamMemeber onsubmit Error:->");
        },
      });
    } else {
      initCreateUserRequest(formDetails.current);
    }
  };


  return (
    <div className="col-md-12">
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <ValidationMessageDialog data={dialogData} />
      <Container>
        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4">
              <CardBody>
                <Form>
                  <p style={Styles.formLabel}>User Details</p>
                  <InputGroup className="mb-3">
                    <InputGroupText>
                      <PersonOutlineOutlinedIcon />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Username"
                      onChange={(event) =>
                        (formDetails.current.userName = event.target.value)
                      }
                    />
                  </InputGroup>

                  <InputGroup className="mb-4">
                    <InputGroupText>
                      <LockOutlinedIcon />
                    </InputGroupText>
                    <Input
                      type="text"
                      placeholder="Temporary Password"
                      onChange={(event) =>
                        (formDetails.current.tempPassword = event.target.value)
                      }
                    />
                  </InputGroup>

                  <p className="text-muted">User Role</p>
                  <InputGroup className="mb-4">
                    <InputGroupText>
                      <LockOutlinedIcon />
                    </InputGroupText>
                    <Dropdown
                      options={getCreateUserRoleList(user?.user?.userRole)}
                      onSelection={onRoleSelected}
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col md="8">
            <Card className="p-4">
              <CardBody>
                <Form>
                  {selectUserRole !== "Vendor Admin" && (
                    <>
                    <p style={Styles.formLabel}>Client Selection</p>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <LockOutlinedIcon />
                      </InputGroupText>
                      <Dropdown
                        options={populateClientList()}
                        onSelection={onClientSelected}
                      />
                    </InputGroup>
                    </>
                    )}

                  <InputGroup className="mb-3">
                    <InputGroupText>
                      <PersonOutlineOutlinedIcon />
                    </InputGroupText>
                    <RxInputText
                      ref={organisationNameRef}
                      text={formDetails.current.organisationName}
                      placeholder="Organisation Name"
                      onChange={(event) =>
                        (formDetails.current.organisationName =
                          event.target.value)
                      }
                    />
                  </InputGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <div className={"row justiy-content-center"}>
          <Button
            style={{ margin: "auto", width: "100px" }}
            color="primary"
            className="px-4"
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default AddTeamMember;
