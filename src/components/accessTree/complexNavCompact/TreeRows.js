import React from "react";
import {
  whiteSurface,
  treeItemBox,
  complexSelectedCircleSurface,
} from "../../../jsStyles/Style";
import { Col, Row, Label, Input, Button } from "reactstrap";

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
        <i class="fa fa-minus-square"></i>
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
        <i class="fa fa-plus-square"></i>
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
        <i class="fa fa-minus-square"></i>
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
        <i class="fa fa-plus-square"></i>
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
        {props.treeRowProps.displayData}
      </div>
    </div>
  );
}

export function ComplexRow(props) {
  return (
    <div
      onClick={props.handleComplexSelection}
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
