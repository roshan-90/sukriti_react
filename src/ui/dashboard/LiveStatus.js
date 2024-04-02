import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import {
  dashboardStyle,
  whiteSurface,
  colorTheme,
  whiteSurfaceCircularBorder,
} from "../../jsStyles/Style";
import {
  NoFaultElement,
  FaultHeader,
  NoFaultHeader,
} from "../../components/DisplayLabels";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import icEarth from "../../assets/img/icons/eco_earth.png";
import { LiveTable } from "./LiveTable";
// import { setLiveData } from "../../store/actions/dashboard-actions";
import { setDashboardLive } from "../../features/dashboardSlice";

const LiveStatus = (data) => {
  const [visibility, setVisibility] = useState(false);
  const [visibility1, setVisibility1] = useState(false);
  const [title, setTitle] = useState("");
  const [title1, setTitle1] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const dispatch = useDispatch();

  const toggleDialog = () => {
    setVisibility((prevVisibility) => !prevVisibility);
  };

  const toggleDialog1 = () => {
    setVisibility1((prevVisibility1) => !prevVisibility1);
  };

  const showDialog = (onClickAction) => {
    setTitle("LIVE STATUS");
    if (onClickAction !== undefined)
      dispatch(setDashboardLive(onClickAction.table));
    toggleDialog();
  };

  const showDialog1 = (onClickAction1) => {
    console.log("onClickAction1,", onClickAction1);
    setTitle1(onClickAction1.complex.name);
    setLat(onClickAction1.complex.lat);
    setLon(onClickAction1.complex.lon);
    if (onClickAction1 !== undefined)
      console.log("table,", onClickAction1.table);
    dispatch(setDashboardLive(onClickAction1?.table));
    toggleDialog1();
  };
  console.log("data->>", data.data);
  const HeaderSelector = () => {
    console.log("data->>lll", data?.data?.length);
    if (data?.data !== undefined && data?.data?.length > 0) {
      return (
        <FaultHeader
          title="Live Status "
          label={data?.data?.length + " Complexe(s) Reported"}
        />
      );
    }
    return (
      <NoFaultHeader title="Live Status111" label="All units are Online" />
    );
  };

  const ComplexStatusItem3 = (props) => {
    console.log("connectionStatus-mData -:👉", props);

    return props.displayData2.map((mData, index) => (
      <div className="col-md-12" style={{}} key={index}>
        <div
          style={{
            border: "2px solid #5DC0A6",
            height: "120px",
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
                style={{ width: "20px", height: "20px", borderRadius: "5%" }}
              />
            </div>
            <div
              style={{
                ...dashboardStyle.itemTitle,
                float: "left",
                marginLeft: "10px",
              }}
            >
              {mData.complex.name}
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                }}
              >
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
                    ...dashboardStyle.itemDescriprtion,
                    float: "left",
                    marginLeft: "10px",
                  }}
                >
                  {mData.count} Offline Cabin(s) reported.
                </div>
                <div style={{ ...dashboardStyle.itemTitle, float: "right" }}>
                  <Button
                    color="primary"
                    className="px-4"
                    outline
                    onClick={() => {
                      showDialog1(mData);
                    }}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  };
  const ComplexStatusItem = (props) => {
    return (
      <div className="col-md-4" style={{}}>
        <div
          style={{
            border: "2px solid #5DC0A6",
            height: "120px",
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
                style={{ width: "20px", height: "20px", borderRadius: "5%" }}
              />
            </div>
            <div
              style={{
                ...dashboardStyle.itemTitle,
                float: "left",
                marginLeft: "10px",
              }}
            >
              {props.complex?.name}
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
                    ...dashboardStyle.itemDescriprtion,
                    float: "left",
                    marginLeft: "10px",
                  }}
                >
                  {props.count} Offline Cabin(s) reported.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ComplexStatusItem2 = (props) => {
    return (
      <div className="col-md-4" style={{}}>
        <div
          style={{
            border: "2px solid #5DC0A6",
            height: "120px",
            margin: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: colorTheme.primary,
              height: "117px",
              padding: "10px",
            }}
          >
            <div
              style={{
                ...whiteSurfaceCircularBorder,
                float: "left",
                padding: "10px",
                width: "38px",
                height: "45px",
              }}
            >
              <img
                src={icToilet}
                alt=""
                style={{ width: "20px", height: "20px", borderRadius: "5%" }}
              />
            </div>
            <div
              style={{
                ...dashboardStyle.itemTitle,
                float: "left",
                marginLeft: "10px",
              }}
            ></div>
          </div>
          <div
            style={{
              ...whiteSurface,
              background: "white",
              margin: "-90px 30px",
              padding: "14px",
            }}
          >
            <div style={{ ...dashboardStyle.itemDescriprtionBold2 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ ...dashboardStyle.itemTitle, float: "right" }}>
                  <Button
                    color="primary"
                    className="px-4"
                    outline
                    onClick={() => {
                      showDialog();
                    }}
                  >
                    View All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ComponentSelector = () => {
    if (data?.data !== undefined && data?.data?.length !== 0) {
      var displayData = [...data?.data];
      var displayData2 = [...data?.data];
      if (data?.data?.length > 10) {
        displayData = data?.data?.slice(0, 10);
        displayData2 = data?.data;
      }
      return (
        <div className="row">
          {displayData.map((item, index) => ComplexStatusItem(item))}
          {displayData2.length > 10 ? ComplexStatusItem2(displayData2) : null}
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
          title="No active faults listed. Faults once detected will be listed here."
        />
      </div>
    );
  };

  if(visibility1) {
    var displayData = [...data?.data];
    var displayData2 = [...data?.data];
    if (data?.data?.length > 10) {
      displayData = data?.data?.slice(0, 10);
      displayData2 = data?.data;
    }
    return (
      <Modal
      isOpen={visibility1}
      toggle={toggleDialog1}
      className={"modal-xl"}
    >
      <ModalHeader
        style={{
          background: "#5DC0A6",
          color: `white`,
        }}
        toggle={toggleDialog1}
      >
        <div style={{}}>
          <div>Complex : {title1}</div>
        </div>
      </ModalHeader>
      <ModalBody
        style={{
          width: "100%",
          height: "200px",
        }}
      >
        <div style={{}}>
          <LiveTable />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          className="px-4"
          outline
          onClick={toggleDialog1}
        >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
    )
  }

  if(visibility) {
    var displayData = [...data?.data];
    var displayData2 = [...data?.data];
    if (data?.data?.length > 10) {
      displayData = data?.data?.slice(0, 10);
      displayData2 = data?.data;
    }
    return (
      <Modal
            isOpen={visibility}
            toggle={toggleDialog}
            className={"modal-xl"}
          >
            <ModalHeader
              style={{ background: "#5DC0A6", color: `white` }}
              toggle={toggleDialog}
            >
              {title}
            </ModalHeader>
            <ModalBody
              style={{
                width: "100%",
                height: "600px",
                overflowY: "scroll",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "360px 360px 360px",
                }}
              >
                <ComplexStatusItem3 displayData2={displayData2} />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                className="px-4"
                outline
                onClick={toggleDialog}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
    )
  }

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
export default LiveStatus;
