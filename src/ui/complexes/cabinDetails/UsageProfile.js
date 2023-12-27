import React from "react";
import { whiteSurface, cabinDetailsStyle } from "../../../jsStyles/Style"
import UsageProfileList from "../../../components/list/DataList"
import NoDataComponent from '../../../components/NoDataComponent'
import { getUsageProfileDisplayData } from '../utils/ComplexUtils'


export default function UsageProfile(props) {
    return (

        <div style={{ ...whiteSurface, background: "white", marginTop: '20px', padding: "10px 10px 10px 10px" }}>

            <div style={{ ...cabinDetailsStyle.componentTitle }} >
                Usage Profile
            </div>

            <div style={{ ...whiteSurface }} >
                <ComponentSelector
                    usageProfile={getUsageProfileDisplayData(props)}
                    uiResult={props.uiResult}
                />
            </div>

        </div>

    );
};

function ComponentSelector(props) {
    if (props.usageProfile.length == 0)
        return (<NoDataComponent />)


    else return (
        <UsageProfileList
            data={props.usageProfile}
            uiResult={props.uiResult}
        />);
}