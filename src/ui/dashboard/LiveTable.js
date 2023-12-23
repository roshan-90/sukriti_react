import React from "react";
import { Table } from "reactstrap";
import { useSelector } from "react-redux";
import { getLiveStatusData } from "../complexes/utils/ComplexUtils";

export const LiveTable = (props) => {
  const { dashboardData } = useSelector((state) => {
    return {
      dashboardData: state.dashboard.configData,
    };
  });
  console.log("LiveTable-dashboardData -:👉", dashboardData);
  const data = getLiveStatusData(dashboardData);

  return (
    <div style={{ height: "200px", width: "100%", overflowY: "scroll" }}>
      <Table hover striped responsive bordered size="sm">
        <thead>
          <tr>{TableHeader(data[0])}</tr>
        </thead>
        <tbody>
          {data.map((rowData, index) => {
            return loadRows(rowData, index);
          })}
        </tbody>
      </Table>
    </div>
  );
};
function TableHeader(rowData) {
  var tableLabels = Object.keys(rowData);
  return tableLabels.map((mData, index) => {
    return (
      <th>
        <div style={{ width: "155px" }}>{mData}</div>
      </th>
    );
  });
}

function loadRows(rowData, index) {
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
