import React, { useEffect, useRef } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import List from "../../components/lists/userLists/Lists";
// import { removeComponentProps } from "../../store/actions/history-actions";
import { executelistTeamLambda } from "../../awsClients/administrationLambdas";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import NoDataComponent from "../../components/NoDataComponent";
import { UiAdminDestinations } from "../../nomenclature/nomenclature";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { setTeamList } from "../../features/adminstrationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";

const AdministrationHome = (props) => {
  //   const mDataSummaryComponent = useRef();
  //   const messageDialog = useRef();
  //   const loadingDialog = useRef();
  const navigate = useNavigate(); // Access the navigate function
  const user = useSelector(selectUser);
  const teamList = useSelector((state) => state.adminstration.teamList);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);

  console.log("sdf-->", user?.username);

  const fetchAndInitTeam = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistTeamLambda(
        user?.username,
        user?.credentials
      );
      console.log("result--->", result);
      dispatch(setTeamList(result.teamDetails));
    } catch (err) {
      //   loadingDialog.current.closeDialog();
      //   messageDialog.current.showDialog("Error Alert!", err.message);
      console.log("error");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    // props.removeComponentProps(UiAdminDestinations.MemberAccess);
    // props.removeComponentProps(UiAdminDestinations.MemberDetails);
    fetchAndInitTeam();
  }, []);

  console.log("teamList---->", teamList);
  const Greeting = ({ teamList }) => {
    if (teamList.length === 0) {
      return <NoDataComponent />;
    }
    return <List data={teamList} />;
  };

  const FooterComponent = ({ teamSize }) => {
    console.log("_footer", teamSize);
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
        {/* {props.user.userRole === "Super Admin" ? (
          <div
            className={"col-md-4"}
            style={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              onClick={() => {
                navigate("/administration/addTeamMember");
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
              }}
            >
              Add Team Member
            </Button>
            <Button
              onClick={() => {
                navigate("/administration/grantPermissions");
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
              }}
            >
              Grant Permission
            </Button>
          </div>
        ) : (
          <div className={"col-md-4"}>
            <Button
              onClick={() => {
                navigate("/administration/addTeamMember");
              }}
              outline
              color="primary"
              className="px-4"
              style={{
                float: "right",
              }}
            >
              Add Team Member
            </Button>
          </div>
        )} */}
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
      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardHeader>
              <h1>Administration</h1>
            </CardHeader>
            <CardBody>
              <FooterComponent teamSize={teamList.length} />
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

export default AdministrationHome;
