import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList";
import TreeItem from "./TreeItem";
import { compactComplexnavStyle } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";
import "../../../ui/complexes/ComplexComposition.css";

const StateListReport = ({ listData, handleComplexSelection }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(listData.text);
  }, [listData.text]);

  const renderRow = (item, stateIndex) => {
    return (
      <TreeItem
        treeEdge={TreeEdge(stateIndex)}
        type={TreeItemType.State}
        expanded={false}
        displayData={item.name}
        displayDataStyle={compactComplexnavStyle.stateFont}
        listComponent={getListComponent(item, stateIndex)}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  const getListComponent = (item, stateIndex) => {
    return (
      <DistrictList
        treeEdge={TreeEdge(stateIndex)}
        listData={item.districts}
        handleComplexSelection={handleComplexSelection}
      />
    );
  };

  return (
    <div
      className="stateListReport"
      style={{ overflowY: "auto", height: "36vh", width: "100%" }}
    >
      {listData.country.states.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

StateListReport.propTypes = {
  listData: PropTypes.shape({
    text: PropTypes.string,
    country: PropTypes.shape({
      states: PropTypes.arrayOf(
        PropTypes.shape({
          name: PropTypes.string,
          districts: PropTypes.array,
        })
      ),
    }),
  }),
  handleComplexSelection: PropTypes.func,
};

export default StateListReport;
