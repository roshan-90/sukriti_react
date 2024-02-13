import React, { useState } from "react";
import {
  whiteSurface,
  treeItemBox,
  complexSelectedCircleSurface,
} from "../../../jsStyles/Style";
import { Col, Row, Label, Input, Button } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { setComplexData } from "../../../features/extraSlice";
import AddBoxIcon from "@mui/icons-material/AddBox";
import IndeterminateCheckBoxIcon from "@mui/icons-material/IndeterminateCheckBox";

export function ExpandedRowRoot(props) {
  return (
    <div className="row" style={{ ...whiteSurface }}>
      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
        onClick={() => props.treeRowProps.handleToggle()}
      >
        <IndeterminateCheckBoxIcon />
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
        {props.treeRowProps.displayData}
      </div>

      <div style={{ width: "100%" }}>{props.treeRowProps.listComponent}</div>
    </div>
  );
}

export function CollapsedRowRoot(props) {
  return (
    <div className="row" style={whiteSurface}>
      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
        onClick={() => props.treeRowProps.handleToggle()}
      >
        <AddBoxIcon />
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
        {props.treeRowProps.displayData}
      </div>
    </div>
  );
}

export function ExpandedRow(props) {
  return (
    <div className="row" style={treeItemBox}>
      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
        onClick={() => props.treeRowProps.handleToggle()}
      >
        <IndeterminateCheckBoxIcon />
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
        {props.treeRowProps.displayData}
      </div>

      <div style={{ width: "100%" }}>{props.treeRowProps.listComponent}</div>
    </div>
  );
}

export function CollapsedRow(props) {
  return (
    <div className="row" style={{ ...treeItemBox }}>
      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
        onClick={() => props.treeRowProps.handleToggle()}
      >
        <AddBoxIcon />
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
        {props.treeRowProps.displayData}
      </div>
    </div>
  );
}

export function ComplexRow(props) {
  const dispatch = useDispatch();

  const handleChange = (event) => {
    let data = event.target.value;
    console.log("event", event.target.checked);
    console.log("check handleChange ", data);
    // Get existing data from localStorage or initialize as an empty array
    let array_data = JSON.parse(localStorage.getItem("array_data")) || [];

    if (event.target.checked) {
      // Update array_data
      array_data.push(data);
      // Store updated array_data in localStorage
      localStorage.setItem("array_data", JSON.stringify(array_data));
    } else {
      var filteredArray = array_data.filter((e) => e !== data);
      console.log("filteredArray", filteredArray);
      // Store updated filteredArray in localStorage
      localStorage.setItem("array_data", JSON.stringify(filteredArray));
    }

    console.log("this is data click", array_data);
    // dispatch(setComplexData({ complexData: data }));
  };

  return (
    <div
      // onClick={props.handleComplexSelection}
      className="row"
      style={{ ...treeItemBox, cursor: "pointer" }}
    >
      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
      >
        <div style={complexSelectedCircleSurface}></div>
      </div>

      <div
        className="col-md-8"
        style={{
          ...props.treeRowProps.displayDataStyle,
          display: "flex",
          alignItems: "center",
        }}
      >
        {props.treeRowProps.displayData}
      </div>
      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
      >
        <input
          type="checkbox"
          value={props.treeRowProps.displayData}
          onChange={handleChange}
        ></input>
      </div>
      {/* <div className="col-md-2" style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "0" }}>
        <Button
          outline
          color="primary"
          className="px-4"
          onClick={props.handleComplexSelection}
        >
          Details
        </Button>
      </div> */}
    </div>
  );
}
