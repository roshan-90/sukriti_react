import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList";
import { districtFont } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const DistrictList = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const renderRow = (item, districtIndex) => {
    return (
      <TreeItem
        type={TreeItemType.District}
        treeEdge={new TreeEdge(props.treeEdge.stateIndex, districtIndex)}
        expanded={false}
        displayData={item.name}
        displayDataStyle={districtFont}
        listComponent={getListComponent(item, districtIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, districtIndex) => {
    return (
      <CityList
        listData={item.cities}
        treeEdge={new TreeEdge(props.treeEdge.stateIndex, districtIndex)}
        handleComplexSelection={props.handleComplexSelection}
      />
    );
  };

  console.log("_identify", "DistrictList: render(2)");

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {props.listData.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

DistrictList.propTypes = {
  listData: PropTypes.array,
};

export default DistrictList;
