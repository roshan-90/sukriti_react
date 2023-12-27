//Core
import React from "react";
//JsStyles
import { whiteSurface, cabinDetailsStyle } from "../../../jsStyles/Style";
import NoDataComponent from "../../../components/NoDataComponent";
import DataList from "../../../components/lists/DataList";

export default function ResetProfile(props) {
  return (
    // <UsageProfileList data={props.usageProfile} />

    <div
      style={{
        ...whiteSurface,
        width: "100%",
        background: "white",
        marginTop: "20px",
        padding: "10px 10px 10px 10px",
      }}
    >
      <div style={{ ...cabinDetailsStyle.componentTitle }}>Reset Profile</div>

      <div style={{ ...whiteSurface, width: "100%" }}>
        <ComponentSelector resetProfile={props.resetProfile} />
      </div>
    </div>
  );
}

function ComponentSelector(props) {
  console.log("_resetProfile", props.resetProfile.length);
  if (props.resetProfile.length == 0) return <NoDataComponent />;
  else return <DataList data={props.resetProfile} />;
}
