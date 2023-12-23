import React from "react";
import { useState } from "react";

import { cabinDetailsStyle } from "../jsStyles/Style";
import Dropdown from "./DropDown";
import RxInputText from "./RxInputText";
import RxInputCheckbox from "./RxInputCheckbox";
import icCritical from "../assets/img/icons/ic_health_fault.png";
import icNonCritical from "../assets/img/icons/ic_health_ok.png";
import { QuickConfigTabs } from "../nomenclature/nomenclature";

var ConfigViewIDs = {
  usageCharge: "id_usageCharge",
  paymentMode: "id_paymentMode",
  autoPreFlush: "id_autoPreFlush",
  autoMiniFlush: "id_autoMiniFlush",
  autoFullFlush: "id_autoFullFlush",
  flushDuration: "id_FlushDuration",
  flushActivationDelay: "id_activationDelay",
  autoFloorCLean: "id_autoFloorClean",
  floorCleanCount: "id_floorCleanCount",
  floorCLeanDuration: "id_floorCleanDuration",
  autoFan: "id_autoFan",
  autoLight: "id_autoLight",
  autoOffTime: "id_autoOffTime",
  autoOnTIme: "id_autoOnTime",
};

export function UsageChargeConfigViewIDs() {
  return ["id_usageCharge", "id_paymentMode"];
}
export function PreFlushConfigViewIDs() {
  return ["id_autoPreFlush"];
}
export function MiniFlushConfigViewIDs() {
  return ["id_autoMiniFlush", "id_FlushDuration", "id_activationDelay"];
}
export function FullFlushConfigViewIDs() {
  return ["id_autoFullFlush", "id_FlushDuration", "id_activationDelay"];
}
export function FloorCleanConfigViewIDs() {
  return ["id_autoFloorClean", "id_floorCleanCount", "id_floorCleanDuration"];
}
export function LightConfigViewIDs() {
  return ["id_autoLight", "id_autoOffTime", "id_autoOnTime"];
}
export function FanConfigViewIDs() {
  return ["id_autoFan", "id_autoOffTime", "id_autoOnTime"];
}

export function UsageChargeConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EntryChargeLabel
        configTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
        id={ConfigViewIDs.usageCharge}
        defaultEntryCharge={props.data.defaultEntryCharge}
        handleUpdate={props.handleUpdate}
      />

      <PaymentModeLabel
        configTab={QuickConfigTabs.TAB_USAGE_CHARGE_CONFIG}
        id={ConfigViewIDs.paymentMode}
        defaultPaymentMode={props.data.defaultPaymentMode}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function PreFlushConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EnabledDisabledLabel
        configTab={QuickConfigTabs.TAB_PRE_FLUSH_CONFIG}
        id={ConfigViewIDs.autoPreFlush}
        label={"Automatic Pre-Flush"}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function MiniFlushConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EnabledDisabledLabel
        configTab={QuickConfigTabs.TAB_MINI_FLUSH_CONFIG}
        id={ConfigViewIDs.autoMiniFlush}
        label={"Automatic Mini-Flush"}
        isEnabled={false}
        handleUpdate={props.handleUpdate}
      />
      <DurationLabel
        configTab={QuickConfigTabs.TAB_MINI_FLUSH_CONFIG}
        id={ConfigViewIDs.flushDuration}
        label={"Flush Duration"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />

      <DurationLabel
        configTab={QuickConfigTabs.TAB_MINI_FLUSH_CONFIG}
        id={ConfigViewIDs.flushActivationDelay}
        label={"Acticvation Delay"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function FullFlushConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EnabledDisabledLabel
        configTab={QuickConfigTabs.TAB_FULL_FLUSH_CONFIG}
        id={ConfigViewIDs.autoFullFlush}
        label={"Automatic Full-Flush"}
        isEnabled={false}
        handleUpdate={props.handleUpdate}
      />
      <DurationLabel
        configTab={QuickConfigTabs.TAB_FULL_FLUSH_CONFIG}
        id={ConfigViewIDs.flushDuration}
        label={"Flush Duration"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
      <DurationLabel
        configTab={QuickConfigTabs.TAB_FULL_FLUSH_CONFIG}
        id={ConfigViewIDs.flushActivationDelay}
        label={"Acticvation Delay"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function FloorCleanConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EnabledDisabledLabel
        configTab={QuickConfigTabs.TAB_FLOOR_CLEAN_CONFIG}
        id={ConfigViewIDs.autoFloorCLean}
        label={"Automatic Floor Clean"}
        isEnabled={false}
        handleUpdate={props.handleUpdate}
      />
      <CountLabel
        configTab={QuickConfigTabs.TAB_FULL_FLUSH_CONFIG}
        id={ConfigViewIDs.floorCleanCount}
        label={"Floor Clean Count"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
      <DurationLabel
        configTab={QuickConfigTabs.TAB_FULL_FLUSH_CONFIG}
        id={ConfigViewIDs.floorCLeanDuration}
        label={"Floor Clean Duration"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function LightConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EnabledDisabledLabel
        configTab={QuickConfigTabs.TAB_LIGHT_CONFIG}
        id={ConfigViewIDs.autoLight}
        label={"Automatic Light"}
        isEnabled={false}
        handleUpdate={props.handleUpdate}
      />
      <CountLabel
        configTab={QuickConfigTabs.TAB_LIGHT_CONFIG}
        id={ConfigViewIDs.autoOffTime}
        label={"Auto Off Time"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
      <DurationLabel
        configTab={QuickConfigTabs.TAB_LIGHT_CONFIG}
        id={ConfigViewIDs.autoOnTIme}
        label={"Auto On Time"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function FanConfigView(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EnabledDisabledLabel
        configTab={QuickConfigTabs.TAB_FAN_CONFIG}
        id={ConfigViewIDs.autoFan}
        label={"Automatic Fan"}
        isEnabled={false}
        handleUpdate={props.handleUpdate}
      />
      <CountLabel
        configTab={QuickConfigTabs.TAB_FAN_CONFIG}
        id={ConfigViewIDs.autoOffTime}
        label={"Auto Off Time"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
      <DurationLabel
        configTab={QuickConfigTabs.TAB_FAN_CONFIG}
        id={ConfigViewIDs.autoOnTIme}
        label={"Auto On Time"}
        value={"0"}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function DataRequestConfigView(props) {
  return (
    <div style={{ width: "100%" }}>
      <table style={{ width: "100%", overflowX: "scroll" }}>
        <tbody>
          <tr>
            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>
          </tr>

          <tr>
            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>

            <td style={{ width: "50%" }}>
              <div>
                <DataRequestLabel
                  label={"HEALTH_LIGHT"}
                  isSelected={false}
                  handleUpdate={props.handleUpdate}
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DataRequestLabel(props) {
  const [isSelected, setSelected] = useState(props.isSelected);

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
        className="col-md-12"
        style={{
          marginLeft: "8px",
        }}
      >
        <RxInputCheckbox
          withLabel
          label={props.label}
          selected={false}
          onChange={(e) => {
            setSelected(e);
            props.handleUpdate(e);
          }}
        />
      </div>
    </div>
  );
}

function EnabledDisabledLabel(props) {
  const [isEnabled, setEnabled] = useState(props.isEnabled);

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
          {props.label}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        <img
          src={getEnabledIcon(isEnabled)}
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
          options={["Enabled", "Disabled"]}
          onSelection={(index, value) => {
            setEnabled(value);
            props.handleUpdate(props.configTab, props.id, value);
          }}
        />
      </div>
    </div>
  );
}

function getEnabledIcon(criticality) {
  if (criticality == "Enabled") return icCritical;

  return icNonCritical;
}

function DurationLabel(props) {
  const [duration, setDuration] = useState(props.value);

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
          {props.label}
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
        <RxInputText
          text={props.value}
          placeholder={""}
          onChange={(text) => {
            props.handleUpdate(props.configTab, props.id, text);
          }}
        />
      </div>

      <div className="col-md-1" style={{}}>
        Sec
      </div>
    </div>
  );
}

function CountLabel(props) {
  const [count, setCount] = useState(props.value);

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
          {props.label}
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
        <RxInputText
          text={props.value}
          placeholder={""}
          onChange={(text) => {
            props.handleUpdate(props.configTab, props.id, text);
          }}
        />
      </div>

      <div className="col-md-1" style={{}}>
        Count
      </div>
    </div>
  );
}

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
