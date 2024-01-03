import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import {TreeItemType} from "../../../nomenclature/nomenclature"
import { complexFont } from "../../../jsStyles/Style"
import TreeEdge from "../../../Entity/TreeEdge"; 

class ComplexList extends React.Component {

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

  renderRow = (item, complexIndex) => {
    return (
      <TreeItem  
      type = {TreeItemType.Complex}
      treeEdge = {new TreeEdge(this.props.treeEdge.stateIndex,this.props.treeEdge.districtIndex,this.props.treeEdge.cityIndex,complexIndex)}
      displayData={item.name}
      displayDataStyle={complexFont}
      handleComplexSelection = {this.props.handleComplexSelection}
      />
    )
  }

}

ComplexList.propTypes = {
  listData: PropTypes.array
};

export default ComplexList;
