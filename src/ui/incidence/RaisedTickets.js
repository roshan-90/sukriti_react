import React, { useState } from "react";
import { Button, Input } from "reactstrap";
import icEarth from "../../assets/img/icons/eco_home.png";
import { useNavigate } from "react-router-dom";
import { NoFaultElement } from "../../components/DisplayLabels";
import { colorTheme, dashboardStyle, whiteSurface } from "../../jsStyles/Style";
import { Link } from "react-router-dom";
import moment from "moment";

const RaisedTickets = (props) => {
  const displayData = eval(props.data);
  const history = useNavigate();
  const [modalShow, setModalShow] = useState("");
  const assignment = (e) => {
    if (e.target.value === "") {
      setModalShow(e.target.value);
    } else if (e.target.value === "Queued") {
      setModalShow(e.target.value);
    } else if (e.target.value === "Un-Queued") {
      setModalShow(e.target.value);
    } else if (e.target.value === "Open") {
      setModalShow(e.target.value);
    } else if (e.target.value === "Resolved") {
      setModalShow(e.target.value);
    } else if (e.target.value === "Closed") {
      setModalShow(e.target.value);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={() =>
            history("/incidence/raiseNewTicket", { user: props.name })
          }
          outline
          color="danger"
          className="px-4"
          style={{
            float: "left",
          }}
        >
          Raise Tickets
        </Button>
        <div>
          <Input
            type="select"
            style={{ width: "auto", float: "right", margin: "10px 0" }}
            onChange={assignment}
          >
            <option selected hidden disabled value="">
              Status : All
            </option>
            <option value="">All</option>
            <option value="Queued">Queued</option>
            <option value="Un-Queued">Un-Queued</option>
          </Input>
        </div>
      </div>

      {displayData !== undefined && displayData.length !== 0 ? (
        displayData.map((ticketData, index) => {
          if (modalShow === "") {
            return (
              ticketData.creator_id === props.name.userName &&
              ticketData.ticket_status !== "Closed" && (
                <div
                  className="animated fadeIn"
                  style={{
                    ...whiteSurface,
                    background: "white",
                    marginTop: "20px",
                  }}
                >
                  <Link
                    to={{
                      pathname: `/Incidence/TicketDetails/${ticketData.ticket_id}`,
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "80px",
                        display: "flexbox",
                        alignItems: "center",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
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
                                ...dashboardStyle.itemDescriprtionBold,
                                marginLeft: "25px",
                                marginBottom: "-2px",
                              }}
                            >
                              {ticketData.ticket_id}
                            </p>
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtionBold,
                                marginLeft: "25px",
                              }}
                            >
                              {ticketData.title}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtion,
                                marginTop: "-10px",
                                marginBottom: "-2px",
                              }}
                            >
                              Status :
                            </p>
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtionBold,
                                marginBottom: "inherit",
                              }}
                            >
                              &nbsp;{ticketData.ticket_status}
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
                                ...dashboardStyle.itemDescriprtion,
                                marginTop: "-10px",
                                marginBottom: "-2px",
                              }}
                            >
                              Priority :
                            </p>
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtionBold,
                              }}
                            >
                              &nbsp;{ticketData.criticality}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          Location
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.complex_name}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.state_code} : {ticketData.district_name}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.city_name}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          Created
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.creator_role}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.creator_id}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {moment(
                            new Date(parseInt(ticketData.timestamp))
                          ).fromNow()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            );
          } else if (modalShow === ticketData.ticket_status) {
            return (
              ticketData.creator_id === props.name.userName && (
                <div
                  className="animated fadeIn"
                  style={{
                    ...whiteSurface,
                    background: "white",
                    marginTop: "20px",
                  }}
                >
                  <Link
                    to={{
                      pathname: `/Incidence/TicketDetails/${ticketData.ticket_id}`,
                      state: {
                        complex: ticketData.ticket_id,
                        title: ticketData.title,
                        status: ticketData.ticket_status,
                        priority: ticketData.criticality,
                        name: ticketData.complex_name,
                        state: ticketData.state_code,
                        district: ticketData.district_name,
                        city: ticketData.city_name,
                        role: ticketData.creator_role,
                        id: ticketData.creator_id,
                        timestamp: ticketData.timestamp,
                        comment: ticketData.assignment_comment,
                        data: ticketData,
                      },
                    }}
                    style={{ textDecoration: "none" }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "80px",
                        display: "flexbox",
                        alignItems: "center",
                        overflowY: "auto",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
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
                                ...dashboardStyle.itemDescriprtionBold,
                                marginLeft: "25px",
                                marginBottom: "-2px",
                              }}
                            >
                              {ticketData.ticket_id}
                            </p>
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtionBold,
                                marginLeft: "25px",
                              }}
                            >
                              {ticketData.title}
                            </p>
                          </div>
                        </div>

                        <div
                          style={{ display: "flex", flexDirection: "column" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "baseline",
                              justifyContent: "center",
                            }}
                          >
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtion,
                                marginTop: "-10px",
                                marginBottom: "-2px",
                              }}
                            >
                              Status :
                            </p>
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtionBold,
                                marginBottom: "inherit",
                              }}
                            >
                              &nbsp;{ticketData.ticket_status}
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
                                ...dashboardStyle.itemDescriprtion,
                                marginTop: "-10px",
                                marginBottom: "-2px",
                              }}
                            >
                              Priority :
                            </p>
                            <p
                              style={{
                                ...dashboardStyle.itemDescriprtionBold,
                              }}
                            >
                              &nbsp;{ticketData.criticality}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          Location
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.complex_name}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.state_code} : {ticketData.district_name}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.city_name}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          Created
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.creator_role}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {ticketData.creator_id}
                        </p>
                        <p
                          style={{
                            ...dashboardStyle.itemDescriprtion,
                            margin: "auto",
                          }}
                        >
                          {moment(
                            new Date(parseInt(ticketData.timestamp))
                          ).fromNow()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            );
          }
        })
      ) : (
        <div
          className="col-md-12"
          style={{ margin: "10px 0px 0px 0px", padding: "0px 0px 0px 0px" }}
        >
          <NoFaultElement
            icon={icEarth}
            title="No active tickets listed. Tickets once generated will be listed here."
          />
        </div>
      )}
    </div>
  );
};
//   return (
//     <div>
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//         }}
//       >
//         <Button
//           onClick={() =>
//             history.push("/incidence/raiseNewTicket", { user: props.name })
//           }
//           outline
//           color="danger"
//           className="px-4"
//           style={{
//             float: "left",
//           }}
//         >
//           Raise Tickets
//         </Button>
//         <select className="px-4">
//           <option value="volvo">All</option>
//           <option value="saab">Queued</option>
//           <option value="mercedes">Un-Queued</option>
//         </select>
//       </div>
// <div
//   className="col-md-12"
//   style={{ margin: "10px 0px 0px 0px", padding: "0px 0px 0px 0px" }}
// >
//   <NoFaultElement
//     icon={icEarth}
//     title="No active tickets listed. Tickets once generated will be listed here."
//   />
// </div>
//     </div>
//   );
// };

export default RaisedTickets;
