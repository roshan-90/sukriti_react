import React from "react";
import PropTypes from "prop-types";
import { whiteSurface } from "../../../jsStyles/Style"
import { Col, Row, Label, Input, Button } from "reactstrap";
import { 
  ExpandedRowRoot, 
  CollapsedRowRoot,
  ExpandedRow, 
  CollapsedRow,
  ComplexRow, 
  } from "./TreeRows"
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

  handleToggle = () => {
    var expanded = this.state.expanded
      this.setState({
        expanded: !expanded
      })
  }

  handleComplexSelection = () =>{
    this.props.handleComplexSelection(this.props.treeEdge);
  }

  DisplayRow = (props) => {

    var treeRowProps = {
      displayData: this.props.displayData,
      displayDataStyle: this.props.displayDataStyle,
      handleToggle: this.handleToggle,
      listComponent: this.props.listComponent
    }

    if (this.props.type === TreeItemType.State) {
      if (props.expanded) {

        return <ExpandedRowRoot treeRowProps={treeRowProps} />;
      }

      return <CollapsedRowRoot treeRowProps={treeRowProps} />;
    }

    else if (this.props.type === TreeItemType.District) {
      if (props.expanded) {

        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      return <CollapsedRow treeRowProps={treeRowProps} />;
    }

    else if (this.props.type === TreeItemType.City) {
      if (props.expanded) {

        return <ExpandedRow treeRowProps={treeRowProps} />;
      }

      return <CollapsedRow treeRowProps={treeRowProps} />;
    }

    else if (this.props.type === TreeItemType.Complex) {

      return <ComplexRow treeRowProps={treeRowProps} handleComplexSelection={this.handleComplexSelection}/>;
    }

  }
}

// TreeItem.propTypes = {
//   stateListData: PropTypes.array
// };

export default TreeItemRoot;
