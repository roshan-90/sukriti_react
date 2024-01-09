import React, { useCallback, useState, useEffect, useRef } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { NameVendorList } from "../../components/DisplayLabels";
import NameValue from "../../Entity/NameValue";
import { whiteSurface } from "../../jsStyles/Style";
import { fromVendorDetails } from "../../parsers/listDataParsers";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog";
import ConfirmationDialog from "../../dialogs/ConfirmationDialog";
// import { pushComponentProps } from "../../store/actions/history-actions";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import {
  executeDeleteVendorLambda,
  executelistVendorAdminsLambda,
} from "../../awsClients/vendorLambda";
import { setVendorList } from "../../features/vendorSlice";
import "./VendorDetails.css";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../features/authenticationSlice";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { setTeamList } from "../../features/vendorSlice";
import { executeReadVendorLambda } from "../../awsClients/vendorLambda";

const VendorDetails = (props) => {
  const { id } = useParams();
  const [userDetailsNameValueList, setUserDetailsNameValueList] = useState([]);
  const messageDialog = useRef();
  const confirmationDialog = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const user = useSelector(selectUser);
  const vendorList = useSelector((state) => state.vendor.vendorList);

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
      let [teamList] = result.teamDetails.filter(
        (data) => data?.vendor_name === id
      );
      setUserDetailsNameValueList(
        Object.keys(fromVendorDetails(teamList)).map((item) =>
          NameValue(item, fromVendorDetails(teamList)[item])
        )
      );
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("fetchDashboardData Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("fetchAndInitClientList Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  }, [dispatch, executeReadVendorLambda, user]);

  useEffect(() => {
    fetchAndInitTeam();
    console.log("_memberDetails", "_restoreProps-saved");
    // props.pushComponentProps(UiAdminDestinations.MemberDetails, props);
    return () => {
      // Cleanup logic, equivalent to componentWillUnmount
      console.log("teamlist in vendordetail");
    };
  }, []);

  const initAdminDeleteAction = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      let vendorDetailsData = {
        vendor_name: props.user.vendor_name,
        admin: props.user.admin,
        vendor_admin: props.user.vendor_admin,
        vendor_id: props.user.vendor_id,
      };
      var result = await executeDeleteVendorLambda(
        vendorDetailsData,
        user?.credentials
      );
      console.log("result", result);
      console.log("executeDeleteVendorLambda -->", result);
      setDialogData({
        title: "Success",
        message: "User deleted successfully",
        onClickAction: () => {
          navigate("/vendor");
          // Handle the action when the user clicks OK
          console.log("initAdminDeleteAction onclicked:->");
        },
      });
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("executeDeleteVendorLambda Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("executeDeleteVendorLambda Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const handleDeleteAction = () => {
    setTimeout(() => {
      confirmationDialog.current.showDialog(
        "Confirm Action",
        "To delete the Vendor Details permanently, type 'DELETE' below",
        "DELETE",
        initAdminDeleteAction
      );
    }, 0);
  };

  useEffect(() => {
    fetchAndInitVendorAdminsList();
  }, []);

  const fetchAndInitVendorAdminsList = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistVendorAdminsLambda(user?.credentials);
      console.log("executelistVendorAdminsLambda -->");
      dispatch(setVendorList({ vendorList: result.vendorList }));
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("fetchAndInitVendorAdminsList Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("fetchAndInitVendorAdminsList Error", err);
          },
        });
      }
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  // useEffect(() => {
  //   // componentDidUpdate logic
  //   setUserDetailsNameValueList(
  //     Object.keys(fromVendorDetails(teamList)).map((item) =>
  //       NameValue(item, fromVendorDetails(teamList)[item])
  //     )
  //   );
  // }, [props.user]);

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
              pathname: `/vendor/updateVendor/${props.user?.vendor_name}`,
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
