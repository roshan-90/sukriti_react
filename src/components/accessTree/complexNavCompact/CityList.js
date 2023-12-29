import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import ComplexList from "./ComplexList";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const CityList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, cityIndex) => {
    return (
      <TreeItem
        treeEdge={TreeEdge(
          props.treeEdge.stateIndex,
          props.treeEdge.districtIndex,
          cityIndex
        )}
        type={TreeItemType.City}
        recursiveAccess={item.recursive === 1}
        expanded={false}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.cityFont}
        listComponent={getListComponent(item, cityIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, cityIndex) => {
    return (
      <ComplexList
        listData={item.complexes}
        treeEdge={TreeEdge(
          props.treeEdge.stateIndex,
          props.treeEdge.districtIndex,
          cityIndex
        )}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  // Create an array of objects
  const jsonObject = props.listData.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {uniqueArray.map((item, index) => renderRow(item, index))}
    </div>
  );
};

CityList.propTypes = {
  listData: PropTypes.array,
  text: PropTypes.string,
  treeEdge: PropTypes.object,
  handleComplexSelection: PropTypes.func,
};

export default CityList;
