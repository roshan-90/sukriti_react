import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import { complexFont } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";

const ComplexList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const getText = () => {
    return text;
  };

  const setTextState = (newText) => {
    setText(newText);
  };

  const handleToggle = () => {};

  const renderRow = (item, complexIndex) => {
    const treeEdge = new TreeEdge(
      props.treeEdge.stateIndex,
      props.treeEdge.districtIndex,
      props.treeEdge.cityIndex,
      complexIndex
    );
    console.log(props, "THIS_props_P");
    return (
      <TreeItem
        treeEdge={
          new TreeEdge(
            props.treeEdge.stateIndex,
            props.treeEdge.districtIndex,
            props.treeEdge.cityIndex,
            complexIndex
          )
        }
        type={TreeItemType.Complex}
        selected={item.selected}
        displayData={item.name}
        displayDataStyle={complexFont}
        handleUserSelection={props.handleUserSelection}
      />
    );
  };

  console.log("_storeUpdatedState", "render: ComplexList");
  const jsonObject = props.listData.map(JSON.stringify);
  console.log(jsonObject);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {uniqueArray.map((item, complexIndex) => {
        return renderRow(item, complexIndex);
      })}
    </div>
  );
};

ComplexList.propTypes = {
  listData: PropTypes.array,
};

export default ComplexList;
