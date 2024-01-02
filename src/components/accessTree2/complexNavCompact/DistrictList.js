import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const DistrictList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, districtIndex) => {
    return (
      <TreeItem
        type={TreeItemType.District}
        treeEdge={TreeEdge(props.treeEdge.stateIndex, districtIndex)}
        expanded={false}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.districtFont}
        listComponent={getListComponent(item, districtIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, districtIndex) => {
    return (
      <CityList
        listData={item.cities}
        treeEdge={TreeEdge(props.treeEdge.stateIndex, districtIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  // Create an array of objects
  const jsonObject = props.listData.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ overflow: "auto" }}>
      {uniqueArray.map((item, index) => renderRow(item, index))}
    </div>
  );
};

DistrictList.propTypes = {
  listData: PropTypes.array,
};

export default DistrictList;
