import React, { useState } from "react";
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from "reactstrap";
import MemberDetails from "./MemberDetails";
import MemberAccess from "./MemberAccess";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const MemberDetailsHome = (props) => {
  const [activeTab, setActiveTab] = useState(new Array(2).fill("1"));
  const { id } = useParams();
  let data = useSelector((state) => state.adminstration.teamList);

  let user_data = data.filter((data) => data.userName == id);

  console.log("props", user_data[0]);
  const toggle = (tabPane, tab) => {
    const newArray = activeTab.slice();
    newArray[tabPane] = tab;
    setActiveTab(newArray);
  };

  const tabPane = () => {
    // if (!props.location || !props.location.data) {
    //   return null; // Render nothing if data is not available
    // }
    return (
      <>
        <TabPane tabId="2">
          <MemberAccess user={user_data[0]} />
        </TabPane>
        <TabPane tabId="1">
          <MemberDetails user={user_data[0]} />
        </TabPane>
      </>
    );
  };

  return (
    <div className="animated fadeIn">
      <Row>
        <Col xs="12" md="12">
          <Nav tabs>
            <NavItem>
              <NavLink
                active={activeTab[0] === "1"}
                onClick={() => {
                  toggle(0, "1");
                }}
              >
                Member Profile
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                active={activeTab[0] === "2"}
                onClick={() => {
                  toggle(0, "2");
                }}
              >
                Member Access
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab[0]}>{tabPane()}</TabContent>
        </Col>
      </Row>
    </div>
  );
};

export default MemberDetailsHome;
