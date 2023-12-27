import React, { useState } from "react";
import PropTypes from "prop-types";
import { whiteSurface } from "../../../jsStyles/Style";
import { Col, Row, Label, Input, Button } from "reactstrap";
import {
  ExpandedRowRoot,
  CollapsedRowRoot,
  ExpandedRow,
  CollapsedRow,
  ComplexRow,
} from "./TreeRows";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const TreeItemRoot = (props) => {
  const [state, setState] = useState({
    expanded: props.expanded,
    displayData: props.displayData,
    listData: props.listData,
  });

  const handleToggle = () => {
    setState((prevState) => ({
      ...prevState,
      expanded: !prevState.expanded,
    }));
  };

  const handleComplexSelection = () => {
    props.handleComplexSelection(props.treeEdge);
  };

  const DisplayRow = (props) => {
    const treeRowProps = {
      displayData: props.displayData,
      displayDataStyle: props.displayDataStyle,
      handleToggle: handleToggle,
      listComponent: props.listComponent,
    };

    if (props.type === TreeItemType.State) {
      return props.expanded ? (
        <ExpandedRowRoot treeRowProps={treeRowProps} />
      ) : (
        <CollapsedRowRoot treeRowProps={treeRowProps} />
      );
    } else if (
      props.type === TreeItemType.District ||
      props.type === TreeItemType.City
    ) {
      return props.expanded ? (
        <ExpandedRow treeRowProps={treeRowProps} />
      ) : (
        <CollapsedRow treeRowProps={treeRowProps} />
      );
    } else if (props.type === TreeItemType.Complex) {
      return (
        <ComplexRow
          treeRowProps={treeRowProps}
          handleComplexSelection={handleComplexSelection}
        />
      );
    }
  };

  console.log("_render", props);

  return <DisplayRow expanded={state.expanded} />;
};

TreeItemRoot.propTypes = {
  expanded: PropTypes.bool,
  displayData: PropTypes.any,
  listData: PropTypes.array,
  type: PropTypes.string,
  treeEdge: PropTypes.object,
  displayDataStyle: PropTypes.object,
  listComponent: PropTypes.element,
  handleComplexSelection: PropTypes.func,
};

export default TreeItemRoot;
