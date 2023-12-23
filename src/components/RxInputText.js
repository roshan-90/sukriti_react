import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Input } from "reactstrap";

const RxInputText = ({ text, placeholder, onChange }) => {
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setInputText(text);
  }, [text]);

  const handleInputChange = (event) => {
    const newValue = event.target.value;
    console.log("_isNumb", newValue, !isNaN(newValue));
    if (!isNaN(newValue) && !newValue.includes(".")) {
      onChange(newValue);
      setInputText(newValue);
    }
  };

  return (
    <Input
      value={inputText}
      type="text"
      placeholder={placeholder}
      onChange={handleInputChange}
    />
  );
};

RxInputText.propTypes = {
  text: PropTypes.string,
  placeholder: PropTypes.string,
  onChange: PropTypes.func,
};

export default RxInputText;
