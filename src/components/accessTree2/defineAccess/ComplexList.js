import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import {TreeItemType} from "../../../nomenclature/nomenclature";
import { complexFont } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";

class ComplexList extends React.Component {

  state = {
    text: ""
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.setState({
      text: this.props.text
    });
  }


  getText() {
    return this.state.text;
  }

  setText(text) {
    this.setState({
      text: text
    });
  }


  render() {
    console.log("_storeUpdatedState","render: ComplexList");
    return (
      <div style={{ padding: "10px 10px 10px 10px", overflow:"auto" }}>
        {this.props.listData.map((item, complexIndex) => {
          return this.renderRow(item, complexIndex);
          // return <this.DetailsElement data={item} />;

        })}
      </div>

    );
  }

  handleToggle = () => {
  }

  renderRow = (item, complexIndex) => {
    var treeEdge = new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,this.props.treeEdge.cityIndex,complexIndex);
    
    return (
      <TreeItem  
      treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,this.props.treeEdge.cityIndex,complexIndex)}
      type = {TreeItemType.Complex}
      selected = {item.selected}
      displayData={item.name}
      displayDataStyle={complexFont}
      handleUserSelection = {this.props.handleUserSelection}/>
    )
  }

}

ComplexList.propTypes = {
  listData: PropTypes.array
};

export default ComplexList;
