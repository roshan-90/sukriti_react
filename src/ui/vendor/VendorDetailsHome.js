import React, { Component } from "react";
import {
  Col,
  Row,
} from "reactstrap";
import VendorDetails from "./VendorDetails";

class VendorDetailsHome extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    //👇
    console.log('VendorDetails -:👉', this.props)
    console.log('Vendor -:👉', this.props.location.data)
    //👆
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xs="12" md="12" >
            <VendorDetails history={this.props.history} user={this.props.location.data} />
          </Col>
        </Row>
      </div>
    );
  }

}



export default VendorDetailsHome;
