import React from "react";
import { Col, Row } from "reactstrap";
import { whiteSurface } from "../../jsStyles/Style";


const UserProfile = () => {

return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" md="12">
        <div
      className="col-md-10 offset-md-2"
      style={{
        ...whiteSurface,
        width: "80%",
        margin: "auto",
        background: "white",
        marginTop: "20px",
      }}
    >

      <div style={{ margin: "50px 150px", clear: "both" }}>
        <h4>sdfsd sdf</h4>
      </div>
    </div>
        </Col>
      </Row>
    </div>
)

}

export default UserProfile