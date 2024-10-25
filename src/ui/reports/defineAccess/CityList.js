import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import ComplexList from "./ComplexList";
import { cityFontReport } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const CityList = (props) => {
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

  const renderRow = (item, cityIndex) => {
    const treeEdge = TreeEdge(
      props.treeEdge.stateIndex,
      props.treeEdge.districtIndex,
      cityIndex
    );
    return (
      <TreeItem
        treeEdge={
          TreeEdge(
            props.treeEdge.stateIndex,
            props.treeEdge.districtIndex,
            cityIndex
          )
        }
        type={TreeItemType.City}
        recursiveAccess={item.recursive === 1}
        selected={item.selected}
        expanded={item?.expanded == true ? true : false}
        displayData={item.name}
        displayDataStyle={cityFontReport}
        listComponent={getListComponent(item, cityIndex)}
        handleUserSelection={props.handleUserSelection}
      />
    );
  };

  const getListComponent = (item, cityIndex) => {
    return (
      <ComplexList
        listData={item.complexes}
        treeEdge={
          TreeEdge(
            props.treeEdge.stateIndex,
            props.treeEdge.districtIndex,
            cityIndex
          )
        }
        handleUserSelection={props.handleUserSelection}
      />
    );
  };

  console.log("_identify", "DistrictList: render(2)");
  const jsonObject = props.listData.map(JSON.stringify);
  console.log(jsonObject);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {uniqueArray.map((item, cityIndex) => {
        return renderRow(item, cityIndex);
      })}
    </div>
  );
};

CityList.propTypes = {
  listData: PropTypes.array,
};

export default CityList;
