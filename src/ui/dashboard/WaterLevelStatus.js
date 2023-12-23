import React from "react";
import {
  dashboardStyle,
  whiteSurface,
  colorTheme,
  whiteSurfaceCircularBorder,
} from "../../jsStyles/Style";
import icToilet from "../../assets/img/icons/ic_toilet.png";
import icEarth from "../../assets/img/icons/eco_status.png";
import {
  NoFaultElement,
  FaultHeader,
  NoFaultHeader,
} from "../../components/DisplayLabels";

const WaterLevelStatus = ({ data }) => {
  const HeaderSelector = () => {
    if (data !== undefined && data.length > 0) {
      return (
        <FaultHeader
          title="Water Level Status"
          label={`${data.length} Complexes with low water level`}
        />
      );
    }
    return (
      <NoFaultHeader
        title="Water Level Status"
        label="All units have sufficient water level"
      />
    );
  };

  const ComponentSelector = () => {
    if (data !== undefined && data.length !== 0) {
      const displayData = data.length > 10 ? data.slice(0, 10) : data;
      return (
        <div className="row">
          {displayData.map((item, index) => (
            <ComplexWaterStatusItem key={index} complex={item.complex} />
          ))}
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
          title="No units with low water level listed. Complexes with low water level once detected will be listed here."
        />
      </div>
    );
  };

  const ComplexWaterStatusItem = ({ complex }) => {
    return (
      <div className="col-md-4">
        <div
          style={{
            border: "2px solid #5DC0A6",
            height: "112px",
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
              {complex.name}
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
                  Low water level reported.
                </div>
              </div>
            </div>
          </div>
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

export default WaterLevelStatus;
