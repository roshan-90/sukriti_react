import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { NameVendorList } from "../../components/DisplayLabels";
import NameValue from "../../Entity/NameValue";
import { whiteSurface } from "../../jsStyles/Style";
import { fromVendorDetails } from "../../parsers/listDataParsers";
import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import {
  executeDeleteVendorLambda,
  executelistVendorAdminsLambda,
} from "../../awsClients/vendorLambda";
import { setVendorList } from "../../store/actions/vendor-actions";
import "./VendorDetails.css";

const VendorDetails = (props) => {
  const [userDetailsNameValueList, setUserDetailsNameValueList] = useState([]);
  const messageDialog = useRef();
  const loadingDialog = useRef();
  const confirmationDialog = useRef();

  const initAdminDeleteAction = async () => {
    loadingDialog.current.showDialog();
    try {
      let vendorDetailsData = {
        vendor_name: props.user.vendor_name,
        admin: props.user.admin,
        vendor_admin: props.user.vendor_admin,
        vendor_id: props.user.vendor_id,
      };
      var result = await executeDeleteVendorLambda(
        vendorDetailsData,
        props.credentials
      );
      console.log("result", result);
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog(
        "Success",
        "User deleted successfully",
        () => {
          props.history.goBack();
        }
      );
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  const handleDeleteAction = () => {
    confirmationDialog.current.showDialog(
      "Confirm Action",
      "To delete the Vendor Details permenently, type 'DELETE' below",
      "DELETE",
      initAdminDeleteAction
    );
  };

  useEffect(() => {
    fetchAndInitVendorAdminsList();
  }, []);

  const fetchAndInitVendorAdminsList = async () => {
    loadingDialog.current.showDialog();
    try {
      var result = await executelistVendorAdminsLambda(props.credentials);
      props.setVendorList(result.vendorList);
      loadingDialog.current.closeDialog();
    } catch (err) {
      loadingDialog.current.closeDialog();
      messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  useEffect(() => {
    console.log("_memberDetails", "_restoreProps-saved", props);
    props.pushComponentProps(UiAdminDestinations.MemberDetails, props);
    return () => {
      // Cleanup logic, equivalent to componentWillUnmount
    };
  }, []);

  useEffect(() => {
    // componentDidUpdate logic
    setUserDetailsNameValueList(
      Object.keys(fromVendorDetails(props.user)).map(
        (item) => new NameValue(item, fromVendorDetails(props.user)[item])
      )
    );
  }, [props.user]);

  return (
    <div
      className="col-md-10 offset-md-2"
      style={{
        ...whiteSurface,
        width: "80%",
        margin: "auto",
        background: "white",
        marginTop: "20px",
      }}
    >
      <MessageDialog ref={messageDialog} />
      {/* <LoadingDialog ref={loadingDialog} /> */}
      <ConfirmationDialog ref={confirmationDialog} />
      <ActionButtons />
      <div style={{ margin: "50px 150px", clear: "both" }}>
        <NameVendorList data={userDetailsNameValueList} withPadding />
      </div>
    </div>
  );

  function ActionButtons() {
    return (
      <div style={{ display: "flex", margin: "0px 30px" }}>
        <div
          className="link-button"
          style={{
            marginTop: "17px",
          }}
        >
          <Link
            to={{
              pathname: "/vendor/updateVendor",
              data: props.user,
              vendorList: props.vendorList,
            }}
          >
            Update Vendor Details
          </Link>
        </div>
        <div>
          <Button
            style={{ float: "left", margin: "10px" }}
            outline
            color="danger"
            className="px-4"
            onClick={handleDeleteAction}
          >
            Delete Vendor Details
          </Button>
        </div>
      </div>
    );
  }
};

// const mapStateToProps = (state) => {
//   var lastProps = state.historyStore[UiAdminDestinations.MemberDetails];
//   if (lastProps != undefined) {
//     return lastProps;
//   }

//   return {
//     vendorList: state.vendor.vendorList,
//     credentials: state.authentication.credentials,
//   };
// };

// const mapActionsToProps = {
//   pushComponentProps: pushComponentProps,
//   setVendorList: setVendorList,
// };

export default VendorDetails;
