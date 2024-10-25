import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList";
import TreeItem from "./TreeItem";
import { stateFont } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

const SateList = (props) => {
  const [accessTree, setAccessTree] = useState(props.listData);

  useEffect(() => {
    console.log("_storeUpdatedState", "updateData()");
    setAccessTree(props.listData);
  }, [props.listData]);

  const handleToggle = () => {};

  const renderRow = (item, stateIndex) => {
    console.log("item",item)
    const treeEdge = TreeEdge(stateIndex);

    return (
      <TreeItem
        treeEdge={TreeEdge(stateIndex)}
        type={TreeItemType.State}
        recursiveAccess={item.recursive === 1}
        expanded={item?.expanded == true ? true : false}
        selected={item.selected}
        displayData={item.name}
        displayDataStyle={stateFont}
        listComponent={getListComponent(item, stateIndex)}
        handleUserSelection={props.handleUserSelection}
      />
    );
  };

  const getListComponent = (item, stateIndex) => {
    return (
      <DistrictList
        treeEdge={TreeEdge(stateIndex)}
        listData={item.districts}
        handleUserSelection={props.handleUserSelection}
      />
    );
  };

  console.log("_storeUpdatedState", "render: StateList");
  return (
    <div
      style={{
        padding: "10px 10px 10px 10px",
        overflowY: "auto",
        height: "500px",
      }}
    >
      {accessTree.country.states.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

SateList.propTypes = {
  stateListData: PropTypes.array,
};

export default SateList;
