import React from "react";
import { Col, Row } from "reactstrap";
import VendorDetails from "./VendorDetails";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const VendorDetailsHome = (props) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  let List = useSelector((state) => state.vendor.teamList);
  console.log("VendorDetails -:👉", props);
  // console.log("Vendor -:👉", props.location.data);
  //👆

  console.log("id-->", id);
  console.log("List -->", List);
  const [teamList] = List.filter((data) => data?.vendor_name === id);
  console.log("teamlist-->", teamList);

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" md="12">
          <VendorDetails user={teamList} />
        </Col>
      </Row>
    </div>
  );
};

export default VendorDetailsHome;
