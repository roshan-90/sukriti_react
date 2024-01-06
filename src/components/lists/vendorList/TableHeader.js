import React, { useState, useEffect } from "react";

const tableStyle = {
  overflow: {
    whiteSpace: "wrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

const TableHeader = (props) => {
  const [state, setState] = useState({
    SelectionMode: "Off",
    data: [],
    selectedIndex: [],
  });

  useEffect(() => {
    if (props !== undefined) {
      setState({
        SelectionMode: props.SelectionMode,
        data: props.data,
        selectedIndex: createSelectedIndex(props.SelectionMode, props.data),
      });
    }
  }, [props]);

  const createSelectedIndex = (columnSelection, data) => {
    var selectedIndex = [];
    for (var i = 0; i < data.length; i++) {
      if (columnSelection === "All-Columns")
        selectedIndex.push({ title: data[i], selection: true });

      if (columnSelection === "None-Columns")
        selectedIndex.push({ title: data[i], selection: false });
    }

    return selectedIndex;
  };

  const getSelectedHeaders = () => {
    return state.selectedIndex;
  };

  const renderOnlyHeaders = () => {
    var dataCopy = props.data;
    if (
      state.SelectionMode === "All-Rows" ||
      state.SelectionMode === "All-Columns"
    ) {
      dataCopy.unshift("Select");
    }

    return dataCopy.map((mData, index) => {
      console.log("", index, mData);
      return (
        <th style={{ width: getWidth() }}>
          <div
            className={"row align-content-center"}
            style={{ width: "100%", marginLeft: "15px" }}
          >
            <div className={"col-md-12"} style={tableStyle.overflow}>
              {mData}
            </div>
          </div>
        </th>
      );
    });
  };

  const onCheckboxChange = (e, mData, index) => {
    var selectedIndexCopy = [...state.selectedIndex];
    selectedIndexCopy[index].selection = !selectedIndexCopy[index].selection;
    setState({
      selectedIndex: selectedIndexCopy,
    });
  };

  const getWidth = () => {
    var size = state.data.length;
    var percent = 100 / size;
    return Math.floor(percent) + "%";
  };

  const renderSelectionHeaders = () => {
    return state.data.map((mData, index) => {
      return (
        <th style={{ width: getWidth() }}>
          <div
            className={"row align-content-center"}
            style={{ width: "100%", marginLeft: "15px" }}
          >
            <div className={"col-md-1"}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={state.selectedIndex[index].selection}
                onChange={(e) => onCheckboxChange(e, mData, index)}
              />
            </div>
            <div className={"col-md-11"} style={tableStyle.overflow}>
              {mData}
            </div>
          </div>
        </th>
      );
    });
  };

  // Uncomment the return statement based on your condition
  // return state.SelectionMode === "All-Columns" ||
  //   state.SelectionMode === "None-Columns"
  //   ? renderSelectionHeaders()
  //   : renderOnlyHeaders();

  return renderOnlyHeaders();
};

export default TableHeader;
