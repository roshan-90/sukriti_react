import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import ComplexList from "./ComplexList";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";

const CityList = ({ listData, treeEdge, handleComplexSelection }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(listData.text);
  }, [listData.text]);

  const renderRow = (item, cityIndex) => {
    return (
      <TreeItem
        treeEdge={TreeEdge(
          treeEdge.stateIndex,
          treeEdge.districtIndex,
          cityIndex
        )}
        type={TreeItemType.City}
        recursiveAccess={item.recursive === 1}
        expanded={false}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.cityFont}
        listComponent={getListComponent(item, cityIndex)}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, cityIndex) => {
    return (
      <ComplexList
        listData={item.complexes}
        treeEdge={TreeEdge(
          treeEdge.stateIndex,
          treeEdge.districtIndex,
          cityIndex
        )}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  // Create an array of objects
  const jsonObject = listData.map(JSON.stringify);
  const uniqueSet = new Set(jsonObject);
  const uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {uniqueArray.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

CityList.propTypes = {
  listData: PropTypes.array,
  treeEdge: PropTypes.object,
  handleComplexSelection: PropTypes.func,
};

export default CityList;
