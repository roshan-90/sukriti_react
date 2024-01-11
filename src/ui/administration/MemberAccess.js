import React, { useRef } from "react";
import { whiteSurface } from "../../jsStyles/Style";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import { Button } from "reactstrap";
import { NameValueList } from "../../components/DisplayLabels";
import { executeDisableUserLambda } from "../../awsClients/administrationLambdas";
import StateList from "../../components/accessTree/readOnly/SateList";
import NoDataComponent from "../../components/NoDataComponent";
import { getAccessSummary } from "../../components/accessTree/accessTreeUtils";
// import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const MemberAccess = (props) => {
  const navigate = useNavigate();
  let accessTree = useSelector((state) => state.authentication.accessTree);
  console.log("checked memeber access", props);
  const accessSummary = useRef(getAccessSummary(props.user?.permissions));
  console.log("checked memeber accessSummary", accessSummary);
  const user = useSelector(selectUser);
  console.log("checking for user data", user);
  //   const messageDialog = useRef();
  //   const loadingDialog = useRef();
  console.log("member access tree", accessTree);
  const initAdminDisableAction = async () => {
    // loadingDialog.current.showDialog();
    try {
      await executeDisableUserLambda(user?.username);
      // Assuming 'userStatus' should be part of the component state.
      // If it's part of Redux state, use Redux actions to update it.
      // this.setState({ userStatus: "disabled" });
      //   loadingDialog.current.closeDialog();
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.result.message);
    }
  };

  const handleDefineAccessAction = () => {
    // const bundle = {
    //   user: props.user,
    //   history: props.history,
    // };
    // props.pushComponentProps(UiAdminDestinations.MemberAccess, props);
    // props.history.push({ pathname: "/administration/defineAccess", bundle });
    navigate("/administration/defineAccess");
  };

  const ComponentSelector = () => {
    if (props.user !== undefined) {
      if (props.user.permissions.country.recursive === 1) {
        return <SuperAdminAcceess />;
      } else if (props.user.permissions.country.states.length === 0) {
        return <NoDataComponent />;
      } else {
        console.log("_accessTree", props.user.permissions.country.states);
        return <StateList listData={props.user.permissions.country.states} />;
      }
    } else {
      return <NoDataComponent />;
    }
  };

  const SuperAdminAcceess = () => {
    return (
      <div
        className="col-md-8 offset-md-1"
        style={{ clear: "both", width: "50%", margin: "auto" }}
      >
        SUPER ADMIN ACCESS
      </div>
    );
  };

  return (
    <div
      className="col-md-10 offset-md-2"
      style={{ ...whiteSurface, width: "80%", margin: "auto" }}
    >
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}
      <div>
        <Button
          style={{ float: "left", margin: "10px" }}
          outline
          color="primary"
          className="px-4"
          onClick={handleDefineAccessAction}
        >
          Define Access
        </Button>

        <div className="col-md-2" style={{ float: "right" }}>
          <NameValueList data={accessSummary.current} />
        </div>
      </div>

      <div className="col-md-8 offset-md-1" style={{ clear: "both" }}>
        <ComponentSelector />
      </div>
    </div>
  );
};

export default MemberAccess;
