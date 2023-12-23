import React, { useState, useEffect } from "react";

const tableStyle = {
  overflow: {
    whiteSpace: "wrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const TableHeader = ({ SelectionMode, data }) => {
  const [selectedIndex, setSelectedIndex] = useState([]);

  useEffect(() => {
    if (SelectionMode !== undefined) {
      setSelectedIndex(createSelectedIndex(SelectionMode, data));
    }
  }, [SelectionMode, data]);

  const getSelectedHeaders = () => {
    return selectedIndex;
  };

  const createSelectedIndex = (columnSelection, data) => {
    return data.map((title) => ({
      title,
      selection: columnSelection === "All-Columns",
    }));
  };

  const renderOnlyHeaders = () => {
    let dataCopy = [...data];
    if (SelectionMode === "All-Rows" || SelectionMode === "All-Columns") {
      dataCopy.unshift("Select");
    }

    return dataCopy.map((mData, index) => (
      <th key={index} style={{ width: getWidth() }}>
        <div
          className="row align-content-center"
          style={{ width: "100%", marginLeft: "15px" }}
        >
          <div className="col-md-12" style={tableStyle.overflow}>
            {mData}
          </div>
        </div>
      </th>
    ));
  };

  const onCheckboxChange = (e, mData, index) => {
    const selectedIndexCopy = [...selectedIndex];
    selectedIndexCopy[index].selection = !selectedIndexCopy[index].selection;
    setSelectedIndex(selectedIndexCopy);
  };

  const getWidth = () => {
    const size = data.length;
    const percent = 100 / size;
    return Math.floor(percent) + "%";
  };

  const renderSelectionHeaders = () => {
    return data.map((mData, index) => (
      <th key={index} style={{ width: getWidth() }}>
        <div
          className="row align-content-center"
          style={{ width: "100%", marginLeft: "15px" }}
        >
          <div className="col-md-1">
            <input
              className="form-check-input"
              type="checkbox"
              checked={selectedIndex[index]?.selection || false}
              onChange={(e) => onCheckboxChange(e, mData, index)}
            />
          </div>
          <div className="col-md-11" style={tableStyle.overflow}>
            {mData}
          </div>
        </div>
      </th>
    ));
  };

  return renderOnlyHeaders();
};

export default TableHeader;
