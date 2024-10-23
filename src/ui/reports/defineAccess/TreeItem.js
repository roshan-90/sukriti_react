import React, { useState, useEffect } from "react";
import {
  ExpandedRowRoot,
  CollapsedRowRoot,
  CollapsedRowRootWithRecursive,
  ExpandedRow,
  CollapsedRow,
  CollapsedRowWithRecursive,
  ComplexRow,
} from "./TreeRowsDefineAccess";
import { TreeItemType } from "../../../nomenclature/nomenclature";

const TreeItemRoot = (props) => {
  const [expanded, setExpanded] = useState(props.expanded);

  useEffect(() => {
    setExpanded(props.expanded);
  }, [props.expanded]);

  const onCheckboxChange = (e) => {
    console.log("_check", e);
    props.handleUserSelection(props.type, props.treeEdge, e);
  };

  const handleToggle = () => {
    console.log("_itemExpansion", "" + props.selected);

    if (!props.selected) {
      setExpanded(!expanded);
    }
  };

  const DisplayRow = () => {
    const treeRowProps = {
      displayData: props.displayData,
      displayDataStyle: props.displayDataStyle,
      onCheckboxChange: onCheckboxChange,
      handleToggle: handleToggle,
      listComponent: props.listComponent,
      selected: props.selected,
    };

    if (props.type === TreeItemType.State) {
      if (expanded) {
        return <ExpandedRowRoot treeRowProps={treeRowProps} />;
      }

      if (props.recursiveAccess) {
        return <CollapsedRowRootWithRecursive treeRowProps={treeRowProps} />;
      }

      return <CollapsedRowRoot treeRowProps={treeRowProps} />;
    } else if (
      props.type === TreeItemType.District ||
      props.type === TreeItemType.City
    ) {
      if (expanded) {
        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      if (props.recursiveAccess) {
        return <CollapsedRowWithRecursive treeRowProps={treeRowProps} />;
      }

      return <CollapsedRow treeRowProps={treeRowProps} />;
    } else if (props.type === TreeItemType.Complex) {
      return <ComplexRow treeRowProps={treeRowProps} />;
    }
  };

  return <DisplayRow />;
};

export default TreeItemRoot;
