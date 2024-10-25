import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList";
import { districtFontReport } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const DistrictList = (props) => {
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

  const renderRow = (item, districtIndex) => {
    const treeEdge = TreeEdge(props.treeEdge.stateIndex, districtIndex);

    return (
      <TreeItem
        type={TreeItemType.District}
        treeEdge={TreeEdge(props.treeEdge.stateIndex, districtIndex)}
        recursiveAccess={item.recursive === 1}
        expanded={item?.expanded == true ? true : false}
        selected={item.selected}
        displayData={item.name}
        displayDataStyle={districtFontReport}
        listComponent={getListComponent(item, districtIndex)}
        handleUserSelection={props.handleUserSelection}
      />
    );
  };

  const getListComponent = (item, districtIndex) => {
    return (
      <CityList
        listData={item.cities}
        treeEdge={TreeEdge(props.treeEdge.stateIndex, districtIndex)}
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
      {uniqueArray.map((item, districtIndex) => {
        return renderRow(item, districtIndex);
      })}
    </div>
  );
};

DistrictList.propTypes = {
  listData: PropTypes.array,
};

export default DistrictList;
