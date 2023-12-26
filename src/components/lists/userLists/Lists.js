import React, { useMemo } from "react";
import { Table } from "reactstrap";
import Button from "reactstrap/lib/Button";
import TableHeader from "./TableHeader";
import { Link } from "react-router-dom";
import { fromUserList } from "../../../parsers/listDataParsers";

const List = (props) => {
  console.log("lists components", props);
  const dataList = useMemo(() => fromUserList(props.data), [props.data]);

  const getHeaderData = () => {
    const row = dataList[0];
    if (row !== undefined) {
      const data = Object.keys(row);
      return data;
    } else return [];
  };

  const loadRows = (index, rowData) => {
    const data = Object.values(rowData);
    return <tr key={index}>{getData(data, index)}</tr>;
  };

  const getData = (data, rowIndex) => {
    return data.map((item, index) => {
      if (index !== 0) {
        return (
          <td key={index}>
            <div className={"col-md-12"}>
              <div className={"row justify-content-center"}>{item}</div>
            </div>
          </td>
        );
      }
      return (
        <td key={index}>
          <div className={"col-md-12"}>
            <div className={"row justify-content-center"}>
              <Link
                to={{
                  pathname: `/administration/memberDetails/${item}`,
                  data: props.data[rowIndex],
                }}
              >
                {item}
              </Link>
            </div>
          </div>
        </td>
      );
    });
  };

  return (
    <div>
      <Table
        hover
        bordered
        striped
        responsive
        size="sm"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <thead>
          <tr>
            <TableHeader data={getHeaderData()} />
          </tr>
        </thead>
        <tbody>
          {dataList.map((rowData, index) => loadRows(index, rowData))}
        </tbody>
      </Table>
    </div>
  );
};

export default List;
