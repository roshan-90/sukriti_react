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
// import {
//   addTeamMember,
//   setClientList,
// } from "../../store/actions/administration-actions";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
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

const AddTeamMember = ({
  userDetails,
  clientList,
  addMember,
  setClientList,
}) => {
  const [selectedRole, setSelectedRole] = useState(UserRoles.Undefined);
  const formDetails = useRef({
    userName: "",
    tempPassword: "",
    userRole: getRole(getCreateUserRoleList(userDetails.userRole)[0]),
    clientName: "",
    organisationName: "",
  });

  // const messageDialog = useRef();
  // const loadingDialog = useRef();
  const organisationNameRef = useRef();

  useEffect(() => {
    fetchAndInitClientList();
  }, []);

  const fetchAndInitClientList = async () => {
    // loadingDialog.current.showDialog();
    try {
      var result = await executelistClientsLambda();
      setClientList(result.clientList);
      // loadingDialog.current.closeDialog();
    } catch (err) {
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const initCreateUserRequest = async (createUserRequest) => {
    // loadingDialog.current.showDialog();
    try {
      var roleName = getRoleName(createUserRequest.userRole);
      var requestCopy = { ...createUserRequest, userRole: roleName };
      await executeCreateUserLambda(requestCopy, userDetails);
      // messageDialog.current.showDialog(
      //   "Success",
      //   "User added successfully",
      //   () => {
      //     // Navigate back after success
      //     // this.props.history.goBack();
      //   }
      // );
      // loadingDialog.current.closeDialog();
    } catch (err) {
      // loadingDialog.current.closeDialog();
      // messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const onRoleSelected = (index, value) => {
    const userRole = getRole(value);
    formDetails.current.userRole = userRole;
    setSelectedRole(userRole);
  };

  const onClientSelected = (index, value) => {
    const selectedRole = formDetails.current.userRole;
    const selectedClient = isClientSpecificRole(selectedRole)
      ? clientList[index]
      : Client.getSSF();

    formDetails.current.clientName = selectedClient.name;
    formDetails.current.organisationName = selectedClient.organisation;

    organisationNameRef.current.setText(formDetails.current.organisationName);
  };

  const populateClientList = () => {
    const clientList = isClientSpecificRole(formDetails.current.userRole)
      ? clientList
      : [Client.getSSF()];

    const clientNameList = clientList.map((mClient) => mClient.name);

    return clientNameList;
  };

  const onSubmit = () => {
    if (formDetails.current.userName === "") {
      // messageDialog.current.showDialog(
      //   "Validation Error",
      //   "Please enter a valid user name."
      // );
    } else if (formDetails.current.tempPassword === "") {
      // messageDialog.current.showDialog(
      //   "Validation Error",
      //   "Please enter a valid temporary password."
      // );
    } else {
      initCreateUserRequest(formDetails.current);
    }
  };

  return (
    <div className="col-md-12">
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}

      <Container>{/* Rest of your component JSX */}</Container>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    userDetails: state.authentication.user,
    clientList: state.administration.clientList,
  };
};

export default AddTeamMember;
