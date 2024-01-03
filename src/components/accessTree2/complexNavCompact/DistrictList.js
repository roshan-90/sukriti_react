import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const DistrictList = ({ listData, treeEdge, handleComplexSelection }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(listData.text);
  }, [listData.text]);

  const renderRow = (item, districtIndex) => {
    return (
      <TreeItem
        type={TreeItemType.District}
        treeEdge={TreeEdge(treeEdge.stateIndex, districtIndex)}
        expanded={false}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.districtFont}
        listComponent={getListComponent(item, districtIndex)}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, districtIndex) => {
    return (
      <CityList
        listData={item.cities}
        treeEdge={TreeEdge(treeEdge.stateIndex, districtIndex)}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  // Create an array of objects
  let jsonObject = listData.map(JSON.stringify);
  let uniqueSet = new Set(jsonObject);
  let uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ overflow: "auto" }}>
      {uniqueArray.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

DistrictList.propTypes = {
  listData: PropTypes.array,
  treeEdge: PropTypes.object,
  handleComplexSelection: PropTypes.func,
};

export default DistrictList;
