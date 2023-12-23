import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList";
import { districtFont } from "../../../jsStyles/Style";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const DistrictList = ({ listData }) => {
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
        stateIndex={index}
        type={TreeItemType.District}
        recursiveAccess={item.recursive === 1}
        expanded={false}
        displayData={item.name}
        displayDataStyle={districtFont}
        listComponent={getListComponent(item)}
      />
    );
  };

  const getListComponent = (item) => {
    return <CityList listData={item.cities} />;
  };

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

DistrictList.propTypes = {
  listData: PropTypes.array,
};

export default DistrictList;
