import React from "react";
import PropTypes from "prop-types";
import {
  whiteSurface,
  treeItemBox,
  complexSelectedCircleSurface,
} from "../../../jsStyles/Style";
import { Col, Row, Label, Input, Button } from "reactstrap";
import RxInputCheckbox from "../../../components/RxInputCheckbox";
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

export function ExpandedRowRoot(props) {
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

export function CollapsedRowRootWithRecursive(props) {
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

      <div
        className="col-md-2"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "0",
        }}
      >
        <RxInputCheckbox
          selected={props.treeRowProps.selected}
          onChange={(e) => props.treeRowProps.onCheckboxChange(e)}
        />
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
        <AddBoxIcon />
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
        {props.treeRowProps.displayData}
      </div>
    </div>
  );
}

export function CollapsedRowWithRecursive(props) {
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
        <AddBoxIcon />
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
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
        <RxInputCheckbox
          selected={props.treeRowProps.selected}
          onChange={(e) => props.treeRowProps.onCheckboxChange(e)}
        />
      </div>
    </div>
  );
}

export function ComplexRow(props) {
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
      >
        <div style={complexSelectedCircleSurface}></div>
      </div>

      <div className="col-md-8" style={props.treeRowProps.displayDataStyle}>
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
        <RxInputCheckbox
          selected={props.treeRowProps.selected}
          onChange={props.treeRowProps.onCheckboxChange}
        />
      </div>
    </div>
  );
}
