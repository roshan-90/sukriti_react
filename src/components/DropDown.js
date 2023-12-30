import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";

const DropDown = (props) => {
  const [dropdownList, setDropdownList] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");

  useEffect(() => {
    console.log(
      "_getIndex2",
      props.currentIndex,
      props.options[props.currentIndex]
    );

    if (props.options !== undefined) {
      setDropdownList(props.options);
      setSelectedItem(props.options[props.currentIndex]);
    }
  }, [props.currentIndex, props.options]);

  const getSelection = () => {
    return selectedItem;
  };

  const setSelectedOption = (selectedIndex) => {
    props.onSelection(selectedIndex, props.options[selectedIndex]);
    setSelectedItem(props.options[selectedIndex]);
    console.log(selectedIndex, "selectedIndex");
  };

  const helper = (mOption, index) => {
    if (selectedItem === index) {
      console.log("_getIndex3", selectedItem);
      return (
        <option key={index} selected>
          {mOption}
        </option>
      );
    } else return <option key={index}>{mOption}</option>;
  };

  return (
    <Input
      type="select"
      onChange={(e) => setSelectedOption(e.target.selectedIndex)}
    >
      {props.options.map((mOption, index) => {
        return helper(mOption, index);
      })}
    </Input>
  );
};

DropDown.propTypes = {
  options: PropTypes.array.isRequired,
  onSelection: PropTypes.func.isRequired,
  currentIndex: PropTypes.number,
};

export default DropDown;
