import React from "react";
import { useState } from "react";
import { cabinDetailsStyle } from "../jsStyles/Style";
import Dropdown from "../components/DropDown";
import icSmile from "../assets/img/icons/ic_smile.png";
import icToilet from "../assets/img/icons/ic_toilet.png";
import {
  dashboardStyle,
  whiteCircleSurface,
  colorTheme,
  whiteSurfaceCircularBorder,
} from "../jsStyles/Style";

export function NameValueList(props) {
  var labelStyle = {};

  if ("labelStyle" in props) {
    labelStyle = props.labelStyle;
  }

  if ("withPadding" in props) {
    labelStyle = { ...labelStyle, margin: "20px" };
  }

  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      {props.data.map((item, index) => {
        return (
          <NameValueLabel key={index} data={item} labelStyle={labelStyle} />
        );
      })}
    </div>
  );
}

function NameValueLabel(props) {
  return (
    <div className="row" style={props.labelStyle}>
      <div className="col-md-6" style={{ textAlign: "right", padding: "0" }}>
        {props.data.name} :
      </div>

      <div
        className="col-md-6"
        style={{
          textAlign: "left",
          padding: "0",
          paddingLeft: "2px",
        }}
      >
        <b> {props.data.value}</b>
      </div>
    </div>
  );
}

// VENDOR
export function NameVendorList(props) {
  var labelStyle = {};

  if ("labelStyle" in props) {
    labelStyle = props.labelStyle;
  }

  if ("withPadding" in props) {
    labelStyle = { ...labelStyle, margin: "20px" };
  }

  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      {props.data.map((item, index) => {
        return (
          <NameValueLabel2 key={index} data={item} labelStyle={labelStyle} />
        );
      })}
    </div>
  );
}

function NameValueLabel2(props) {
  return (
    <div
      className="row"
      style={{
        margin: "20px",
        display: "flex",
        justifyContent: "space-between",
        padding: "10px",
        border: "1px solid #4dbd74",
        borderRadius: "10px",
      }}
    >
      <div style={{ flex: 1, textAlign: "left", padding: "0" }}>
        <b>{props.data.name}</b>
      </div>

      <div style={{ flex: 1, textAlign: "right", padding: "0", paddingLeft: "2px" }}>
        {props.data.value}
      </div>
    </div>
  );
}
// VENDOR
export function IconNameValuelList(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      {props.data.map((item, index) => {
        return <IconNameValuelLabel data={item} />;
      })}
    </div>
  );
}

function IconNameValuelLabel(props) {
  return (
    <div
      className="row"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0",
        margin: "20px",
      }}
    >
      <div
        className="col-md-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0",
        }}
      >
        <img
          src={props.data.icon}
          alt=""
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%",
          }}
        />

        <div
          style={{
            ...cabinDetailsStyle.cabinHealth.itemTitle,
          }}
        >
          {props.data.name} :
        </div>
      </div>

      <div
        className="col-md-6"
        style={{
          ...cabinDetailsStyle.cabinHealth.itemValue,
          textAlign: "left",
          padding: "0",
          paddingLeft: "2px",
        }}
      >
        <b> {props.data.value}</b>
      </div>
    </div>
  );
}

export function DropDownLabel(props) {
  const [paymentMode, setPaymentMode] = useState(0);

  return (
    <div
      className="row"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0",
        margin: "0px 0px 30px 0px",
      }}
    >
      <div
        className="col-md-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0",
        }}
      >
        <div
          style={{
            ...cabinDetailsStyle.cabinHealth.itemTitle,
            textAlign: "end",
          }}
        >
          {props.label}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      ></div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <Dropdown
          options={props.options}
          onSelection={(index, value) => {
            setPaymentMode(value);
            props.handleUpdate(props.label, value);
          }}
        />
      </div>
    </div>
  );
}

export function NoFaultElement(props) {
  return (
    <table
      style={{
        background: colorTheme.primary,
        width: "100%",
        height: "190px",
        padding: "0px",
      }}
    >
      <tbody>
        <tr>
          <td style={{ width: "30%" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  ...whiteCircleSurface,
                  background: colorTheme.primaryDark,
                  float: "right",
                  padding: "10px",
                  width: "160px",
                  height: "160px",
                }}
              >
                <img
                  src={props.icon}
                  alt=""
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "5%",
                  }}
                />
              </div>
            </div>
          </td>
          <td style={{ width: "70%" }}>
            <div
              style={{
                ...dashboardStyle.itemTitleLa,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props.title}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export function FaultHeader(props) {
  return (
    <div style={{}}>
      <div style={{ ...dashboardStyle.title, float: "left" }}>
        {props.title}
      </div>

      <div
        style={{
          ...dashboardStyle.label,
          float: "right",
          margin: "4px 80px 0px 10px",
        }}
      >
        {props.label}
      </div>

      <div>
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "right",
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
      </div>
    </div>
  );
}

export function NoFaultHeader(props) {
  return (
    <div style={{}}>
      <div style={{ ...dashboardStyle.title, float: "left" }}>
        {props.title}
      </div>

      <div
        style={{
          ...dashboardStyle.label,
          float: "right",
          margin: "4px 80px 0px 10px",
        }}
      >
        {props.label}
      </div>

      <div>
        <div
          style={{
            ...whiteSurfaceCircularBorder,
            float: "right",
            padding: "10px",
            width: "30px",
            height: "30px",
          }}
        >
          <img
            src={icSmile}
            alt=""
            style={{
              width: "20px",
              height: "20px",
              borderRadius: "5%",
            }}
          />
        </div>
      </div>
    </div>
  );
}
