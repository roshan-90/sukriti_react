import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import { TreeItemType } from "../../../nomenclature/nomenclature";
import { complexFont } from "../../../jsStyles/Style";

const ComplexList = (props) => {
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
        type={TreeItemType.Complex}
        // selected={item.access}
        displayData={item.name}
        displayDataStyle={complexFont}
      />
    );
  };

  return (
    <div style={{ padding: "10px 10px 10px 10px", overflow: "auto" }}>
      {props.listData.map((item, index) => {
        return renderRow(item, index);
        // return <DetailsElement data={item} />;
      })}
    </div>
  );
};

ComplexList.propTypes = {
  listData: PropTypes.array,
};

export default ComplexList;
