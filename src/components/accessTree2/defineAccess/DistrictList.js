import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList";
import { districtFont } from "../../../jsStyles/Style";
import {TreeItemType} from "../../../nomenclature/nomenclature";
import TreeEdge from "../../../Entity/TreeEdge";

class DistrictList extends React.Component {

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
    return (
      <div style={{ padding: "10px 10px 10px 10px", overflow:"auto" }}>
        {this.props.listData.map((item, districtIndex) => {
          return this.renderRow(item, districtIndex);
          // return <this.DetailsElement data={item} />;

        })}
      </div>

    );
  }

  handleToggle = () => {

  }

  renderRow = (item, districtIndex) => {
    var treeEdge = new TreeEdge(this.props.treeEdge.stateIndex,districtIndex);
    
    return (
      <TreeItem
      type = {TreeItemType.District}
      treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,districtIndex)}
      recursiveAccess={item.recursive==1}
      expanded={false}
      selected = {item.selected}
      displayData={item.name}
      displayDataStyle={districtFont}
      listComponent={this.getListComponent(item,districtIndex)}
      handleUserSelection = {this.props.handleUserSelection}/>
    )
  }

  getListComponent = (item,districtIndex) => {
    return (
          < CityList 
          listData={item.cities}
          treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,districtIndex)}
          handleUserSelection = {this.props.handleUserSelection}
          />
          
    );
  }
}

DistrictList.propTypes = {
  listData: PropTypes.array
};

export default DistrictList;
