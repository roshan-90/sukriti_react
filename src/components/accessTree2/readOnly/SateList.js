import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList";
import TreeItem from "./TreeItem";
import { stateFont } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const StateList = ({ listData }) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(text);
  }, [text]);

  const getText = () => {
    return text;
  };

  const SetText = (newText) => {
    setText(newText);
  };

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, index) => {
    return (
      <TreeItem
        key={index}
        stateIndex={index}
        type={TreeItemType.State}
        recursiveAccess={item.recursive === 1}
        expanded={false}
        displayData={item.name}
        displayDataStyle={stateFont}
        listComponent={getListComponent(item, index)}
      />
    );
  };

  const getListComponent = (item, index) => {
    return (
      <DistrictList key={index} stateIndex={index} listData={item.districts} />
    );
  };

  return (
    <div
      style={{
        padding: "10px 10px 10px 10px",
        overflowY: "auto",
        height: "500px",
      }}
    >
      {listData.map((item, index) => {
        return renderRow(item, index);
      })}
    </div>
  );
};

export default StateList;
