import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import ComplexList from "./ComplexList";
import { cityFont } from "../../../jsStyles/Style";

const CityList = (props) => {
  const [state, setState] = useState({
    text: "",
  });

  useEffect(() => {
    setState({
      text: props.text,
    });
  }, [props.text]);

  const getText = () => {
    return state.text;
  };

  const setText = (text) => {
    setState({
      text: text,
    });
  };

  const handleToggle = () => {
    console.log("_toggle");
  };

  const renderRow = (item, index) => {
    return (
      <TreeItem
        stateIndex={index}
        type={TreeItemType.City}
        recursiveAccess={item.recursive === 1}
        expanded={false}
        displayData={item.name}
        displayDataStyle={cityFont}
        listComponent={getListComponent(item)}
      />
    );
  };

  const getListComponent = (item) => {
    return <ComplexList listData={item.complexes} />;
  };

  let jsonObject = props.listData.map(JSON.stringify);
  console.log(jsonObject);
  let uniqueSet = new Set(jsonObject);
  let uniqueArray = Array.from(uniqueSet).map(JSON.parse);

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {uniqueArray.map((item, index) => {
        return renderRow(item, index);
        // return <DetailsElement data={item} />;
      })}
    </div>
  );
};

CityList.propTypes = {
  listData: PropTypes.array,
};

export default CityList;
