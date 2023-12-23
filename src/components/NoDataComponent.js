import React from "react";
import logo from "../assets/img/brand/no_data_02.png";

export default function NoDataComponent(props) {
  var labelStyle = {};
  if ("withPadding" in props) {
    labelStyle = { ...labelStyle, margin: "20px" };
  }

  return (
    <div style={{}}>
      <img
        src={logo}
        alt=""
        style={{
          display: "block",
          marginTop: "20px",
          width: "40%",
          margin: "auto",
          borderRadius: "5%",
        }}
      />
    </div>
  );
}
