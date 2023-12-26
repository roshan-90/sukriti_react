import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { NameValueList } from "../../components/DisplayLabels";
import NameValue from "../../Entity/NameValue";
import { whiteSurface } from "../../jsStyles/Style";
import { fromUserDetails } from "../../parsers/listDataParsers";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import {
  executeEnableUserLambda,
  executeDisableUserLambda,
  executeDeleteUserLambda,
} from "../../awsClients/administrationLambdas";
// import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";

const MemberDetails = (props) => {
  const [userStatus, setUserStatus] = useState(
    props?.user?.enabled ? "enabled" : "disabled"
  );
  var userDetails = fromUserDetails(props?.user);
  let userDetailsNameValueList = [];

  Object.keys(userDetails).map((item, value) => {
    userDetailsNameValueList.push(NameValue(item, userDetails[item]));
  });

  //   const messageDialog = useRef();
  //   const loadingDialog = useRef();
  const confirmationDialog = useRef();

  const initAdminDisableAction = async () => {
    // loadingDialog.current.showDialog();
    try {
      const result = await executeDisableUserLambda(props.user.userName);
      console.log("result --> executeDisableUserLambda", result);
      setUserStatus("disabled");
      //   loadingDialog.current.closeDialog();
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.result.message);
    }
  };

  const initAdminEnableAction = async () => {
    // loadingDialog.current.showDialog();
    try {
      const result = await executeEnableUserLambda(props.user.userName);
      console.log("result --> executeEnableUserLambda", result);
      setUserStatus("enabled");
      //   loadingDialog.current.closeDialog();
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.result.message);
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

  const initAdminDeleteAction = async () => {
    // loadingDialog.current.showDialog();
    try {
      const result = await executeDeleteUserLambda(props.user.userName);
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog(
      //     "Success",
      //     "User deleted successfully",
      //     () => {
      //       props.history.goBack();
      //     }
      //   );
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  useEffect(() => {
    return () => {
      console.log("_memberDetails", "_restoreProps-saved", props);
      // props.pushComponentProps(UiAdminDestinations.MemberDetails, props);
    };
  }, []);

  return (
    <div
      className="col-md-10 offset-md-2"
      style={{ ...whiteSurface, width: "80%", margin: "auto" }}
    >
      {/* <MessageDialog ref={messageDialog} />
      <LoadingDialog ref={loadingDialog} /> */}
      <ConfirmationDialog ref={confirmationDialog} />
      {userStatus === "enabled" ? (
        <EnabledUserActions />
      ) : userStatus === "disabled" ? (
        <DisabledUserActions />
      ) : (
        <div />
      )}
      <div className="col-md-6" style={{ margin: "100px", clear: "both" }}>
        <NameValueList data={userDetailsNameValueList} withPadding />
      </div>
    </div>
  );

  function EnabledUserActions() {
    return (
      <div>
        <Button
          style={{ float: "left", margin: "10px" }}
          outline
          color="danger"
          className="px-4"
          onClick={initAdminDisableAction}
        >
          Disable User
        </Button>
      </div>
    );
  }

  function DisabledUserActions() {
    return (
      <div>
        <Button
          style={{ float: "left", margin: "10px" }}
          outline
          color="success"
          className="px-4"
          onClick={initAdminEnableAction}
        >
          Enable User
        </Button>
        <Button
          style={{ float: "left", margin: "10px" }}
          outline
          color="danger"
          className="px-4"
          onClick={handleDeleteAction}
        >
          Delete User
        </Button>
      </div>
    );
  }
};

export default MemberDetails;
