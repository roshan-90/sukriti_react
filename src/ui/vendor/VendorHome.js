import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import List from "../../components/lists/vendorList/List";
import { setTeamList } from "../../features/vendorSlice";
import { selectUser } from "../../features/authenticationSlice";
// import { removeComponentProps } from "../../store/actions/history-actions";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import NoDataComponent from "../../components/NoDataComponent";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { executeReadVendorLambda } from "../../awsClients/vendorLambda";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const VendorHome = () => {
  const dispatch = useDispatch();
  const teamList = useSelector((state) => state.vendor.teamList);
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);

  const messageDialog = useRef();
  // const loadingDialog = useRef();

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

  const fetchAndInitTeam = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      const result = await executeReadVendorLambda(
        user?.user?.userName,
        user?.credentials
      );
      console.log("result -:👉", result);
      console.log("vendor home data -:👉", result);
      dispatch(setTeamList({ teamList: result.teamDetails }));
    } catch (err) {
      handleError(err, "fetchAndInitTeam");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    // dispatch(removeComponentProps(UiAdminDestinations.MemberAccess));
    // dispatch(removeComponentProps(UiAdminDestinations.MemberDetails));
    fetchAndInitTeam();
  }, []);

  const Greeting = ({ teamList }) => {
    return teamList.length === 0 ? (
      <NoDataComponent />
    ) : (
      <List data={teamList} />
    );
  };

  const FooterComponent = ({ teamSize }) => {
    console.log("_footer-1", teamSize);
    return (
      <div className={"row"} style={{ margin: "0px", width: "100%" }}>
        <div
          className={"col-md-8"}
          style={{
            justifyContent: "right",
            alignItems: "right",
            float: "right",
          }}
        >
          <div className={"row-md-12"}>
            <b>Team Size: </b>
            <i>{teamSize}</i>
          </div>
        </div>
        {user.user?.userRole === "Super Admin" && (
          <div
            className={"col-md-4"}
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <Button
              onClick={() => {
                // Assuming 'history' is provided through props or other means
                navigate("/vendor/addVendorMember");
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
              }}
            >
              Add Vendor Member
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animated fadeIn" style={{ padding: "10px" }}>
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardHeader>
              <h1>Vendor Management</h1>
            </CardHeader>
            <CardBody>
              <FooterComponent teamSize={teamList?.length} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardBody>
              <Greeting teamList={teamList} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VendorHome;
