import React, { useState, useEffect } from "react";
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
import Select from "react-select"; // Importing react-select
import { dashboardStyle } from "../../../jsStyles/Style";
import { whiteSurface } from "../../../jsStyles/Style";
import { CabinType, QuickConfigTabs } from "../../../nomenclature/nomenclature";
import icNonCritical from "../../../assets/img/icons/ic_health_ok.png";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../../features/authenticationSlice";
import { executePublishConfigLambda } from "../../../awsClients/quickConfigLambdas";
import MessageDialog from "../../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import { startLoading, stopLoading } from "../../../features/loadingSlice";
import CircularProgress from "@mui/material/CircularProgress";
import icCritical from "../../../assets/img/icons/ic_health_fault.png";

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

const QuickConfigFlushModal = ({
  visibility,
  toggleDialog,
  title,
  tabData,
  onClick,
  clientList,
}) => {
  const [activeTab, setActiveTab] = useState(tabData[0]?.type || "");
  const [selectClient, setselectClient] = useState(null);
  const [selectedScope, setSelectedScope] = useState({
    [CabinType.MWC]: false,
    [CabinType.FWC]: false,
    [CabinType.PD]: false,
    [CabinType.MUR]: false,
  });
  const configViewData = {};
  const [paymentMode, setPaymentMode] = useState(null);
  const EntryArray = [
    { label: "None", value: "None" },
    { label: "Coin", value: "Coin" },
    { label: "RFID", value: "RFID" },
    { label: "Coin and RF", value: "Coin and RF" },
  ];
  const EnableDisable = [
    {label: "Enabled", value: "Enabled"},
    {label: "Disabled", value: "Disabled"},
  ]
  const [isEnabledPre, setIsEnabledPre] = useState(null);
  const [isEnabledMini, setIsEnabledMini] = useState(null);
  const [isEnabledFull, setIsEnabledFull] = useState(null);
  const [miniflushDuration, setMiniFlushDuration] = useState(0);
  const [miniActivationDelay, setMiniActivationDelay] = useState(0);
  const [FullflushDuration, setFullFlushDuration] = useState(0);
  const [FullActivationDelay, setFullActivationDelay] = useState(0);

  const user = useSelector(selectUser);
  const [dialogData, setDialogData] = useState(null);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const dispatch = useDispatch();

  useEffect(() => {
    setSelectedScope({
      [CabinType.MWC]: false,
      [CabinType.FWC]: false,
      [CabinType.PD]: false,
      [CabinType.MUR]: false,
    });
    if (
      user?.user?.userRole == "Super Admin" ||
      user?.user?.userRole == "Client Super Admin"
    ) {
      setselectClient(null);
    } else {
      setselectClient({
        lable: user?.user?.clientName,
        value: user?.user?.clientName,
      });
    }
  }, []);

  console.log("tabData", tabData);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const handleError = (err, Custommessage, onclick = null) => {
    console.log("error -->", err);
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    }
  };

  const SubmitQuickConfigUsage = async (
    topic,
    payloadConfigArray,
    infoConfigArray
  ) => {
    try {
      dispatch(startLoading());
      var result = await executePublishConfigLambda(
        user?.credentials,
        topic,
        payloadConfigArray,
        infoConfigArray
      );
      console.log("result", result);
      if (result.result == 1) {
        setDialogData({
          title: "Success",
          message: "update config submitted successfully",
          onClickAction: () => {
            handleModalClose();
            // Handle the action when the user clicks OK
            console.log(`SubmitQuickConfigUsage -->`);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: result.message,
          onClickAction: () => {
            handleModalClose();
            // Handle the action when the user clicks OK
            console.log(`error SubmitQuickConfigUsage -->`);
          },
        });
      }
    } catch (error) {
      handleError(error, "Error SubmitQuickConfigUsage");
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const handleChangeClient = (selectedOption) => {
    console.log("handleChangeClient", selectedOption);
    setselectClient(selectedOption);
  };

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
          <Select
            options={clientList || []}
            value={selectClient}
            onChange={handleChangeClient}
            placeholder="Please Select Client"
          />
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

  function getEnabledIcon(criticality) {
    if (criticality == "Disabled") return icCritical;
  
    return icNonCritical;
  }

  const handleupdatePreIsEnable = (data) => {
    console.log('handleupdatePreIsEnable', data);
    setIsEnabledPre(data);
  }

  const handleupdateMiniIsEnable = (data) => {
    console.log('handleupdateMiniIsEnable', data);
    setIsEnabledMini(data);
  }

  const handleupdateFullIsEnable = (data) => {
    console.log('handleupdateFullIsEnable', data);
    setIsEnabledFull(data);
  }

  function PreEnabledDisabledLabel() {  
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
            {"Automatic Pre-Flush"}
          </div>
        </div>
  
        <div
          className="col-md-1"
          style={{
            marginLeft: "12px",
          }}
        >
          <img
            src={getEnabledIcon(isEnabledPre?.value)}
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
           <Select
            options={EnableDisable || []}
            value={isEnabledPre}
            onChange={handleupdatePreIsEnable}
            placeholder="Please Select"
          />
        </div>
      </div>
    );
  }

  function MiniEnabledDisabledLabel() {  
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
            {"Automatic Mini-Flush"}
          </div>
        </div>
  
        <div
          className="col-md-1"
          style={{
            marginLeft: "12px",
          }}
        >
          <img
            src={getEnabledIcon(isEnabledMini?.value)}
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
           <Select
            options={EnableDisable || []}
            value={isEnabledMini}
            onChange={handleupdateMiniIsEnable}
            placeholder="Please Select"
          />
        </div>
      </div>
    );
  }

  function FullEnabledDisabledLabel() {  
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
            {"Automatic Full-Flush"}
          </div>
        </div>
  
        <div
          className="col-md-1"
          style={{
            marginLeft: "12px",
          }}
        >
          <img
            src={getEnabledIcon(isEnabledFull?.value)}
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
           <Select
            options={EnableDisable || []}
            value={isEnabledFull}
            onChange={handleupdateFullIsEnable}
            placeholder="Please Select"
          />
        </div>
      </div>
    );
  }

  const handleUpdateMiniFlush = (e) => {
    console.log('handleUpdateMiniFlush', e.target.value);
    setMiniFlushDuration(e.target.value);
  }

  const handleUpdateMinidelay = (e) => {
    console.log('handleUpdateMinidelay', e.target.value);
    setMiniActivationDelay(e.target.value);
  }

  const handleUpdateFullFlush = (e) => {
    console.log('handleUpdateFullFlush', e.target.value);
    setFullFlushDuration(e.target.value);
  }

  const handleUpdateFulldelay = (e) => {
    console.log('handleUpdateFulldelay', e.target.value);
    setFullActivationDelay(e.target.value);
  }

  const renderTabPane = () => {
    const activeConfigView = tabData.find((item) => item.type === activeTab);
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
                  the Config-Scope Section
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
                  {(user?.user?.userRole == "Super Admin" ||
                    user?.user?.userRole == "Client Super Admin") && (
                    <ClientSelection />
                  )}
                  {/*  Scope Config */}
                  <ScopeConfig />
                </div>
              </td>
            </tr>

            {/* Pre Flush , Mini Flush , Full Flush config based on condition */}
            {activeConfigView?.label == "Pre Flush" ? (
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
                    <div
                      style={{ margin: "10px 10px 10px 10px", width: "100%" }}
                    >
                       <PreEnabledDisabledLabel
                          configTab={QuickConfigTabs.TAB_PRE_FLUSH_CONFIG}
                          id={'id_autoPreFlush'}
                        />
                    </div>
                  </div>
                </td>
              </tr>
            ) : activeConfigView?.label == "Mini Flush" ? (
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
                    <div
                      style={{ margin: "10px 10px 10px 10px", width: "100%" }}
                    >
                        <MiniEnabledDisabledLabel
                          configTab={QuickConfigTabs.TAB_PRE_FLUSH_CONFIG}
                          id={'id_autoMiniFlush'}
                        />

                        {/* Duration Flush Label */}
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
                                {"Flush Duration"}
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
                              <input
                                defaultValue={miniflushDuration}
                                type="text"
                                onChange={(e) => handleUpdateMiniFlush(e)}
                              />
                            </div>

                            <div className="col-md-1" style={{}}>
                              Sec
                            </div>
                          </div>
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
                                {"Acticvation Delay"}
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
                              <input
                                defaultValue={miniActivationDelay}
                                type="text"
                                placeholder=""
                                onChange={(e) => handleUpdateMinidelay(e)}
                              />
                            </div>

                            <div className="col-md-1" style={{}}>
                              Sec
                            </div>
                          </div>
                    </div>
                  </div>
                </td>
              </tr>
            ) : activeConfigView?.label == "Full Flush" ? (
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
                    <div
                      style={{ margin: "10px 10px 10px 10px", width: "100%" }}
                    >
                        <FullEnabledDisabledLabel
                          configTab={QuickConfigTabs.TAB_PRE_FLUSH_CONFIG}
                          id={'id_autoFullFlush'}
                        />

                         {/* Duration Flush Label */}
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
                                {"Flush Duration"}
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
                              <input
                                defaultValue={FullflushDuration}
                                type="text"
                                onChange={(e) => handleUpdateFullFlush(e)}
                              />
                            </div>

                            <div className="col-md-1" style={{}}>
                              Sec
                            </div>
                          </div>
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
                                {"Acticvation Delay"}
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
                              <input
                                defaultValue={FullActivationDelay}
                                type="text"
                                placeholder=""
                                onChange={(e) => handleUpdateFulldelay(e)}
                              />
                            </div>

                            <div className="col-md-1" style={{}}>
                              Sec
                            </div>
                          </div>

                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              ""
            )}
          </tbody>
        </table>
      </TabPane>
    );
  };

  // Function to generate  info target configuration array
  const createTargetConfig = (scope, client, configType) => {
    return Object.keys(scope)
      .filter((key) => scope[key]) // Filter only true values
      .map((key) => ({
        configType: configType == "pre-flush" ? "CMS/PRE-FLUSH" : configType == "mini-flush" ? "CMS/MINI-FLUSH" : configType == "full-flush" ? "CMS/FULL-FLUSH": "",
        user: user?.user.userName,
        client: user?.user.clientName,
        targetType: "Client",
        targetSubType: key.split(".")[1] == "PD" ? "PWC" : key.split(".")[1], // Extract target type (e.g., "MWC" from "CabinType.MWC")
        targetName: client.value,
      }));
  };
  

  const createpayloadPreConfig = (scope, client, isEnabledPre) => {
    return Object.keys(scope)
      .filter((key) => scope[key]) // Filter only true values
      .map((key) => ({
        Autopreflush: isEnabledPre,
        THING_NAME: client.value + "_ALL",
        cabin_type: key.split(".")[1] == "PD" ? "PWC" : key.split(".")[1], // Extract target type (e.g., "MWC" from "CabinType.MWC")
        user_type:
          key.split(".")[1] == "MWC"
            ? "MALE"
            : key.split(".")[1] == "FWC"
            ? "FEMALE"
            : key.split(".")[1] == "PD"
            ? "PD"
            : key.split(".")[1] == "MUR"
            ? "MALE"
            : "",
      }));
  };

  const createpayloadMiniConfig = (scope, client, isEnabledmini, duration, delay) => {
    return Object.keys(scope)
      .filter((key) => scope[key]) // Filter only true values
      .map((key) => ({
        Autominiflushenabled: isEnabledmini,
        Miniflushdurationtimer: duration == 0 ? "0" : duration,
        Miniflushactivationtimer: delay == 0 ? "0" : delay,
        THING_NAME: client.value + "_ALL",
        cabin_type: key.split(".")[1] == "PD" ? "PWC" : key.split(".")[1], // Extract target type (e.g., "MWC" from "CabinType.MWC")
        user_type:
          key.split(".")[1] == "MWC"
            ? "MALE"
            : key.split(".")[1] == "FWC"
            ? "FEMALE"
            : key.split(".")[1] == "PD"
            ? "PD"
            : key.split(".")[1] == "MUR"
            ? "MALE"
            : "",
      }));
  }

  const createpayloadFullConfig = (scope, client, isEnabledFull, duration, delay) => {
    return Object.keys(scope)
      .filter((key) => scope[key]) // Filter only true values
      .map((key) => ({
        Autofullflushenabled: isEnabledFull,
        fullflushdurationtimer: duration == 0 ? "0" : duration,
        fullflushactivationtimer: delay == 0 ? "0" : delay,
        THING_NAME: client.value + "_ALL",
        cabin_type: key.split(".")[1] == "PD" ? "PWC" : key.split(".")[1], // Extract target type (e.g., "MWC" from "CabinType.MWC")
        user_type:
          key.split(".")[1] == "MWC"
            ? "MALE"
            : key.split(".")[1] == "FWC"
            ? "FEMALE"
            : key.split(".")[1] == "PD"
            ? "PD"
            : key.split(".")[1] == "MUR"
            ? "MALE"
            : "",
      }));
  }

  const handleClick = async () => {
    let configType;
    let payloadConfigArray;
    let topic = `TEST/${selectClient?.value}/TOPIC_SSF_READ_CMS_CONFIG`;
    let selectedScopeCheck = Object.keys(selectedScope).filter(
      (key) => selectedScope[key]
    );

    if (
      selectClient?.value == "" ||
      selectClient == null ||
      selectClient == undefined
    ) {
      setDialogData({
        title: "Validation Error",
        message: "Please Select Client",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`handleClick quick config usage modal-->`);
        },
      });
      return true;
    } else if (selectedScopeCheck.length == 0) {
      setDialogData({
        title: "Validation Error",
        message: "Please Select config",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`handleClick quick config usage modal-->`);
        },
      });
      return true;
    } else if (user?.user.userName == "") {
      setDialogData({
        title: "Validation Error",
        message: "user name not found",
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`handleClick quick config usage modal-->`);
        },
      });
      return true;
    } else {
    }

    const activeConfigView = tabData.find((item) => item.type === activeTab);

    if(activeConfigView.label == 'Pre Flush'){
      if (isEnabledPre == null || isEnabledPre == undefined) {
        setDialogData({
          title: "Validation Error",
          message: "Please Select Automatic Pre Flush",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleClick quick config usage modal-->`);
          },
        });
        return true;
      }
      configType = "pre-flush"
      payloadConfigArray = createpayloadPreConfig(selectedScope,selectClient,isEnabledPre?.value)
    } else if(activeConfigView.label == 'Mini Flush') {
      if (isEnabledMini == null || isEnabledMini == undefined) {
        setDialogData({
          title: "Validation Error",
          message: "Please Select Automatic Mini Flush",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleClick quick config usage modal-->`);
          },
        });
        return true;
      }
      configType = "mini-flush"
      payloadConfigArray = createpayloadMiniConfig(selectedScope,selectClient, isEnabledMini?.value, miniflushDuration, miniActivationDelay)
    } else if(activeConfigView.label == 'Full Flush') {
      if (isEnabledFull == null || isEnabledFull == undefined) {
        setDialogData({
          title: "Validation Error",
          message: "Please Select Automatic Full Flush",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log(`handleClick quick config usage modal-->`);
          },
        });
        return true;
      }
      configType = "full-flush"
      payloadConfigArray = createpayloadFullConfig(selectedScope,selectClient, isEnabledFull?.value, miniflushDuration, miniActivationDelay)
    } else {
    }

    const infoConfigArray = createTargetConfig(selectedScope, selectClient, configType);

    console.log('infoConfigArray', infoConfigArray);
    console.log('payloadConfigArray', payloadConfigArray);
    console.log("topic", topic);

    await SubmitQuickConfigUsage(topic, payloadConfigArray, infoConfigArray);
  };

  const handleModalClose = () => {
    console.log("modal is close");
    setselectClient(null);
    setSelectedScope({
      [CabinType.MWC]: false,
      [CabinType.FWC]: false,
      [CabinType.PD]: false,
      [CabinType.MUR]: false,
    });
    setPaymentMode(null);
    setDialogData(null);
  };

  return (
    <Modal
      isOpen={visibility}
      toggle={toggleDialog}
      className="modal-la"
      style={{ width: "900px" }}
      onClosed={handleModalClose} // This function will fire when the modal closes
    >
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <ModalHeader
        style={{ background: "#5DC0A6", color: "white" }}
        toggle={toggleDialog}
      >
        {title}
      </ModalHeader>
      <ModalBody
        style={{ width: "100%", height: "600px", overflowY: "scroll" }}
      >
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

export default QuickConfigFlushModal;
