import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  InputGroup,
  InputGroupAddon,
  Input,
  InputGroupText,
} from "reactstrap";
import { dashboardStyle } from "../../../jsStyles/Style";
// import { OdsConfigList } from "../../../components/ConfigLabels";
import { executePublishConfigLambda } from "../../../awsClients/complexLambdas";
import { whiteSurface } from "../../../jsStyles/Style";
import DropDown from "../../../components/DropDown";
import RxInputCheckbox from "./utils/RxInputCheckbox";
import { CabinType } from "../../../nomenclature/nomenclature";
import { UsageChargeConfigView } from "../../../components/QuickConfigLabels";

const QuickConfigDialogTab = (props) => {
  const [odsConfig, setOdsConfig] = useState(undefined);
  const [selectedScope, setSelectedScope] = useState({
    [CabinType.MWC]: false,
    [CabinType.FWC]: false,
    [CabinType.PD]: false,
    [CabinType.MUR]: false,
  });
  const [clientNameList, setClientNameList] = useState([]);

  useEffect(() => {
    initClientNameList();
  }, []);

  const render = () => {
    return (
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
                <ClientSelection />
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
                {props.configView()}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  const initClientNameList = () => {
    setClientNameList([]);
    props.clientList.forEach((client) => {
      setClientNameList((prevList) => [...prevList, client.name]);
    });
  };

  const setSelectedClient = (client) => {
    props.handleUpdate(props.configTab, "configClient", client);
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
          <DropDown
            options={clientNameList}
            onSelection={(index, value) => {
              setSelectedClient(value);
            }}
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
                    <RxInputCheckbox
                      withLabel
                      label={"Male WC"}
                      selected={false}
                      onChange={onScopeSelected(CabinType.MWC)} // Partially applying the function
                    />
                  </div>
                </td>
                <td style={{ width: "50%" }}>
                  <div>
                    <RxInputCheckbox
                      withLabel
                      label={"Female WC"}
                      selected={false}
                      onChange={onScopeSelected(CabinType.FWC)} // Partially applying the function
                    />
                  </div>
                </td>
              </tr>

              <tr>
                <td style={{ width: "50%" }}>
                  <div>
                    <RxInputCheckbox
                      withLabel
                      label={"PD WC"}
                      selected={false}
                      onChange={onScopeSelected(CabinType.PD)} // Partially applying the function
                    />
                  </div>
                </td>

                <td style={{ width: "50%" }}>
                  <div>
                    <RxInputCheckbox
                      withLabel
                      label={"Male Urinal"}
                      selected={false}
                      onChange={onScopeSelected(CabinType.MUR)} // Partially applying the function
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // Function to handle selection changes
  const onScopeSelected = (cabinType) => (selected) => {
    console.log(`Selected: ${selected}, CabinType: ${cabinType}`);
    setSelectedScope((prevScope) => {
      const updatedScope = {
        ...prevScope,
        [cabinType]: selected,
      };
      // Use the updated state in the callback
      console.log('selectedScope', updatedScope);
      props.handleUpdate(props.configTab, "configScope", updatedScope);
    });
};

  // const onScopeSelected = (selected, cabinType) => {
    // setSelectedScope((prevScope) => ({
    //   ...prevScope,
    //   [cabinType]: selected,
    // }));
    // props.handleUpdate(props.configTab, "configScope", selectedScope);
  // };

  return render();
};

export default QuickConfigDialogTab;
