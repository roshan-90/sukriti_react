import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import { complexFont } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";

const ComplexList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, complexIndex) => {
    return (
      <TreeItem
        type={TreeItemType.Complex}
        treeEdge={
          new TreeEdge(
            props.treeEdge.stateIndex,
            props.treeEdge.districtIndex,
            props.treeEdge.cityIndex,
            complexIndex
          )
        }
        displayData={item.name}
        displayDataStyle={complexFont}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {props.listData.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

ComplexList.propTypes = {
  listData: PropTypes.array,
};

export default ComplexList;
