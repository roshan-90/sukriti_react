import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import {TreeItemType} from "../../../nomenclature/nomenclature";
import ComplexList from "./ComplexList";
import { cityFont } from "../../../jsStyles/Style";
import TreeEdge from "../../../Entity/TreeEdge";

class CityList extends React.Component {

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
        {this.props.listData.map((item, cityIndex) => {
          return this.renderRow(item, cityIndex);
          // return <this.DetailsElement data={item} />;

        })}
      </div>

    );
  }

  handleToggle = () => {
  }

  renderRow = (item, cityIndex) => {
    var treeEdge = new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,cityIndex);
    return (
      <TreeItem
      treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,cityIndex)}
      type = {TreeItemType.City}
      recursiveAccess={item.recursive==1}
      selected = {item.selected}
      expanded={false}
      displayData={item.name}
      displayDataStyle={cityFont}
      listComponent={this.getListComponent(item,cityIndex)}
      handleUserSelection = {this.props.handleUserSelection}/>
    )
  }

  getListComponent = (item,cityIndex) => {
    return (
          < ComplexList 
          listData={item.complexes}
          treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,cityIndex)}
          handleUserSelection = {this.props.handleUserSelection}/>
    );
  }
}

CityList.propTypes = {
  listData: PropTypes.array
};

export default CityList;
