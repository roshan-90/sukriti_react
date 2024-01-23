import React from "react";
import { useState } from "react";
import { cabinDetailsStyle } from "../jsStyles/Style";
import Dropdown from "../components/DropDown";
import RxInputText from "../components/RxInputText";
import icCritical from "../assets/img/icons/ic_health_fault.png";
import icNonCritical from "../assets/img/icons/ic_health_ok.png";

export function UcemsConfigList(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <EntryChargeLabel
        data={props.data.entryCharge}
        handleUpdate={props.handleUpdate}
      />

      <PaymentModeLabel
        data={props.data.paymentMode}
        handleUpdate={props.handleUpdate}
      />

      {props.data.timerConfig.map((item, index) => {
        return (
          <DurationLabel
            key={index}
            data={item}
            handleUpdate={props.handleUpdate}
          />
        );
      })}

      {props.data.criticalityConfig.map((item, index) => {
        return (
          <CriticalityLabel
            key={index}
            data={item}
            handleUpdate={props.handleUpdate}
          />
        );
      })}
    </div>
  );
}

export function CmsConfigList(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      {props.data.airDryerConfig.map((item, index) => {
        return <DurationLabel data={item} handleUpdate={props.handleUpdate} />;
      })}

      {props.data.enabledConfig.map((item, index) => {
        return (
          <EnabledDisabledLabel data={item} handleUpdate={props.handleUpdate} />
        );
      })}

      {props.data.timerConfig.map((item, index) => {
        return <DurationLabel data={item} handleUpdate={props.handleUpdate} />;
      })}

      <CountLabel
        data={props.data.floorCleanCount}
        handleUpdate={props.handleUpdate}
      />
    </div>
  );
}

export function OdsConfigList(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      {props.data.odsConfig.map((item, index) => {
        return <ValueLabel data={item} handleUpdate={props.handleUpdate} />;
      })}
    </div>
  );
}

export function BwtConfigList(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      {props.data.bwtConfig.map((item, index) => {
        return <ValueLabel data={item} handleUpdate={props.handleUpdate} />;
      })}
    </div>
  );
}
function CriticalityLabel(props) {
  const [criticality, setCriticality] = useState(props.data.value);
  var options = ["Critical", "Non Critical"];

  var getIndex = (value) => {
    if (props.data.name === "Air Dryer") console.log("_getIndex", value);
    console.log("getIndex value", typeof value);
    if (value === "0") {
      return 1;
    }
    return 0;
  };

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
          {props.data.name}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        {/* <img
          src={getCriticalityIcon(criticality)}
          alt=""
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
      </div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <Dropdown
          options={options}
          onSelection={(index, value) => {
            console.log("checking dropdown critical index", index);
            console.log("checking dropdown critical value", value);
            setCriticality(value);
            props.handleUpdate(props.data.name, index);
          }}
          currentIndex={criticality}
        />
      </div>
    </div>
  );
}

function getCriticalityIcon(criticality) {
  if (criticality == "Critical") return icCritical;

  return icNonCritical;
}

// function CriticalityLabel(props) {
//   console.log(' props.data.value-:👉', props.data)
//   const [criticality, setCriticality] = useState(props.data.value);
//   console.log(' props.criticality, setCriticality.value-:👉', criticality)

//   var options = ["Critical", "Non Critical"];

//   var getIndex = (value) => {
//     if (props.data.name === 'Air Dryer')
//       console.log('_getIndex', value);
//     if (value === '0') {
//       return 1;
//     }
//     return 0;
//   }

//   return (
//     <div
//       className="row"
//       style={{ display: 'flex', alignItems: 'center', padding: "0", margin: '0px 0px 30px 0px' }}>

//       <div
//         className="col-md-2"
//         style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: "0" }}>

//         <div
//           style={{
//             ...cabinDetailsStyle.cabinHealth.itemTitle,
//             textAlign: 'end'
//           }}>
//           {props.data.name}
//         </div>

//       </div>

//       <div
//         className="col-md-1"
//         style={{
//           marginLeft: '12px'
//         }}
//       >
//         <img
//           src={getCriticalityIcon(criticality)}
//           alt=""
//           style={{
//             width: "30px",
//             height: "30px",
//             borderRadius: "5%"

//           }} />

//       </div>
//       <div
//         className="col-md-6"
//         style={{
//           marginLeft: '8px'
//         }}
//       >
//         <Dropdown
//           options={options}
//           onSelection={(index, value) => {
//             setCriticality(value);
//             props.handleUpdate(props.data.name, value)
//           }}
//         // value={options[criticality]}
//         // currentIndex={getIndex(props.data.value)}
//         />

//       </div>

//     </div>
//   );
// }

// function getCriticalityIcon(criticality) {
//   console.log(' criticality-:👉', criticality)
//   if (criticality == 0)
//     return icCritical;
//   else if (criticality == 1)
//     return icNonCritical;
//   else if (criticality == "Critical")
//     return icCritical
//   else if (criticality == "Non Critical")
//     return icNonCritical
// }

function EnabledDisabledLabel(props) {
  const [criticality, setCriticality] = useState(props.data.value);

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
          {props.data.name}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        {/* <img
          src={getEnabledIcon(criticality)}
          alt=""
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
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
            setCriticality(value);
            props.handleUpdate(props.data.name, index);
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
  const [duration, setDuration] = useState(props.data.value);

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
          {props.data.name}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        {/* <img
          src={icNonCritical}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
      </div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <RxInputText
          text={props.data.value}
          placeholder={""}
          onChange={(text) => {
            props.handleUpdate(props.data.name, text);
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
  const [duration, setDuration] = useState(props.data.value);

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
          {props.data.name}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        {/* <img
          src={icNonCritical}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
      </div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <RxInputText
          text={props.data.value}
          placeholder={""}
          onChange={(text) => {
            props.handleUpdate(props.data.name, text);
          }}
        />
      </div>

      <div className="col-md-1" style={{}}>
        Count
      </div>
    </div>
  );
}

function ValueLabel(props) {
  // console.log("Props-bwt:👉", props)
  const [duration, setDuration] = useState(props.data.value);

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
          {props.data.name}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        {/* <img
          src={icNonCritical}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
      </div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <RxInputText
          text={props.data.value}
          placeholder={""}
          onChange={(text) => {
            props.handleUpdate(props.data.name, text);
          }}
        />
      </div>

      <div className="col-md-1" style={{}}>
        Value
      </div>
    </div>
  );
}

function EntryChargeLabel(props) {
  const [duration, setDuration] = useState(props.data.value);

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
          {props.data.name}
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
          text={props.data.value}
          placeholder={""}
          onChange={(text) => {
            console.log("_onChange", text);
            props.handleUpdate(props.data.name, text);
          }}
        />
      </div>
    </div>
  );
}

function PaymentModeLabel(props) {
  const [paymentMode, setPaymentMode] = useState(props.data.value);
  let options = ["None", "Coin", "RFID", "Coin and RF"];
  console.log("paymentmodelLabel", paymentMode);
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
          {props.data.name}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      >
        {/* <img
          src={icNonCritical}
          alt=""
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
      </div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <Dropdown
          options={options}
          onSelection={(index, value) => {
            setPaymentMode(index);
            console.log("dropdown index", index);
            console.log("dropdown value", value);
            props.handleUpdate(props.data.name, index);
          }}
          currentIndex={paymentMode}
          // onSelection={(index,value) => {setCriticality(value); {props.onSelection(index,value)}}}
        />
      </div>
    </div>
  );
}

export function CommandsSelectionLabel(props) {
  const [paymentMode, setPaymentMode] = useState(0);
  console.log("checking commandselectiolave", props);
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
      ></div>

      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <Dropdown
          options={props.options}
          onSelection={(index, value) => {
            console.log("dropdown index", index);
            console.log("dropdown value", value);
            setPaymentMode(value);
            props.handleCommandSelection(value);
          }}
        />
      </div>
    </div>
  );
}

function TextLabel(props) {
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
        {/* <img
          src={icNonCritical}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
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
            props.handleUpdate(props.label, text);
          }}
        />
      </div>

      <div className="col-md-1" style={{}}>
        Sec
      </div>
    </div>
  );
}

function DropDownLabel(props) {
  const [paymentMode, setPaymentMode] = useState(0);

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
        {/* <img
          src={icNonCritical}
          style={{
            width: "30px",
            height: "30px",
            borderRadius: "5%"

          }} /> */}
      </div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <Dropdown
          options={props.options}
          onSelection={(index, value) => {
            setPaymentMode(value);
            props.handleUpdate(props.label, index);
          }}
          // onSelection={(index,value) => {setCriticality(value); {props.onSelection(index,value)}}}
        />
      </div>
    </div>
  );
}

const actionOptions = ["Switch ON", "Switch OFF"];
const bwtactionOptions = [
  "Active mode",
  "Drain mode",
  "Rinse mode",
  "BackWash mode",
];
const overrideOptions = ["Override Command", "Do Not Override"];
export function CommandsLabel(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <TextLabel
        label={"Duration"}
        value={props.value}
        unit="Sec"
        handleUpdate={props.handleUpdate}
      />
      <DropDownLabel
        label={"Action"}
        handleUpdate={props.handleUpdate}
        options={actionOptions}
      />
      <DropDownLabel
        label={"Override"}
        handleUpdate={props.handleUpdate}
        options={overrideOptions}
      />
    </div>
  );
}

export function BwtCommandsLabel(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <TextLabel
        label={"Duration"}
        value="10"
        unit="Sec"
        handleUpdate={props.handleUpdate}
      />
      <DropDownLabel
        label={"Mode"}
        handleUpdate={props.handleUpdate}
        options={bwtactionOptions}
      />
      <DropDownLabel
        label={"Override"}
        handleUpdate={props.handleUpdate}
        options={overrideOptions}
      />
    </div>
  );
}

export function BwtBlowerLabel(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <TextLabel
        label={"Duration"}
        value="10"
        unit="Sec"
        handleUpdate={props.handleUpdate}
      />
      <DropDownLabel
        label={"Action"}
        handleUpdate={props.handleUpdate}
        options={actionOptions}
      />
      <DropDownLabel
        label={"Override"}
        handleUpdate={props.handleUpdate}
        options={overrideOptions}
      />
    </div>
  );
}
export function CommandsLabelOverride(props) {
  return (
    <div style={{ margin: "10px 10px 10px 10px", width: "100%" }}>
      <DropDownLabel
        label={"Override"}
        handleUpdate={props.handleUpdate}
        options={overrideOptions}
      />
    </div>
  );
}
