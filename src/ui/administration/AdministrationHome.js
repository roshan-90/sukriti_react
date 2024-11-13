import React, { useState, useEffect, useRef } from "react";
import { Card, CardBody, CardHeader, Col, Row, Button } from "reactstrap";
import List from "../../components/lists/userLists/Lists";
import { executelistTeamLambda } from "../../awsClients/administrationLambdas";
import NoDataComponent from "../../components/NoDataComponent";
import { useNavigate } from "react-router-dom";
import { selectUser } from "../../features/authenticationSlice";
import { useDispatch, useSelector } from "react-redux";
import { setTeamList } from "../../features/adminstrationSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure

const AdministrationHome = () => {

  const navigate = useNavigate(); // Access the navigate function
  const user = useSelector(selectUser);
  const teamList = useSelector((state) => state.adminstration.teamList);
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.loading.isLoading);
  const [dialogData, setDialogData] = useState(null);

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

  const fetchAndInitTeam = async () => {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var result = await executelistTeamLambda(
        user?.username,
        user?.credentials
      );
      dispatch(setTeamList(result.teamDetails));
    } catch (err) {
      handleError(err, "fetchAndInitTeam");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  useEffect(() => {
    fetchAndInitTeam();
  }, []);

  const Greeting = ({ teamList }) => {
    if (teamList.length === 0) {
      return <NoDataComponent />;
    }
    return <List data={teamList} />;
  };

  const FooterComponent = ({ teamSize }) => {
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
        {user?.user?.userRole === "Super Admin" ? (
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
