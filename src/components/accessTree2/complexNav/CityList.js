import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import {TreeItemType} from "../../../nomenclature/nomenclature"
import ComplexList from "./ComplexList"
import { cityFont } from "../../../jsStyles/Style"
import TreeEdge from "../../../Entity/TreeEdge"; 

class CityList extends React.Component {

  state = {
    text: ""
  };

  constructor(props) {
    super(props);
    console.log("_stateList")
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
        {this.props.listData.map((item, index) => {
          return this.renderRow(item, index);
          // return <this.DetailsElement data={item} />;

        })}
      </div>

    );
  }

  handleToggle = () => {
    console.log("_toggle")
  }

  renderRow = (item, cityIndex) => {
    return (
      <TreeItem
      type = {TreeItemType.District}
      treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,cityIndex)}
      type = {TreeItemType.City}
      recursiveAccess={item.recursive==1}
      expanded={false}
      displayData={item.name}
      displayDataStyle={cityFont}
      listComponent={this.getListComponent(item,cityIndex)}
      handleComplexSelection = {this.props.handleComplexSelection}/>
    )
  }

  getListComponent = (item,cityIndex) => {
  
    return (
          < ComplexList 
          listData={item.complexes}
          treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,cityIndex)}
          handleComplexSelection = {this.props.handleComplexSelection}
          />
    );
  }
}

CityList.propTypes = {
  listData: PropTypes.array
};

export default CityList;
