import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Button,
} from "reactstrap";
import Select from 'react-select'; // Importing react-select
import { dashboardStyle } from "../../../jsStyles/Style";
import { whiteSurface } from "../../../jsStyles/Style";
import RxInputCheckbox from "./utils/RxInputCheckbox";
import { CabinType } from "../../../nomenclature/nomenclature";
import { QuickConfigTabs } from "../nomenclature/nomenclature";

const QuickConfigUsageModal = ({ visibility, toggleDialog, title, tabData, onClick, clientList}) => {
  const [activeTab, setActiveTab] = useState(tabData[0]?.type || "");
  const [selectClient, setselectClient] = useState(null);
  const [selectedScope, setSelectedScope] = useState({
    [CabinType.MWC]: false,
    [CabinType.FWC]: false,
    [CabinType.PD]: false,
    [CabinType.MUR]: false,
  });
  const configViewData = {};
  const [entryCharge, setEntryCharge] = useState(0)
  const [paymentMode, setPaymentMode] = useState(null)

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleChangeClient = (selectedOption) => {
    console.log('handleChangeClient',selectedOption);
    setselectClient(selectedOption);
  }

  // Function to handle selection changes
  const onScopeSelected = (type) => (event) => {
    setSelectedScope((prevScope) => ({
      ...prevScope,
      [type]: event.target.checked,
    }));
  };


  const ClientSelection = () => {
    return (
      <div className="row">
        <div className="col-md-4">
          <div style={{ ...dashboardStyle.label, float: "right" }}>
            Client Selection
          </div>
        </div>

        <div className="col-md-8">
        <Select options={clientList || []} value={selectClient} onChange={handleChangeClient} placeholder="Please Select Client" />
        </div>
      </div>
    );
  };

  const ScopeConfig = () => {
    return (
      <div className="row" style={{ marginTop: "20px" }}>
        <div className="col-md-4">
          <div style={{ ...dashboardStyle.label, float: "right" }}>
            Scope Config
          </div>
        </div>

        <div className="col-md-8">
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%" }}>
                  <div>
                    <label>
                        <input
                        type="checkbox"
                        checked={selectedScope[CabinType.MWC]}
                        onChange={onScopeSelected(CabinType.MWC)}
                        />
                        Male WC
                    </label>
                  </div>
                </td>
                <td style={{ width: "50%" }}>
                  <div>
                    <label>
                        <input
                        type="checkbox"
                        checked={selectedScope[CabinType.FWC]}
                        onChange={onScopeSelected(CabinType.FWC)}
                        />
                        Female WC
                    </label>
                  </div>
                </td>
              </tr>

              <tr>
                <td style={{ width: "50%" }}>
                  <div>
                    <label>
                        <input
                        type="checkbox"
                        checked={selectedScope[CabinType.PD]}
                        onChange={onScopeSelected(CabinType.PD)}
                        />
                        PD WC
                    </label>
                  </div>
                </td>

                <td style={{ width: "50%" }}>
                  <div>
                    <label>
                        <input
                        type="checkbox"
                        checked={selectedScope[CabinType.MUR]}
                        onChange={onScopeSelected(CabinType.MUR)}
                        />
                        Male Urinal
                    </label>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  function EntryChargeLabel(props) {
    const [duration, setDuration] = useState(props.defaultEntryCharge);
  
    return (
      <div
        className="row"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0",
          margin: "0px 0px 30px 0px",
        }}
      >
        <div
          className="col-md-2"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0",
          }}
        >
          <div
            style={{
              ...cabinDetailsStyle.cabinHealth.itemTitle,
              textAlign: "end",
            }}
          >
            {"Entry Charge"}
          </div>
        </div>
  
        <div
          className="col-md-1"
          style={{
            marginLeft: "12px",
          }}
        >
          &#x20b9;
        </div>
        <div
          className="col-md-6"
          style={{
            marginLeft: "8px",
          }}
        >
          <RxInputText
            text={props.defaultEntryCharge}
            placeholder={""}
            onChange={(text) => {
              console.log("_onChange", text);
              props.handleUpdate(props.configTab, props.id, text);
            }}
          />
        </div>
      </div>
    );
  }
  
  function PaymentModeLabel(props) {
    const [paymentMode, setPaymentMode] = useState(props.defaultPaymentMode);
  
    return (
      <div
        className="row"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "0",
          margin: "0px 0px 30px 0px",
        }}
      >
        <div
          className="col-md-2"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0",
          }}
        >
          <div
            style={{
              ...cabinDetailsStyle.cabinHealth.itemTitle,
              textAlign: "end",
            }}
          >
            {"Payment Mode"}
          </div>
        </div>
  
        <div
          className="col-md-1"
          style={{
            marginLeft: "12px",
          }}
        >
          <img
            src={icNonCritical}
            alt=""
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "5%",
            }}
          />
        </div>
        <div
          className="col-md-6"
          style={{
            marginLeft: "8px",
          }}
        >
          <Dropdown
            options={["None", "Coin", "RFID", "Coin and RF"]}
            // onChange={(text) => {
            //   console.log('_onChange', text)
            //   props.handleUpdate(props.configTab,props.id,text)
            //  }}
            onSelection={(index, value) => {
              setPaymentMode(value);
              props.handleUpdate(props.configTab, props.id, value);
            }}
            // onSelection={(index,value) => {setCriticality(value); {props.onSelection(index,value)}}}
          />
        </div>
      </div>
    );
  }

  function handleupdateEntryCharges(data) {
    console.log('data', data)
  }

  function handleupdatePaymentMode(data) {
    console.log('data', data)
  }


  function UsageChargeConfigView(props) {
    return (
      <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
        <EntryChargeLabel
          configTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
          handleUpdate={handleupdateEntryCharges}
        />
  
        <PaymentModeLabel
          configTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
          handleUpdate={handleupdatePaymentMode}
        />
      </div>
    );
  }

  const renderTabPane = () => {
    const activeConfigView = tabData.find((item) => item.type === activeTab)?.configView;
    return (
      <TabPane tabId={activeTab}>
        <table style={{ width: "100%", padding: "0px" }}>
        <tbody>
          <tr>
            <td style={{ width: "100%" }}>
              <div
                style={{
                  ...dashboardStyle.label,
                  width: "100%",
                }}
              >
                Below listed parameters control the Usage Charge and Payment
                Mode settings for the units. The changes made here will take
                effect for all the units/cabins as per the selections made in
                the Config-Scope Section.
              </div>
            </td>
          </tr>

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
                {/*  client selection */}
                <ClientSelection />
                {/*  Scope Config */}
                <ScopeConfig />
              </div>
            </td>
          </tr>

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
                <UsageChargeConfigView />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        
      </TabPane>
    );
  };

  const handleClick = () => {
    console.log('selectedScope', selectedScope);
    console.log('selectClient', selectClient);

  }

  return (
    <Modal isOpen={visibility} toggle={toggleDialog} className="modal-la" style={{ width: "900px" }}>
      <ModalHeader style={{ background: "#5DC0A6", color: "white" }} toggle={toggleDialog}>
        {title}
      </ModalHeader>
      <ModalBody style={{ width: "100%", height: "600px", overflowY: "scroll" }}>
        <table style={{ width: "100%", padding: "0px" }}>
          <tbody>
            <tr>
              <td style={{ width: "100%" }}>
                <div
                  style={{
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
                          {tabData.map((item, index) => (
                            <NavItem key={index}>
                              <NavLink
                                active={activeTab === item.type}
                                onClick={() => toggleTab(item.type)}
                              >
                                {item.label}
                              </NavLink>
                            </NavItem>
                          ))}
                        </Nav>
                        <TabContent activeTab={activeTab}>
                          {renderTabPane()}
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
        <Button color="primary" onClick={() => onClick({selectedScope,selectClient })}>
          SUBMIT
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default QuickConfigUsageModal;
