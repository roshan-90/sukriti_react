import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { NameValueList } from "../../components/DisplayLabels";
import NameValue from "../../Entity/NameValue";
import { whiteSurface } from "../../jsStyles/Style";
import { fromUserProfileDetails } from "../../parsers/listDataParsers";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import {
  executeEnableUserLambda,
  executeDisableUserLambda,
  executeDeleteUserLambda,
} from "../../awsClients/administrationLambdas";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
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
  var userDetails = fromUserProfileDetails(props?.user);
  let userDetailsNameValueList = [];
  Object.keys(userDetails).map((item, value) => {
    userDetailsNameValueList.push(NameValue(item, userDetails[item]));
  });

  const confirmationDialog = useRef();


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
      <div className="col-md-6" style={{ margin: "100px", clear: "both" }}>
        <NameValueList data={userDetailsNameValueList} withPadding />
      </div>
    </div>
  );
};

export default MemberDetails;
