import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList";
import TreeItem from "./TreeItem";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const StateList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, stateIndex) => {
    return (
      <TreeItem
        treeEdge={TreeEdge(stateIndex)}
        type={TreeItemType.State}
        expanded={false}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.stateFont}
        listComponent={getListComponent(item, stateIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, stateIndex) => {
    return (
      <DistrictList
        treeEdge={TreeEdge(stateIndex)}
        listData={item.districts}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  return (
    <div style={{ overflowY: "auto", height: "35vh", width: "100%" }}>
      {props.listData?.country?.states.map((item, index) =>
        renderRow(item, index)
      )}
    </div>
  );
};

export default StateList;
