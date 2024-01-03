import React, { Component } from "react";
import { Table } from "reactstrap";
import Button from "reactstrap/lib/Button";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { useDispatch, useSelector } from "react-redux";

export default function UsageProfileList(props) {
  console.log(props.data[0], "PROPS-PROPS.data[0]");

  if (props.uiResult) {
    props.data.map((rowData, index) => {
      if (props.uiResult.air_dryer_profile === "false") {
        delete rowData["Air Dryer"];
      }
      if (props.uiResult.usage_charge_profile === "false") {
        delete rowData["Usage Charge"];
      }
      if (props.uiResult.rfid_profile === "false") {
        delete rowData["RFID"];
      }
      if (props.uiResult.turbidity_value === "false") {
        delete rowData["Turbidity Value"];
      }
    });
  }

  return (
    <div style={{ height: "400px", width: "100%", overflowY: "scroll" }}>
      <Table hover striped responsive bordered size="sm">
        <thead>
          <tr>{TableHeader(props.data[0])}</tr>
        </thead>
        <tbody>
          {props.data.map((rowData, index) => loadRows(index, rowData))}
        </tbody>
      </Table>
    </div>
  );
}

function TableHeader(rowData) {
  const dispatch = useDispatch();
  setTimeout(() => {
    dispatch(stopLoading()); // Dispatch the stopLoading action
  }, "2000");
  console.log("rowData-TableHeader", rowData);
  var tableLabels = Object.keys(rowData);

  return tableLabels.map((mData, index) => {
    return (
      <th>
        <div style={{ width: "135px" }}>{mData}</div>
      </th>
    );
  });
}

function loadRows(index, rowData) {
  var data = Object.values(rowData);
  return <tr>{TableRow(data, index)}</tr>;
}

function TableRow(data) {
  return data.map((item, index) => {
    return (
      <td>
        <div>
          <div>{item}</div>
        </div>
      </td>
    );
  });
}
