import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";

const ComplexList = ({ listData, treeEdge, handleComplexSelection }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(listData.text);
  }, [listData.text]);

  const renderRow = (item, complexIndex) => {
    return (
      <TreeItem
        type={TreeItemType.Complex}
        treeEdge={TreeEdge(
          treeEdge.stateIndex,
          treeEdge.districtIndex,
          treeEdge.cityIndex,
          complexIndex
        )}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.complexFont}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {listData.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

ComplexList.propTypes = {
  listData: PropTypes.array,
  treeEdge: PropTypes.object,
  handleComplexSelection: PropTypes.func,
};

export default ComplexList;
