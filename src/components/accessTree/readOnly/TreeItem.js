import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { whiteSurface } from "../../../jsStyles/Style";
import { Col, Row, Label, Input, Button } from "reactstrap";
import {
  ExpandedRowRoot,
  CollapsedRowRoot,
  CollapsedRowRootRecursive,
  ExpandedRow,
  CollapsedRow,
  CollapsedRowRecursive,
  ComplexRowSelected,
  ComplexRow,
} from "./TreeRowsReadOnly";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const TreeItemRoot = (props) => {
  const [state, setState] = useState({
    expanded: props.expanded,
    displayData: props.displayData,
    listData: props.listData,
  });

  useEffect(() => {
    // componentDidMount logic here
  }, []);

  const onCheckboxChange = (e) => {
    console.log("_check", props.type, props.stateIndex);
  };

  const handleToggle = () => {
    if (!props.recursiveAccess) {
      setState((prevState) => ({
        ...prevState,
        expanded: !prevState.expanded,
      }));
    }
  };

  const DisplayRow = () => {
    const treeRowProps = {
      displayData: props.displayData,
      displayDataStyle: props.displayDataStyle,
      onCheckboxChange: onCheckboxChange,
      handleToggle: handleToggle,
      listComponent: props.listComponent,
    };

    if (props.type === TreeItemType.State) {
      if (state.expanded) {
        return <ExpandedRowRoot treeRowProps={treeRowProps} />;
      }

      if (props.recursiveAccess)
        return <CollapsedRowRootRecursive treeRowProps={treeRowProps} />;

      return <CollapsedRowRoot treeRowProps={treeRowProps} />;
    } else if (props.type === TreeItemType.District) {
      if (state.expanded) {
        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      if (props.recursiveAccess)
        return <CollapsedRowRecursive treeRowProps={treeRowProps} />;

      return <CollapsedRow treeRowProps={treeRowProps} />;
    } else if (props.type === TreeItemType.City) {
      if (state.expanded) {
        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      if (props.recursiveAccess)
        return <CollapsedRowRecursive treeRowProps={treeRowProps} />;

      return <CollapsedRow treeRowProps={treeRowProps} />;
    } else if (props.type === TreeItemType.Complex) {
      return <ComplexRowSelected treeRowProps={treeRowProps} />;
    }
  };

  return <DisplayRow />;
};

TreeItemRoot.propTypes = {
  // Add your prop types here
};

export default TreeItemRoot;
