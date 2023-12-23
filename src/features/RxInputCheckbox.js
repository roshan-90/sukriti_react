import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";

const RxInputCheckbox = (props) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(props.text);
  }, [props.text]);

  const onCheckboxChange = (e) => {
    console.log("_check", e.target.checked);
    props.onChange(e.target.checked);
  };

  const ComponentSelector = () => {
    if ("withLabel" in props) {
      return (
        <label>
          <input
            type="checkbox"
            // checked={props.selected}
            enabled={false}
            onChange={(e) => onCheckboxChange(e)}
          />
          {"  " + props.label}
        </label>
      );
    } else if ("readOnly" in props) {
      return (
        <input type="checkbox" checked={true} enabled={false} />
      );
    } else {
      return (
        <Input
          type="checkbox"
          checked={props.selected}
          onChange={(e) => onCheckboxChange(e)}
        />
      );
    }
  };

  return <ComponentSelector />;
};

export default RxInputCheckbox;
