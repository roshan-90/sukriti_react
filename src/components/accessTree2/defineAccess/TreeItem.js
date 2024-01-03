import React from "react";
import {
  ExpandedRowRoot, CollapsedRowRoot, CollapsedRowRootWithRecursive,
  ExpandedRow, CollapsedRow, CollapsedRowWithRecursive,
  ComplexRow
} from "./TreeRowsDefineAccess"
import { TreeItemType } from "../../../nomenclature/nomenclature"

class TreeItemRoot extends React.Component {

  state = {
  };

  constructor(props) {

    super(props);
    console.log("_render", props)
    this.state = {
      expanded: props.expanded,
      displayData: props.displayData,
      listData: props.listData
    };
  }

  componentDidMount() {

  }

  render() {
    return (
      <this.DisplayRow expanded={this.state.expanded} />
    );
  }


  onCheckboxChange = (e) => {
    console.log("_check", e);
    this.props.handleUserSelection(this.props.type,this.props.treeEdge,e);
  }

  handleToggle = () => {
    console.log("_itemExpansion",""+this.props.selected);

    if (!this.props.selected) {
      var expanded = this.state.expanded
      this.setState({
        expanded: !expanded
      })
    }
  }

  DisplayRow = (props) => {
    var treeRowProps = {
      displayData: this.props.displayData,
      displayDataStyle: this.props.displayDataStyle,
      onCheckboxChange: this.onCheckboxChange,
      handleToggle: this.handleToggle,
      listComponent: this.props.listComponent,
      selected: this.props.selected
    }

    if (this.props.type === TreeItemType.State) {
      if (props.expanded) {

        return <ExpandedRowRoot treeRowProps={treeRowProps} />;
      }

      if (this.props.recursiveAccess)
        return <CollapsedRowRootWithRecursive treeRowProps={treeRowProps} />;

      return <CollapsedRowRoot treeRowProps={treeRowProps} />;
    }

    else if (this.props.type === TreeItemType.District) {
      if (props.expanded) {

        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      if (this.props.recursiveAccess)
        return <CollapsedRowWithRecursive treeRowProps={treeRowProps} />;

      return <CollapsedRow treeRowProps={treeRowProps} />;
    }

    else if (this.props.type === TreeItemType.City) {
      if (props.expanded) {

        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      if (this.props.recursiveAccess)
        return <CollapsedRowWithRecursive treeRowProps={treeRowProps} />;

      return <CollapsedRow treeRowProps={treeRowProps} />;
    }

    else if (this.props.type === TreeItemType.Complex) {
      return <ComplexRow treeRowProps={treeRowProps} />;
    }

  }
}

// TreeItem.propTypes = {
//   stateListData: PropTypes.array
// };

export default TreeItemRoot;
