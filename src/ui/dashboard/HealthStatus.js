import React, { useRef } from "react";
import {
  dashboardStyle,
  whiteSurface,
  colorTheme,
  whiteSurfaceCircularBorder,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import icEarth from "../../assets/img/icons/eco_earth.png";
import {
  NoFaultElement,
  FaultHeader,
  NoFaultHeader,
} from "../../components/DisplayLabels";

const HealthStatus = (props) => {
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
          title="Health Status"
          label={props.data.length + " Fault(s) Reported"}
        />
      );
    }
    return (
      <NoFaultHeader title="Health Status" label="All units working fine" />
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
          {displayData.map((item, index) => ComplexHealthItem(item))}
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

  const ComplexHealthItem = (props) => {
    var border = "";
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
              {props.complex.name}
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
              {/* <CabinHealthItem /> */}
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
                  {props.count} Faulty Cabin(s) reported.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const CabinHealthItem = (props) => {
    return (
      <div style={{}}>
        <CabinHealthRow />
        <CabinHealthRow />
      </div>
    );
  };

  const CabinHealthRow = (props) => {
    return (
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
          Configure payment charge and payment mode settings in one go.
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

export default HealthStatus;
