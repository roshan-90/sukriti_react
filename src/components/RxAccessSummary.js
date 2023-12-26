import React, { useState, useEffect } from "react";
import { NameValueList } from "./DisplayLabels";

const RxAccessSummary = (props) => {
  const [accessSummary, setAccessSummary] = useState(props.accessSummary);

  useEffect(() => {
    setAccessSummary(props.accessSummary);
  }, [props.accessSummary]);

  const ComponentSelector = () => {
    return <NameValueList data={accessSummary} />;
  };

  return <ComponentSelector />;
};

export default RxAccessSummary;
