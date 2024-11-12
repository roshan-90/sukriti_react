import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import {
  TabContent,
  TabPane,
  Row,
  Col,
  Button,
  Input,
  InputGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  InputGroupText,
  Form,
} from "reactstrap";
import classnames from "classnames";
import { dashboardStyle, whiteSurface, colorTheme } from "../../jsStyles/Style";
import {
  getListingS3,
  executeTicketActionLambda,
  executeProgressLambda,
  executeFetchTeamListLambda,
} from "../../awsClients/incidenceLambdas";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import CircularProgress from "@mui/material/CircularProgress";
import moment from "moment";
import { useParams, useLocation } from "react-router-dom";
import { selectUser } from "../../features/authenticationSlice";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { useDispatch, useSelector } from "react-redux";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { setTicketList, incidenceList } from "../../features/incidenceSlice";
import { executeFetchIncidenceLambda } from "../../awsClients/incidenceLambdas";
function IncidenceTicketDetails(props) {
  const dispatch = useDispatch();
  const { id_name } = useParams();
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const allTickets = useSelector(incidenceList);

  const user = useSelector(selectUser);

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
      console.log("_user", user);
      var result = await executeFetchIncidenceLambda(
        user?.username,
        user?.user.userRole,
        user?.credentials
      );
      dispatch(setTicketList({ ticketList: result }));
      console.log("IncidenceHome fetchAndInitTeam", result);
      //   props.loadingDialog.current.closeDialog();
    } catch (err) {
      handleError(err, "fetchAndInitTeam");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  if (
    allTickets == null ||
    allTickets == undefined ||
    Object.keys(allTickets).length === 0
  ) {
    console.log("start wore");
    fetchAndInitTeam();
  }

  const jsonString = allTickets?.allTickets
    ? JSON.parse(allTickets.allTickets)
    : null;
  let filteredTicket;
  if (jsonString) {
    // Your existing code for handling the parsed JSON
    [filteredTicket] = jsonString.filter(
      (ticket) => ticket?.ticket_id === id_name
    );
    // ... rest of the code
  } else {
    console.log("allTickets?.allTickets is undefined or not a valid JSON");
    // Handle the case where allTickets?.allTickets is undefined or not a valid JSON
  }
  const location = useLocation();
  console.log(location, "DATA_DATA_DATA");
  const complex = filteredTicket?.ticket_id;
  const title = filteredTicket?.title;
  const status = filteredTicket?.ticket_status;
  const priority = filteredTicket?.criticality;
  const name = filteredTicket?.complex_name;
  const state = filteredTicket?.state_code;
  const district = filteredTicket?.district_name;
  const city = filteredTicket?.city_name;
  const role = filteredTicket?.creator_role;
  const id = filteredTicket?.creator_id;
  const timestamp = filteredTicket?.timestamp;
  const comment = filteredTicket?.assignment_comment;
  const data = filteredTicket;

  console.log("data is getting", {
    complex,
    title,
    status,
    priority,
    name,
    state,
    district,
    city,
    role,
    timestamp,
    comment,
    data,
  });
  let result;
  const s3Url = "https://mis-ticket-files.s3.ap-south-1.amazonaws.com";
  const [currentActiveTab, setCurrentActiveTab] = useState("1");
  const messageDialog = React.createRef();
  const loadingDialog = React.createRef();
  const [modal, setModal] = useState(false);
  const [modalShow, setModalShow] = useState("");
  const [ticketAction, setTicketAction] = useState("");
  const [progressData, setProgressData] = useState();
  const [teamList, setTeamList] = useState();
  const date = new Date(parseInt(timestamp));
  const [seniority, setSeniority] = useState();

  const getVendorSideSeniority = (role) => {
    let superAdmin = "Super Admin";
    let VendorAdmin = "Vendor Admin";
    let VendorManager = "Vendor Manager";
    if (superAdmin === role) return 3;
    if (VendorAdmin === role) return 2;
    if (VendorManager === role) return 1;
    else return 0;
  };

  const getClientSideSeniority = (user) => {
    let superAdmin = "Super Admin";
    let ClientSuperAdmin = "Client Super Admin";
    let ClientAdmin = "Client Admin";
    let ClientManager = "Client Manager";
    if (superAdmin === user.userRole) return 4;
    if (ClientSuperAdmin === user.userRole) return 3;
    if (ClientAdmin === user.userRole) return 2;
    if (ClientManager === user.userRole) return 1;
    else return 0;
  };

  const isSeniorToLead = (data, user) => {
    const ticketLeadSeniority = getVendorSideSeniority(data?.lead_role);
    const userSeniority = getVendorSideSeniority(user.userRole);
    result = userSeniority > ticketLeadSeniority;
    setSeniority(result);
    return result;
  };

  const isSeniorToCreator = (role, user) => {
    let ClientSuperAdmin = "Client Super Admin";
    let ClientAdmin = "Client Admin";
    let ClientManager = "Client Manager";
    if (ClientSuperAdmin === role) {
      const ticketCreatorSeniority = getClientSideSeniority(role);
      const userSeniority = getClientSideSeniority(user.userRole);
      result = userSeniority > ticketCreatorSeniority;
      setSeniority(result);
      return result;
    } else if (ClientManager === role) {
      const ticketCreatorSeniority = getClientSideSeniority(role);
      const userSeniority = getClientSideSeniority(user.userRole);
      result = userSeniority > ticketCreatorSeniority;
      setSeniority(result);
      return result;
    } else if (ClientAdmin === role) {
      const ticketCreatorSeniority = getClientSideSeniority(role);
      const userSeniority = getClientSideSeniority(user.userRole);
      result = userSeniority > ticketCreatorSeniority;
      setSeniority(result);
      return result;
    } else {
      const ticketCreatorSeniority = getVendorSideSeniority(role);
      const userSeniority = getVendorSideSeniority(user.userRole);
      result = userSeniority > ticketCreatorSeniority;
      setSeniority(result);
      return result;
    }
  };
  console.log(seniority, "userSeniority > ticketLeadSeniority");

  const toggle = (tab) => {
    if (currentActiveTab !== tab) setCurrentActiveTab(tab);
  };

  const [image, setImage] = useState([]);
  async function executeGetImage() {
    
    if(complex == null || complex == undefined) {
      let fileName = await getListingS3(id_name, user?.credentials);
      setImage(fileName);
    } else {
      let fileName = await getListingS3(complex, user?.credentials);
      setImage(fileName);
    }
  }

  useEffect(() => {
    executeGetImage();
  }, []);

  const popUp = () => {
    if (modal === false) {
      setModal(true);
    } else {
      setModal(false);
    }
  };

  async function initCreateTicketRequest(createUserRequest) {
    dispatch(startLoading()); // Dispatch the startLoading action
    try {
      var requestCopy = { ...createUserRequest };
      await executeTicketActionLambda(requestCopy, user?.credentials);
      setDialogData({
        title: "Progress Submitted",
        message: "Ticket Progress successfully submitted",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log("Progress Submitted :->");
        },
      });
    } catch (err) {
      handleError(err, "initCreateTicketRequest");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
    setModal(false);
  }
  async function initProgressRequest() {
    try {
      let result = await executeProgressLambda(complex, user?.credentials);
      let teamList = await executeFetchTeamListLambda(data, user?.credentials);
      setProgressData(result.ticketProgressList);
      setTeamList(teamList.ticketTeamList);
    } catch (err) {}
  }

  const assignment = (e) => {
    setTicketAction(e.target.value);
    if (e.target.value === "Assign Ticket") {
      setModalShow(e.target.value);
      if (modal === false) {
        setModal(true);
      } else {
        setModal(false);
      }
    } else if (e.target.value === "Accept Ticket") {
      setModalShow(e.target.value);
      if (modal === false) {
        setModal(true);
      } else {
        setModal(false);
      }
    } else if (e.target.value === "Mark Resolved") {
      setModalShow(e.target.value);
      if (modal === false) {
        setModal(true);
      } else {
        setModal(false);
      }
    } else if (e.target.value === "Submit Progress") {
      setModalShow(e.target.value);
      if (modal === false) {
        setModal(true);
      } else {
        setModal(false);
      }
    } else if (e.target.value === "Mark Closed") {
      setModalShow(e.target.value);
      if (modal === false) {
        setModal(true);
      } else {
        setModal(false);
      }
    }
  };

  // Resolved
  const [userSelect, setUserSelect] = useState();
  const assignment2 = (e) => {
    const data = e.target.value;
    const assignTicket = data.split(",");
    setUserSelect(assignTicket);
  };
  let AcceptDetails = {
    userId: id,
    userRole: role,
    ticketId: complex,
    currentTicketStatus: status,
    actionName: ticketAction,
    actionCode:
      ticketAction === "Accept Ticket"
        ? 1
        : ticketAction === "Assign Ticket"
        ? 2
        : ticketAction === "Submit Progress"
        ? 3
        : ticketAction === "Mark Resolved"
        ? 4
        : ticketAction === "Mark Closed"
        ? 5
        : ticketAction === "Re-Open Ticket"
        ? 6
        : "",
    comment: "",
    assigneeId: data?.lead_id
      ? data?.lead_id
      : !data?.lead_id && id && !userSelect
      ? id
      : !data?.lead_id && id && userSelect
      ? userSelect[0]
      : "",
    assigneeRole: data?.lead_role
      ? data?.lead_role
      : !data?.lead_role && role && !userSelect
      ? role
      : !data?.lead_role && role && userSelect
      ? userSelect[1]
      : "",
  };

  const onSubmit = () => {
    if (modalShow === "Assign Ticket") {
      if (AcceptDetails.title !== "assign lead") {
        setDialogData({
          title: "Validation Error",
          message: "Type 'assign lead' to accept ticket lead role.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("onSubmit Error");
          },
        });
      } else if (AcceptDetails.comment === "") {
        setDialogData({
          title: "Validation Error",
          message: "A comment describing your intent is mandatory.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("onSubmit Error");
          },
        });
      } else {
        initCreateTicketRequest(AcceptDetails);
      }
    } else if (modalShow === "Accept Ticket") {
      if (AcceptDetails.title !== "accept lead") {
        setDialogData({
          title: "Validation Error",
          message: "Type 'accept lead' to accept ticket lead role.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else if (AcceptDetails.comment === "") {
        setDialogData({
          title: "Validation Error",
          message: "A comment describing your intent is mandatory.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else {
        initCreateTicketRequest(AcceptDetails);
      }
    } else if (modalShow === "Mark Resolved") {
      if (AcceptDetails.title !== "mark resolved") {
        setDialogData({
          title: "Validation Error",
          message: "Type 'mark resolved' to accept ticket lead role.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else if (AcceptDetails.comment === "") {
        setDialogData({
          title: "Validation Error",
          message: "A comment describing your intent is mandatory.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else {
        initCreateTicketRequest(AcceptDetails);
      }
    } else if (modalShow === "Submit Progress") {
      if (AcceptDetails.comment === "") {
        setDialogData({
          title: "Validation Error",
          message: "A comment describing your intent is mandatory.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else {
        initCreateTicketRequest(AcceptDetails);
      }
    } else if (modalShow === "Mark Closed") {
      if (AcceptDetails.title !== "close ticket") {
        setDialogData({
          title: "Validation Error",
          message: "Type 'close ticket' to accept ticket lead role.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else if (AcceptDetails.comment === "") {
        setDialogData({
          title: "Validation Error",
          message: "A comment describing your intent is mandatory.",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("modalShow Error");
          },
        });
      } else {
        initCreateTicketRequest(AcceptDetails);
      }
    }
  };

  useEffect(() => {
    initProgressRequest();
    isSeniorToLead(data, user);
    isSeniorToCreator(role, user);
  }, []);

  const displayData = eval(progressData);
  const teamData = eval(teamList);
  console.log(
    id === data?.lead_id && user.userRole === role,
    "id === data.lead_id && user.userRole === role"
  );
  console.log(id === data?.lead_id, "id === data.lead_id ");
  console.log(data?.lead_id, "data.lead_id  ");
  console.log(id, "id  ");
  console.log(user.userRole, "user.userRole  ");
  console.log(user.userName, "user.userRole  ");
  console.log(role, " role ");

  return (
    <div
      className="animated fadeIn"
      style={{
        padding: "10px 0",
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#fff",
          padding: "10px 0",
        }}
        className="scrollbar-hidden"
      >
        <Button
          style={{
            margin: "0 20px",
          }}
          className={classnames(
            {
              active: currentActiveTab === "1",
            },
            "col-md-2 offset-md-2"
          )}
          onClick={() => {
            toggle("1");
          }}
          outline
          color="primary"
        >
          DETAILS
        </Button>
        <Button
          className={classnames(
            {
              active: currentActiveTab === "2",
            },
            "col-md-2 offset-md-2"
          )}
          style={{
            margin: "0 20px",
          }}
          onClick={() => {
            toggle("2");
          }}
          outline
          color="primary"
        >
          PROGRESS
        </Button>
      </div>

      <div
        style={{
          padding: "10px 0",
        }}
      >
        <TabContent activeTab={currentActiveTab}>
          <TabPane tabId="1">
            <Row>
              <Col sm="12">
                <div style={{}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: colorTheme.primary,
                      height: "60px",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        // alignItems: "center",
                        // justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "15px",
                          height: "15px",
                          background: "red",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                      ></div>
                      <div>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                            marginLeft: "25px",
                            marginBottom: "-2px",
                          }}
                        >
                          {complex}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                            marginLeft: "25px",
                          }}
                        >
                          {title}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            ...dashboardStyle.titleblack,
                            marginTop: "-10px",
                            marginBottom: "-2px",
                          }}
                        >
                          Status :
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                            marginBottom: "inherit",
                          }}
                        >
                          &nbsp;{status}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            ...dashboardStyle.titleblack,
                            marginTop: "-10px",
                            marginBottom: "-2px",
                          }}
                        >
                          Priority :
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                          }}
                        >
                          &nbsp;{priority}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      Location
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {name}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {state} : {district}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {city}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      Created
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {role}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {id}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {moment(date).fromNow()}
                    </p>
                  </div>
                </div>

                <div
                  style={{
                    ...whiteSurface,
                    background: "white",
                    margin: "20px 10px 0px 10px",
                    padding: "10px",
                  }}
                >
                  <div style={{ ...dashboardStyle.itemDescriprtion }}>
                    <div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <p
                          style={{
                            ...dashboardStyle.titleblack,
                          }}
                          className="text-muted"
                        >
                          Summary
                        </p>
                        {status === "Closed" ? null : user.userRole ===
                          "Super Admin" ? (
                          <>
                            <Input
                              type="select"
                              style={{
                                width: "auto",
                                float: "right",
                                margin: "10px 0",
                              }}
                              onChange={assignment}
                            >
                              <option selected hidden disabled value="">
                                Select Action
                              </option>

                              {status === "Queued" ? (
                                <>
                                  <option value="Assign Ticket">
                                    Assign Ticket
                                  </option>
                                  <option value="Accept Ticket">
                                    Accept Ticket
                                  </option>
                                </>
                              ) : status === "Assigned" || status === "Open" ? (
                                <>
                                  <option value="Mark Resolved">
                                    Mark Resolved
                                  </option>
                                  <option value="Submit Progress">
                                    Submit Progress
                                  </option>
                                </>
                              ) : (
                                status === "Resolved" && (
                                  <>
                                    <option value="Mark Closed">
                                      Mark Closed
                                    </option>
                                  </>
                                )
                              )}
                            </Input>
                          </>
                        ) : user.userName === data?.lead_id ? (
                          <>
                            <Input
                              type="select"
                              style={{
                                width: "auto",
                                float: "right",
                                margin: "10px 0",
                              }}
                              onChange={assignment}
                            >
                              <option selected hidden disabled value="">
                                Select Action
                              </option>

                              {status === "Queued" ? (
                                <>
                                  <option value="Assign Ticket">
                                    Assign Ticket
                                  </option>
                                  <option value="Accept Ticket">
                                    Accept Ticket
                                  </option>
                                </>
                              ) : status === "Assigned" || status === "Open" ? (
                                <>
                                  <option value="Mark Resolved">
                                    Mark Resolved
                                  </option>
                                  <option value="Submit Progress">
                                    Submit Progress
                                  </option>
                                </>
                              ) : (
                                status === "Resolved" && (
                                  <>
                                    <option value="Mark Closed">
                                      Mark Closed
                                    </option>
                                  </>
                                )
                              )}
                            </Input>
                          </>
                        ) : seniority ? (
                          <>
                            <Input
                              type="select"
                              style={{
                                width: "auto",
                                float: "right",
                                margin: "10px 0",
                              }}
                              onChange={assignment}
                            >
                              <option selected hidden disabled value="">
                                Select Action
                              </option>

                              {status === "Queued" ? (
                                <>
                                  <option value="Assign Ticket">
                                    Assign Ticket
                                  </option>
                                  <option value="Accept Ticket">
                                    Accept Ticket
                                  </option>
                                </>
                              ) : status === "Assigned" || status === "Open" ? (
                                <>
                                  <option value="Mark Resolved">
                                    Mark Resolved
                                  </option>
                                  <option value="Submit Progress">
                                    Submit Progress
                                  </option>
                                </>
                              ) : (
                                status === "Resolved" && (
                                  <>
                                    <option value="Mark Closed">
                                      Mark Closed
                                    </option>
                                  </>
                                )
                              )}
                            </Input>
                          </>
                        ) : (
                          status === "Queued" && (
                            <>
                              <Input
                                type="select"
                                style={{
                                  width: "auto",
                                  float: "right",
                                  margin: "10px 0",
                                }}
                                onChange={assignment}
                              >
                                <option selected hidden disabled value="">
                                  Select Action
                                </option>

                                <>
                                  <option value="Assign Ticket">
                                    Assign Ticket
                                  </option>
                                  <option value="Accept Ticket">
                                    Accept Ticket
                                  </option>
                                </>
                              </Input>
                            </>
                          )
                        )}
                      </div>

                      <div>
                        <InputGroup className="mb-3">
                          <Input
                            type="text"
                            placeholder="Title"
                            value={title}
                          />
                        </InputGroup>

                        <InputGroup className="mb-4">
                          <Input
                            type="text"
                            placeholder="comment"
                            value={comment}
                          />
                        </InputGroup>
                      </div>
                    </div>
                  </div>
                </div>
                {image && image.length > 0 ? (
                  <div
                    style={{
                      ...whiteSurface,
                      background: "white",
                      margin: "20px 10px 0px 10px",
                      padding: "10px",
                    }}
                  >
                    <div style={{ ...dashboardStyle.itemDescriprtion }}>
                      <div>
                        <p className="text-muted">Photos</p>
                        {image.map((item, index) => (
                          <img
                            key={index}
                            style={{
                              ...whiteSurface,
                              background: "white",
                              width: "200px",
                              height: "200px",
                              margin: "10px",
                              borderRadius: "10px",
                              border: "5px solid white",
                            }}
                            src={s3Url + "/" + item}
                            alt="image-"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="12">
                <div style={{}}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      background: colorTheme.primary,
                      height: "60px",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        // alignItems: "center",
                        // justifyContent: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "15px",
                          height: "15px",
                          background: "red",
                          borderRadius: "10px",
                          marginTop: "10px",
                        }}
                      ></div>
                      <div>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                            marginLeft: "25px",
                            marginBottom: "-2px",
                          }}
                        >
                          {complex}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                            marginLeft: "25px",
                          }}
                        >
                          {title}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            ...dashboardStyle.titleblack,
                            marginTop: "-10px",
                            marginBottom: "-2px",
                          }}
                        >
                          Status :
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                            marginBottom: "inherit",
                          }}
                        >
                          &nbsp;{status}
                        </p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "baseline",
                          justifyContent: "center",
                        }}
                      >
                        <p
                          style={{
                            ...dashboardStyle.titleblack,
                            marginTop: "-10px",
                            marginBottom: "-2px",
                          }}
                        >
                          Priority :
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtionBold2,
                          }}
                        >
                          &nbsp;{priority}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <div>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      Location
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {name}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {state} : {district}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {city}
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      Created
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {role}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {id}
                    </p>
                    <p
                      style={{
                        ...dashboardStyle.titleblack,
                        margin: "auto",
                      }}
                    >
                      {moment(date).fromNow()}
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "10px",
                  }}
                >
                  <h4>Progress</h4>
                </div>
                {displayData &&
                  displayData !== undefined &&
                  displayData.length !== 0 &&
                  displayData.map((item, index) => {
                    const date2 = new Date(parseInt(item.timestamp));
                    return (
                      <>
                        <div
                          style={{
                            ...whiteSurface,
                            background: "white",
                            margin: "20px 10px 0px 10px",
                            padding: "10px",
                          }}
                        >
                          <div style={{ ...dashboardStyle.itemDescriprtion }}>
                            <div>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                }}
                              >
                                <div>
                                  <p
                                    style={{
                                      margin: "auto",
                                      ...dashboardStyle.titleblack,
                                    }}
                                    className="text-muted"
                                  >
                                    Event:&ensp;
                                    <span
                                      style={{
                                        ...dashboardStyle.itemDescriprtionBold2,
                                        fontStyle: "normal",
                                      }}
                                    >
                                      {item.event}
                                    </span>
                                  </p>
                                  <p
                                    style={{
                                      margin: "auto",
                                      fontStyle: "normal",
                                      ...dashboardStyle.titleblack,
                                    }}
                                    className="text-muted"
                                  >
                                    {item.current_status === "Raised"
                                      ? "Ticket was raise with malfunction details"
                                      : item.current_status === "Assigned"
                                      ? "A lead was assigned to the ticket"
                                      : item.current_status === "opened"
                                      ? "Ticket marked open. First activity recorded from the team"
                                      : item.current_status === "Resolved"
                                      ? "The issue was reported to be resolved by the team"
                                      : item.current_status === "Closed" &&
                                        "The resolution was accepted and this ticket has been closed"}
                                  </p>
                                </div>
                                <div>
                                  <p
                                    style={{
                                      ...dashboardStyle.titleblack,
                                      margin: "auto",
                                    }}
                                    className="text-muted"
                                  >
                                    {moment(date2).fromNow()}
                                  </p>
                                  <p
                                    style={{
                                      ...dashboardStyle.titleblack,
                                      margin: "auto",
                                    }}
                                    className="text-muted"
                                  >
                                    {item.user_role}
                                  </p>
                                  <p
                                    style={{
                                      ...dashboardStyle.titleblack,
                                      margin: "auto",
                                    }}
                                    className="text-muted"
                                  >
                                    {item.user_id}
                                  </p>
                                </div>
                              </div>
                              <div>
                                <p
                                  style={{
                                    margin: "auto",
                                    ...dashboardStyle.itemDescriprtionBold2,
                                    fontStyle: "normal",
                                  }}
                                >
                                  Comments
                                </p>
                                <InputGroup className="mb-4">
                                  <Input
                                    type="text"
                                    placeholder="Comments"
                                    value={item.comments}
                                  />
                                </InputGroup>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
      <div>
        {/* Modal For Details */}
        <Modal
          isOpen={modal}
          toggle={popUp}
          className={"modal-la"}
          style={{ maxWidth: "fit-content", with: "700px", marginTop: "100px" }}
        >
          {modalShow === "Assign Ticket" ? (
            <>
              <ModalHeader
                style={{
                  background: "#5DC0A6",
                  color: `white`,
                  padding: "20px",
                }}
                toggle={popUp}
              >
                Assign Ticket
              </ModalHeader>
              <ModalBody
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <div>
                  <p
                    style={{
                      ...dashboardStyle.itemTitleBa,
                      textAlign: "center",
                    }}
                  >
                    To assign the ticket to the selected member type 'assign
                    lead' in confirm action slot. You can also provide comments
                    to update the creator.
                  </p>
                  <Form>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <LockOutlinedIcon />{" "}
                      </InputGroupText>
                      <Input type="select" onChange={assignment2}>
                        <option selected hidden disabled value="">
                          User
                        </option>
                        {teamData &&
                          teamData !== undefined &&
                          teamData.length !== 0 &&
                          teamData.map((item, index) => {
                            return (
                              <>
                                {item.user !== id ? (
                                  <>
                                    <option value={[item.user, item.role]}>
                                      {item.user} : {item.role}
                                    </option>
                                  </>
                                ) : (
                                  ""
                                )}
                              </>
                            );
                          })}
                      </Input>
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <LockOutlinedIcon />{" "}
                      </InputGroupText>
                      <Input
                        type="textarea"
                        placeholder="Description"
                        onChange={(event) =>
                          (AcceptDetails.comment = event.target.value)
                        }
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupText>
                        <PersonOutlineOutlinedIcon />
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Valid Action"
                        onChange={(event) =>
                          (AcceptDetails.title = event.target.value)
                        }
                      />
                    </InputGroup>
                  </Form>
                </div>
              </ModalBody>
            </>
          ) : modalShow === "Accept Ticket" ? (
            <>
              <ModalHeader
                style={{ background: "#5DC0A6", color: `white` }}
                toggle={popUp}
              >
                Accept Ticket
              </ModalHeader>
              <ModalBody
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <div>
                  <p
                    style={{
                      ...dashboardStyle.itemTitleBa,
                      textAlign: "center",
                    }}
                  >
                    To accept 'Lead' role for htis ticket type 'accept lead' in
                    confirm action slot. You can also provide comments to update
                    the creator
                  </p>
                  <Form>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <LockOutlinedIcon />{" "}
                      </InputGroupText>
                      <Input
                        type="textarea"
                        placeholder="Description"
                        onChange={(event) =>
                          (AcceptDetails.comment = event.target.value)
                        }
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupText>
                        <PersonOutlineOutlinedIcon />
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Valid Action"
                        onChange={(event) =>
                          (AcceptDetails.title = event.target.value)
                        }
                      />
                    </InputGroup>
                  </Form>
                </div>
              </ModalBody>
            </>
          ) : modalShow === "Mark Resolved" ? (
            <>
              <ModalHeader
                style={{ background: "#5DC0A6", color: `white` }}
                toggle={popUp}
              >
                Mark Resolved
              </ModalHeader>
              <ModalBody
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <div>
                  <p
                    style={{
                      ...dashboardStyle.itemTitleBa,
                      textAlign: "center",
                    }}
                  >
                    To mark the ticket 'Resolved', type 'mark resolved' in
                    confirm action slot. You can also provide comments to update
                    the creator
                  </p>
                  <Form>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <LockOutlinedIcon />{" "}
                      </InputGroupText>
                      <Input
                        type="textarea"
                        placeholder="Description"
                        onChange={(event) =>
                          (AcceptDetails.comment = event.target.value)
                        }
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupText>
                        <PersonOutlineOutlinedIcon />
                      </InputGroupText>
                      <Input
                        type="text"
                        placeholder="Valid Action"
                        onChange={(event) =>
                          (AcceptDetails.title = event.target.value)
                        }
                      />
                    </InputGroup>
                  </Form>
                </div>
              </ModalBody>
            </>
          ) : modalShow === "Submit Progress" ? (
            <>
              <ModalHeader
                style={{ background: "#5DC0A6", color: `white` }}
                toggle={popUp}
              >
                Submit Progress
              </ModalHeader>
              <ModalBody
                style={{
                  width: "100%",
                  height: "400px",
                }}
              >
                <div>
                  <p
                    style={{
                      ...dashboardStyle.itemTitleBa,
                      textAlign: "center",
                    }}
                  >
                    Provide ticket progress comments to update the creator.
                  </p>
                  <Form>
                    <InputGroup className="mb-4">
                      <InputGroupText>
                        <LockOutlinedIcon />{" "}
                      </InputGroupText>
                      <Input
                        type="textarea"
                        placeholder="Description"
                        onChange={(event) =>
                          (AcceptDetails.comment = event.target.value)
                        }
                      />
                    </InputGroup>
                  </Form>
                </div>
              </ModalBody>
            </>
          ) : (
            modalShow === "Mark Closed" && (
              <>
                <ModalHeader
                  style={{ background: "#5DC0A6", color: `white` }}
                  toggle={popUp}
                >
                  Mark Closed
                </ModalHeader>
                <ModalBody
                  style={{
                    width: "100%",
                    height: "400px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        ...dashboardStyle.itemTitleBa,
                        textAlign: "center",
                      }}
                    >
                      To mark the ticket 'Closed', type 'close ticket' in
                      confirm action slot. You can also provide comments to
                      update the creator
                    </p>
                    <Form>
                      <InputGroup className="mb-4">
                        <InputGroupText>
                          <LockOutlinedIcon />{" "}
                        </InputGroupText>
                        <Input
                          type="textarea"
                          placeholder="Description"
                          onChange={(event) =>
                            (AcceptDetails.comment = event.target.value)
                          }
                        />
                      </InputGroup>

                      <InputGroup className="mb-3">
                        <InputGroupText>
                          <PersonOutlineOutlinedIcon />
                        </InputGroupText>
                        <Input
                          type="text"
                          placeholder="Valid Action"
                          onChange={(event) =>
                            (AcceptDetails.title = event.target.value)
                          }
                        />
                      </InputGroup>
                    </Form>
                  </div>
                </ModalBody>
              </>
            )
          )}
          <ModalFooter>
            <div
              className={"row justiy-content-center"}
              style={{ width: "100%" }}
            >
              <Button
                style={{ margin: "auto" }}
                color="primary"
                className="px-4"
                onClick={onSubmit}
              >
                Submit Action
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default IncidenceTicketDetails;
