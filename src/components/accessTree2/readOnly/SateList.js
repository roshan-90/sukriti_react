import React from "react";
import PropTypes from "prop-types";
import DistrictList from "./DistrictList"
import TreeItem from "./TreeItem";
import { stateFont } from "../../../jsStyles/Style"
import {TreeItemType} from "../../../nomenclature/nomenclature"

class SateList extends React.Component {

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
      <div style={{ padding: "10px 10px 10px 10px", overflowY:"auto", height:"500px"}}>
        {this.props.listData.map((item, index) => {
          return this.renderRow(item, index);
        })}
      </div>
    );
  }

  handleToggle = () => {
    console.log("_toggle")
  }

  renderRow = (item, index) => {
    return (
      <TreeItem  
      stateIndex = {index}
      type = {TreeItemType.State}
      recursiveAccess={item.recursive==1}
      expanded={false}
      displayData={item.name}
      displayDataStyle={stateFont}
      listComponent={this.getListComponent(item,index)}/>
    )
  }

  getListComponent = (item,index) => {
    return (
          < DistrictList stateIndex = {index} listData={item.districts}/>
    );
  }

}

SateList.propTypes = {
  stateListData: PropTypes.array
};

export default SateList;
