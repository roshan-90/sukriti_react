import React, { useEffect, useState, useRef } from "react";
import { Table } from "reactstrap";
import Button from "reactstrap/lib/Button";
import TableHeader from "./TableHeader";
import { Link } from "react-router-dom";
import { fromUserList, fromVendorList } from "../../../parsers/listDataParsers";

const List = (props) => {
  const [dataList, setDataList] = useState([]);
  const tableHeaderRef = useRef(null);

  useEffect(() => {
    setDataList(fromVendorList(props.data));
  }, [props.data]);

  const loadRows = (index, rowData) => {
    const data = Object.values(rowData);
    return <tr key={index}>{getData(data, index)}</tr>;
  };

  const getData = (data, rowIndex) => {
    return data.map((item, index) => {
      if (index !== 0) {
        return (
          <td key={index} className="text-center">
            <div className="d-flex justify-content-center align-items-center">
              {item}
            </div>
          </td>
        );
      }
      return (
        <td key={index} className="text-center">
          <div className="d-flex justify-content-center align-items-center">
            <Link
              to={{
                pathname: `/vendor/vendorDetails/${item}`,
                data: props.data[rowIndex],
              }}
            >
              {item}
            </Link>
          </div>
        </td>
      );
    });
  };
  

  const getHeaderData = () => {
    const row = dataList[0];
    console.log("_getHeaderData", row);
    if (row !== undefined) {
      const data = Object.keys(row);
      console.log("_getHeaderData", data);
      return data;
    } else return [];
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
            <TableHeader ref={tableHeaderRef} data={getHeaderData()} />
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
