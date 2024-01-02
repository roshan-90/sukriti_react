import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  Button,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Row,
  Col,
} from "reactstrap";
import classnames from "classnames";
import RaisedTickets from "./RaisedTickets";
import QueuedTickets from "./QueuedTickets";
import AllActiveTickets from "./AllActiveTickets";
import SelfAssigned from "./SelfAssigned";
import TeamAssigned from "./TeamAssigned";
import ClosedTickets from "./ClosedTickets";
// import MessageDialog from "../../dialogs/MessageDialog";
// import LoadingDialog from "../../dialogs/LoadingDialog";
import NoDataComponent from "../../components/NoDataComponent";
import {
  executeFetchIncidenceLambda,
  UiAdminDestinations,
} from "../../awsClients/incidenceLambdas";
// import { setTicketList } from "../../store/actions/incidence-actions";
// import { removeComponentProps } from "../../store/actions/history-actions";
import { selectUser } from "../../features/authenticationSlice";
import { setTicketList, incidenceList } from "../../features/incidenceSlice";

const IncidenceHome = (props) => {
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const [ticket, setTicket] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const incidence = useSelector((state) => state.incidenece);

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  const fetchAndInitTeam = async () => {
    // props.loadingDialog.current.showDialog();
    try {
      console.log("_user", user);
      var result = await executeFetchIncidenceLambda(
        user?.username,
        user?.user.userRole,
        user?.credentials
      );
      dispatch(setTicketList({ ticketList: result }));
      setTicket(result.queuedTickets);
      console.log("IncidenceHome fetchAndInitTeam", result);
      //   props.loadingDialog.current.closeDialog();
    } catch (err) {
      //   props.loadingDialog.current.closeDialog();
      //   props.messageDialog.current.showDialog("Error Alert!", err.message);
    }
  };

  useEffect(() => {
    fetchAndInitTeam();
  }, []);

  console.log("ticketList", incidence?.ticketList);
  if (incidence == undefined) {
    return null;
  }
  const ComponentSelector = () => {
    console.log(user, "user");
    return (
      <>
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#fff",
              padding: "10px 0",
              overflowX: "scroll",
            }}
          >
            <Button
              style={{
                margin: "10px 20px",
              }}
              className={classnames(
                { active: currentActiveTab === "1" },
                "col-md-2 offset-md-2"
              )}
              onClick={() => {
                toggle("1");
              }}
              outline
              color="primary"
            >
              Raised Tickets
            </Button>
            <Button
              style={{
                margin: "10px 20px",
              }}
              className={classnames(
                {
                  active: currentActiveTab === "2",
                },
                "col-md-2 offset-md-2"
              )}
              onClick={() => {
                toggle("2");
              }}
              outline
              color="primary"
            >
              Queued Tickets
            </Button>
            {user.userRole === "Super Admin" ? (
              <>
                <Button
                  style={{
                    margin: "10px 20px",
                  }}
                  className={classnames(
                    {
                      active: currentActiveTab === "3",
                    },
                    "col-md-2 offset-md-2"
                  )}
                  onClick={() => {
                    toggle("3");
                  }}
                  outline
                  color="primary"
                >
                  Assigned Tickets
                </Button>
                <Button
                  style={{
                    margin: "10px 20px",
                  }}
                  className={classnames(
                    {
                      active: currentActiveTab === "4",
                    },
                    "col-md-2 offset-md-2"
                  )}
                  onClick={() => {
                    toggle("4");
                  }}
                  outline
                  color="primary"
                >
                  Resolved Tickets
                </Button>
              </>
            ) : (
              <>
                <Button
                  style={{
                    margin: "10px 20px",
                  }}
                  className={classnames(
                    {
                      active: currentActiveTab === "3",
                    },
                    "col-md-2 offset-md-2"
                  )}
                  onClick={() => {
                    toggle("3");
                  }}
                  outline
                  color="primary"
                >
                  Self-Assigned Tickets
                </Button>
                <Button
                  style={{
                    margin: "10px 20px",
                  }}
                  className={classnames(
                    {
                      active: currentActiveTab === "4",
                    },
                    "col-md-2 offset-md-2"
                  )}
                  onClick={() => {
                    toggle("4");
                  }}
                  outline
                  color="primary"
                >
                  Team-Assigned Tickets
                </Button>
              </>
            )}
            <Button
              style={{
                margin: "10px 20px",
              }}
              className={classnames(
                {
                  active: currentActiveTab === "5",
                },
                "col-md-2 offset-md-2"
              )}
              onClick={() => {
                toggle("5");
              }}
              outline
              color="primary"
            >
              All Active Tickets
            </Button>
            <Button
              style={{
                margin: "10px 20px",
              }}
              className={classnames(
                {
                  active: currentActiveTab === "6",
                },
                "col-md-2 offset-md-2"
              )}
              onClick={() => {
                toggle("6");
              }}
              outline
              color="primary"
            >
              Closed Tickets
            </Button>
          </div>

          <div style={{ marginTop: "30px" }}>
            <TabContent activeTab={currentActiveTab}>
              <TabPane tabId="1">
                <Row>
                  <Col sm="12">
                    <RaisedTickets
                      data={incidence?.ticketList?.allTickets}
                      name={user}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="2">
                <Row>
                  <Col sm="12">
                    <QueuedTickets
                      data={incidence?.ticketList?.queuedTickets}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="3">
                <Row>
                  <Col sm="12">
                    <SelfAssigned
                      data={incidence?.ticketList?.allTickets}
                      name={user.userName}
                      role={user.userRole}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="4">
                <Row>
                  <Col sm="12">
                    <TeamAssigned
                      data={incidence?.ticketList?.allTickets}
                      name={user.userName}
                      role={user.userRole}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="5">
                <Row>
                  <Col sm="12">
                    <AllActiveTickets
                      data={incidence?.ticketList?.allTickets}
                    />
                  </Col>
                </Row>
              </TabPane>
              <TabPane tabId="6">
                <Row>
                  <Col sm="12">
                    <ClosedTickets data={incidence?.ticketList?.allTickets} />
                  </Col>
                </Row>
              </TabPane>
            </TabContent>
          </div>
        </div>
      </>
    );
  };

  return (
    <div
      className="animated fadeIn"
      style={{
        padding: "10px",
      }}
    >
      {/* <MessageDialog ref={props.messageDialog} />
      <LoadingDialog ref={props.loadingDialog} /> */}

      <Row>
        <Col xs="12" sm="12" lg="12">
          <Card>
            <CardBody>
              <ComponentSelector />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default IncidenceHome;
