import React, { useState } from "react";
import PropTypes from "prop-types";
import { whiteSurface } from "../../../jsStyles/Style";
import {
  ExpandedRowRoot,
  CollapsedRowRoot,
  ExpandedRow,
  CollapsedRow,
  ComplexRow,
} from "./TreeRows";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const TreeItemRoot = (props) => {
  const [expanded, setExpanded] = useState(props.expanded);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const handleComplexSelection = () => {
    props.handleComplexSelection(props.treeEdge);
  };

  const DisplayRow = () => {
    const treeRowProps = {
      displayData: props.displayData,
      displayDataStyle: props.displayDataStyle,
      handleToggle: handleToggle,
      listComponent: props.listComponent,
      AccesstreeData: props,
    };

    if (props.type === TreeItemType.State) {
      return expanded ? (
        <ExpandedRowRoot treeRowProps={treeRowProps} />
      ) : (
        <CollapsedRowRoot treeRowProps={treeRowProps} />
      );
    } else if (
      props.type === TreeItemType.District ||
      props.type === TreeItemType.City
    ) {
      return expanded ? (
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

  return <DisplayRow />;
};

TreeItemRoot.propTypes = {
  expanded: PropTypes.bool,
  displayData: PropTypes.string,
  displayDataStyle: PropTypes.object,
  listComponent: PropTypes.element,
  type: PropTypes.string,
  treeEdge: PropTypes.object,
  handleComplexSelection: PropTypes.func,
};

export default TreeItemRoot;
