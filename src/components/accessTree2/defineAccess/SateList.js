import React from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList"
import TreeItem from "./TreeItem";
import { stateFont } from "../../../jsStyles/Style"
import {TreeItemType} from "../../../nomenclature/nomenclature"
import TreeEdge from "../../../Entity/TreeEdge";

class SateList extends React.Component {

  state = {

  };

  constructor(props) {
    super(props);
    this.state = {
      accessTree: props.listData
    };

  }

  componentDidMount() {
    
  }

  updateData(accessTree) {
    console.log("_storeUpdatedState","updateData()");
    this.setState({
      accessTree: accessTree
    });
  }


  render() {
    console.log("_storeUpdatedState","render: StateList");
    return (
      <div style={{ padding: "10px 10px 10px 10px", overflowY:"auto", height:"500px"}}>
        {this.state.accessTree.country.states.map((item, index) => {
          return this.renderRow(item, index);
        })}
      </div>
    );
  }

  handleToggle = () => {

  }

  renderRow = (item, stateIndex) => {
    var treeEdge = new TreeEdge(stateIndex)
    
    return (
      <TreeItem  
      treeEdge = {new TreeEdge(stateIndex)}
      type = {TreeItemType.State}
      recursiveAccess={item.recursive==1}
      expanded={false}
      selected = {item.selected}
      displayData={item.name}
      displayDataStyle={stateFont}
      listComponent={this.getListComponent(item,stateIndex)}
      handleUserSelection = {this.props.handleUserSelection}/>
    )
  }

  getListComponent = (item,stateIndex) => {
    return (
          < DistrictList
          treeEdge = {new TreeEdge(stateIndex)} 
          listData={item.districts} 
          handleUserSelection = {this.props.handleUserSelection}/>
    );
  }

}

SateList.propTypes = {
  stateListData: PropTypes.array
};

export default SateList;
