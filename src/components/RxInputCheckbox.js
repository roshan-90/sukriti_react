import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";

const RxInputCheckbox = ({
  selected,
  label,
  withLabel,
  readOnly,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    setIsChecked(selected);
  }, [selected]);

  const onCheckboxChange = (e) => {
    console.log("_check", e.target.checked);
    onChange(e.target.checked);
  };

  const ComponentSelector = () => {
    if (withLabel) {
      return (
        <label>
          <input
            type="checkbox"
            enabled={false}
            onChange={(e) => onCheckboxChange(e)}
          />
          {"  " + label}
        </label>
      );
    } else if (readOnly) {
      return <input type="checkbox" checked={true} enabled={false} />;
    } else {
      return (
        <Input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => onCheckboxChange(e)}
        />
      );
    }
  };

  return <ComponentSelector />;
};

// RxInputCheckbox.propTypes = {
//   text: PropTypes.string,
//   placeholder: PropTypes.string,
//   onChange: PropTypes.func
// };

export default RxInputCheckbox;
