import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import ComplexList from "./ComplexList";
import { cityFont } from "../../../jsStyles/Style";
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
        treeEdge={
          new TreeEdge(
            props.treeEdge.stateIndex,
            props.treeEdge.districtIndex,
            cityIndex
          )
        }
        type={TreeItemType.City}
        recursiveAccess={item.recursive === 1}
        expanded={false}
        displayData={item.name}
        displayDataStyle={cityFont}
        listComponent={getListComponent(item, cityIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, cityIndex) => {
    return (
      <ComplexList
        listData={item.complexes}
        treeEdge={
          new TreeEdge(
            props.treeEdge.stateIndex,
            props.treeEdge.districtIndex,
            cityIndex
          )
        }
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

CityList.propTypes = {
  listData: PropTypes.array,
};

export default CityList;
