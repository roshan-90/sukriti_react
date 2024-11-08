import React, { useState, useRef, useEffect } from "react";
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
import { CabinType,QuickConfigTabs } from "../../../nomenclature/nomenclature";
import icNonCritical from "../../../assets/img/icons/ic_health_ok.png";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../features/authenticationSlice";
import { GiConsoleController } from "react-icons/gi";
import { executePublishConfigLambda } from "../../../awsClients/quickConfigLambdas";

export const cabinDetailsStyle = {
  componentTitle: {
    color: `black`,
    fontSize: "18px",
    fontWeight: "bold",
    fontStyle: "bold",
  },
  cabinStatus: {
    gaugeTitle: {
      color: `black`,
      fontSize: "10px",
      fontWeight: "bold",
      fontStyle: "bold",
    },
    gaugeValue: {
      color: `black`,
      fontSize: "10px",
    },
  },
  cabinHealth: {
    itemTitle: {
      color: `black`,
      fontSize: "10px",
      fontWeight: "bold",
      fontStyle: "bold",
    },
    itemValue: {
      color: `black`,
      fontSize: "10px",
    },
  },
};

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
  const [paymentMode, setPaymentMode] = useState(null)
  const EntryArray = [
    { label: 'None', value: 'None'},
    { label: 'Coin', value: 'Coin'},
    { label: 'RFID', value: 'RFID'},
    { label: 'Coin and RF', value: 'Coin and RF'},
  ];
  const entryChargeRef = useRef("");
  const user = useSelector(selectUser);
  const [enteryCharge, setEnteryCharge] = useState("");

  useEffect(() => {
    setselectClient(null);
    setSelectedScope({
      [CabinType.MWC]: false,
      [CabinType.FWC]: false,
      [CabinType.PD]: false,
      [CabinType.MUR]: false,
    });
  }, []);


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
  
  function PaymentModeLabel() {  
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
          <Select options={EntryArray || []} value={paymentMode} onChange={handleupdatePaymentMode} placeholder="Select Payment" />
        </div>
      </div>
    );
  }

  const handleupdateEntryCharges = (e) => {
    // entryChargeRef.current = e.target.value;
    console.log('data', e.target.value)
    setEnteryCharge(e.target.value)
  }

  function handleupdatePaymentMode(data) {
    console.log('data', data)
    setPaymentMode(data)
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
                {/* <UsageChargeConfigView /> */}
                <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
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
                    <input
                      // ref={entryChargeRef}
                      defaultValue={enteryCharge}
                      type="text"
                      placeholder=""
                      onChange={(e) => handleupdateEntryCharges(e)}
                    />
                  </div>
                    </div>

                  {/* <EntryChargeLabel
                    configTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
                    handleUpdate={handleupdateEntryCharges}
                  /> */}
            
                  <PaymentModeLabel
                    configTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
                    handleUpdate={handleupdatePaymentMode}
                  />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
        
      </TabPane>
    );
  };

  // Function to generate  info target configuration array
  const createTargetConfig = (scope, client) => {
    console.log('user', user?.user)
    return Object.keys(scope)
      .filter((key) => scope[key]) // Filter only true values
      .map((key) => ({
        configType: "UCEMS/USAGE-CHARGE",
        user: user?.user.userName,
        client: user?.user.clientName,
        targetType: "Client",
        targetSubType: key.split(".")[1] == 'PD' ? "PWC" : key.split(".")[1], // Extract target type (e.g., "MWC" from "CabinType.MWC")
        targetName: client.value,
      }));
  };

  const createpayloadConfig = (scope, client, enteryCharge, paymentMode) => {
    console.log('user', user?.user)
    return Object.keys(scope)
      .filter((key) => scope[key]) // Filter only true values
      .map((key) => ({
        Cabinpaymentmode: paymentMode.value,
        Entrychargeamount: enteryCharge ?? 0,
        THING_NAME: client.value + "_ALL",
        cabin_type: key.split(".")[1] == "PD" ? "PWC" : key.split(".")[1], // Extract target type (e.g., "MWC" from "CabinType.MWC")
        user_type: key.split(".")[1] == "MWC" ? 'MALE' : key.split(".")[1] == "FWC" ? "FEMALE" : key.split(".")[1] == "PD" ? "PD" : key.split(".")[1] == "MUR" ? 'MALE' : "",
      }));
  };

  const handleClick = () => {
    console.log('selectedScope', selectedScope);
    console.log('selectClient', selectClient);
    console.log('paymentMode', paymentMode);
    console.log('enteryCharge', enteryCharge);
    const infoConfigArray = createTargetConfig(selectedScope,selectClient);
    const payloadConfigArray = createpayloadConfig(selectedScope, selectClient, enteryCharge,paymentMode);
    let object = {
      info: infoConfigArray,
      payload: payloadConfigArray,
      topic: `TEST/${selectClient.value}/TOPIC_SSF_READ_UCEMS_CONFIG`
    }
    console.log("infoConfigArray", infoConfigArray);
    console.log("payloadConfigArray", payloadConfigArray);
    console.log('payload', object);

  }

  const handleModalClose = () => {
    console.log('modal is close')
    setselectClient(null);
    setSelectedScope({
      [CabinType.MWC]: false,
      [CabinType.FWC]: false,
      [CabinType.PD]: false,
      [CabinType.MUR]: false,
    });
  }

  
  return (
    <Modal isOpen={visibility} toggle={toggleDialog} className="modal-la" style={{ width: "900px" }}  onClosed={handleModalClose} // This function will fire when the modal closes
>
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
        <Button color="primary" onClick={() => handleClick()}>
          SUBMIT
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default QuickConfigUsageModal;
