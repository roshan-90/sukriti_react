import React from "react";
import { Col, Row } from "reactstrap";
import VendorDetails from "./VendorDetails";

const VendorDetailsHome = (props) => {
  //👇
  console.log("VendorDetails -:👉", props);
  console.log("Vendor -:👉", props.location.data);
  //👆

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" md="12">
          <VendorDetails history={props.history} user={props.location.data} />
        </Col>
      </Row>
    </div>
  );
};

export default VendorDetailsHome;
