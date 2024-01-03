import React from "react";
import PropTypes from "prop-types";
import TreeItem from "./TreeItem";
import {TreeItemType} from "../../../nomenclature/nomenclature"
import { complexFont } from "../../../jsStyles/Style"

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

  renderRow = (item, index) => {
    return (
      <TreeItem  
      stateIndex = {index}
      type = {TreeItemType.Complex}
      //selected={item.access}
      displayData={item.name}
      displayDataStyle={complexFont}/>
    )
  }

}

ComplexList.propTypes = {
  listData: PropTypes.array
};

export default ComplexList;
