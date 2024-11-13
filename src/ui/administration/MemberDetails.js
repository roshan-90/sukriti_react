import React, { useEffect, useRef, useState } from "react";
import { Button } from "reactstrap";
import { NameValueList } from "../../components/DisplayLabels";
import NameValue from "../../Entity/NameValue";
import { whiteSurface } from "../../jsStyles/Style";
import { fromUserDetails } from "../../parsers/listDataParsers";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import {
  executeEnableUserLambda,
  executeDisableUserLambda,
  executeDeleteUserLambda,
} from "../../awsClients/administrationLambdas";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/authenticationSlice";

const MemberDetails = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const user = useSelector(selectUser);
  const [dialogData, setDialogData] = useState(null);
  const [userStatus, setUserStatus] = useState(
    props?.user?.enabled ? "enabled" : "disabled"
  );
  var userDetails = fromUserDetails(props?.user);
  let userDetailsNameValueList = [];

  Object.keys(userDetails).map((item, value) => {
    userDetailsNameValueList.push(NameValue(item, userDetails[item]));
  });

  const confirmationDialog = useRef();

  const handleError = (err, Custommessage, onclick = null) => {
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

  const initAdminDisableAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeDisableUserLambda(
        props.user.userName,
        user?.credentials
      );
      setUserStatus("disabled");
    } catch (err) {
        handleError(err, "initAdminDisableAction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const initAdminEnableAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeEnableUserLambda(
        props.user.userName,
        user?.credentials
      );
      setUserStatus("enabled");
    } catch (err) {
      handleError(err, "initAdminEnableAction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
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
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeDeleteUserLambda(
        props.user.userName,
        user?.credentials
      );
      setDialogData({
        title: "Success",
        message: "User deleted successfully",
        onClickAction: () => {
          navigate("/administration");
          // Handle the action when the user clicks OK
          console.log("initAdminDeleteAction:->");
        },
      });
    } catch (err) {
      handleError(err, "initAdminDeleteAction");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    return () => {
      console.log("_memberDetails", "_restoreProps-saved", props);
    };
  }, []);

  return (
    <div
      className="col-md-10 offset-md-2"
      style={{ ...whiteSurface, width: "80%", margin: "auto" }}
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
