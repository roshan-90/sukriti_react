import React, { useRef } from "react";
import { Link } from "react-router-dom";
import {
  dashboardStyle,
  whiteSurface,
  colorTheme,
  whiteSurfaceCircularBorder,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import icEarth from "../../assets/img/icons/eco_home.png";
import {
  NoFaultElement,
  FaultHeader,
  NoFaultHeader,
} from "../../components/DisplayLabels";

const ActiveTickets = (props) => {
  const complexComposition = useRef();
  const messageDialog = useRef();
  // Check if props and its required properties exist
  if (!props) {
    return null;
  }

  const HeaderSelector = () => {
    if (props.data !== undefined && props.data.length > 0) {
      return (
        <FaultHeader
          title="Active Tickets"
          label={props.data.length + " Ticket(s) Active"}
        />
      );
    }
    return (
      <NoFaultHeader title="Active Tickets" label="All units working fine" />
    );
  };

  const ComponentSelector = () => {
    if (props.data !== undefined && props.data.length !== 0) {
      var displayData = [...props.data];
      if (props.data.length > 10) {
        displayData = props.data.slice(0, 10);
      }
      return (
        <div className="row">
          {displayData.map((ticketData, index) => ActiveTicketItem(ticketData))}
        </div>
      );
    }
    return (
      <div
        className="col-md-12"
        style={{ margin: "10px 0px 0px 0px", padding: "0px 0px 0px 0px" }}
      >
        <NoFaultElement
          icon={icEarth}
          title="No active tickets listed. Tickets once generated will be listed here."
        />
      </div>
    );
  };

  const ActiveTicketItem = (props) => {
    // Check if props and its required properties exist
    if (!props) {
      return null;
    }

    var border = "";
    return (
      <Link
        to={{
          pathname: `/Incidence/TicketDetails/${props.ticket_id}`,
          state: {
            complex: props.ticket_id,
            title: props.title,
            status: props.ticket_status,
            priority: props.criticality,
            name: props.complex_name,
            state: props.state_code,
            district: props.district_name,
            city: props.city_name,
            role: props.creator_role,
            id: props.creator_id,
            timestamp: props.timestamp,
            comment: props.description,
            data: props,
          },
        }}
        className="col-md-4"
        style={{ textDecoration: "none" }}
      >
        <div
          style={{
            border: "2px solid #5DC0A6",
            height: "140px",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: colorTheme.primary,
              height: "60px",
              padding: "10px",
            }}
          >
            <div
              style={{
                ...whiteSurfaceCircularBorder,
                float: "left",
                padding: "10px",
                width: "30px",
                height: "30px",
              }}
            >
              <img
                src={icToilet}
                alt=""
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "5%",
                }}
              />
            </div>

            <div
              style={{
                ...dashboardStyle.itemTitle,
                float: "left",
                marginLeft: "10px",
              }}
            >
              {props.complex_name}
            </div>
          </div>

          <div
            style={{
              ...whiteSurface,
              background: "white",
              margin: "-8px 10px 0px 10px",
              padding: "10px",
            }}
          >
            <div style={{ ...dashboardStyle.itemDescriprtion }}>
              <CabinHealthItem data={props} />
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const CabinHealthItem = (props) => {
    return (
      <div style={{}}>
        <CabinHealthRow data={props.data} />
      </div>
    );
  };

  const CabinHealthRow = (props) => {
    return (
      <div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              float: "left",
              width: "5px",
              height: "5px",
              background: "red",
            }}
          />

          <div
            style={{
              ...dashboardStyle.itemDescriprtionBold,
              float: "left",
              marginLeft: "10px",
            }}
          >
            {props.data.ticket_id}
          </div>

          <div
            style={{
              ...dashboardStyle.itemDescriprtion,
              float: "right",
              marginLeft: "180px",
            }}
          >
            Status:
          </div>

          <div
            style={{
              ...dashboardStyle.itemDescriprtionBold,
              float: "right",
              marginLeft: "10px",
            }}
          >
            {props.data.ticket_status}
          </div>
        </div>

        <div
          style={{
            ...dashboardStyle.itemDescriprtion,
            float: "none",
            clear: "both",
            marginLeft: "10px",
          }}
        >
          {props.data.title}
        </div>
      </div>
    );
  };

  return (
    <div
      className="animated fadeIn"
      style={{ ...whiteSurface, background: "white", marginTop: "20px" }}
    >
      <HeaderSelector />
      <div
        style={{
          width: "100%",
          height: "200px",
          display: "flexbox",
          alignItems: "center",
          overflowY: "auto",
        }}
      >
        <ComponentSelector />
      </div>
    </div>
  );
};

export default ActiveTickets;
