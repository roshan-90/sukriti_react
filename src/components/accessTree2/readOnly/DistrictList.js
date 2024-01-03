import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import CityList from "./CityList"
import { districtFont } from "../../../jsStyles/Style"
import {TreeItemType} from "../../../nomenclature/nomenclature"

class DistrictList extends React.Component {

  state = {
    text: ""
  };

  constructor(props) {
    super(props);
    console.log("_identify","DistrictList: constructor(2)");
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
    console.log("_identify","DistrictList: render(2)");
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

  renderRow = (item, index) => {
    return (
      <TreeItem
      stateIndex = {index}
      type = {TreeItemType.District}
      recursiveAccess={item.recursive==1}
      expanded={false}
      displayData={item.name}
      displayDataStyle={districtFont}
      listComponent={this.getListComponent(item)}/>
    )
  }

  getListComponent = (item) => {
  
    return (
          < CityList listData={item.cities}/>
          
    );
  }
}

DistrictList.propTypes = {
  listData: PropTypes.array
};

export default DistrictList;
