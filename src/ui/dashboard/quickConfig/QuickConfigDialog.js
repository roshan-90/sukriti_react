import React, { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TabContent,
  TabPane,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import { whiteSurface } from "../../../jsStyles/Style";
import QuickConfigDialogTab from "./QuickConfigDialogTab";

const QuickConfigDialog = React.forwardRef((props, ref) => {
  const [visibility, setVisibility] = useState(false);
  const [activeTab, setActiveTab] = useState(props.activeTab);

  let title = "";
  let onClickAction;

  const submitConfig = async () => {
    // topic, config, metadata
    let topic = {};
    let config = {};
    let metadata = {};
    // Implement your logic here
  };

  const toggleDialog = () => {
    setVisibility(!visibility);
  };

  const showDialog = (action) => {
    title = "Quick Config";
    onClickAction = action !== undefined ? action : undefined;
    setVisibility(!visibility);
  };

  const onClick = () => {
    console.log("_handleSubmitConfig", "onClick()");
    props.handleClick(activeTab);
  };

  const updateConfig = (configName, configValue) => {
    // Implement your logic here
  };

  const handleUpdate = () => {
    // Implement your logic here
  };

  const toggle = (configTabType) => {
    setActiveTab(configTabType);
  };

  const tabPane = () => {
    console.log("props.config -:👉", props);
    return (
      <>
        {props.tabData.map((item, index) => (
          <TabPane tabId={item.type} key={index}>
            <QuickConfigDialogTab
              configTab={item.type}
              handleUpdate={props.handleUpdate}
              configView={item.configView}
              clientList={props.clientList}
            />
          </TabPane>
        ))}
      </>
    );
  };
  React.useImperativeHandle(ref, () => ({
    toggleDialog,
    showDialog,
  }));

  return (
    <Modal
      isOpen={visibility}
      toggle={toggleDialog}
      className={"modal-la"}
      style={{ width: "900px" }}
    >
      <ModalHeader
        style={{ background: "#5DC0A6", color: `white` }}
        toggle={toggleDialog}
      >
        {title}
      </ModalHeader>
      <ModalBody
        style={{
          width: "100%",
          height: "600px",
          overflowY: "scroll",
        }}
      >
        <table style={{ width: "100%", padding: "0px" }}>
          <tbody>
            <tr>
              <td style={{ width: "100%" }}>
                <div
                  style={{
                    ...whiteSurface,
                    background: "white",
                    marginTop: "20px",
                    width: "100%",
                    padding: "10px",
                  }}
                >
                  <div className="animated fadeIn">
                    <Row>
                      <Col xs="12" md="12">
                        <Nav tabs>
                          {props.tabData.map((item, index) => (
                            <NavItem key={index}>
                              <NavLink
                                active={activeTab === item.type}
                                onClick={() => toggle(item.type)}
                              >
                                {item.label}
                              </NavLink>
                            </NavItem>
                          ))}
                        </Nav>
                        <TabContent activeTab={activeTab}>
                          {tabPane()}
                        </TabContent>
                      </Col>
                    </Row>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={onClick}>
          SUBMIT
        </Button>
      </ModalFooter>
    </Modal>
  );
});

export default QuickConfigDialog;
