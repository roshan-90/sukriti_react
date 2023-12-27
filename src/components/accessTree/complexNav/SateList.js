import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList";
import TreeItem from "./TreeItem";
import { stateFont } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const SateList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const getText = () => {
    return text;
  };

  //   const setText = (text) => {
  //     setText(text);
  //   };

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, stateIndex) => {
    return (
      <TreeItem
        treeEdge={new TreeEdge(stateIndex)}
        type={TreeItemType.State}
        expanded={false}
        displayData={item.name}
        displayDataStyle={stateFont}
        listComponent={getListComponent(item, stateIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, stateIndex) => {
    return (
      <DistrictList
        treeEdge={new TreeEdge(stateIndex)}
        listData={item.districts}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  return (
    <div
      style={{
        padding: "10px 10px 10px 10px",
        overflowY: "auto",
        height: "500px",
      }}
    >
      {props.listData.country.states.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

SateList.propTypes = {
  stateListData: PropTypes.array,
};

export default SateList;
