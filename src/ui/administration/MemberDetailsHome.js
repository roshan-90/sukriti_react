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

const MemberDetailsHome = (props) => {
  const [activeTab, setActiveTab] = useState(new Array(2).fill("1"));

  const toggle = (tabPane, tab) => {
    const newArray = activeTab.slice();
    newArray[tabPane] = tab;
    setActiveTab(newArray);
  };

  const tabPane = () => {
    if (!props.location || !props.location.data) {
      return null; // Render nothing if data is not available
    }

    return (
      <>
        <TabPane tabId="2">
          <MemberAccess user={props.location.data} history={props.history} />
        </TabPane>
        <TabPane tabId="1">
          <MemberDetails history={props.history} user={props.location.data} />
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
