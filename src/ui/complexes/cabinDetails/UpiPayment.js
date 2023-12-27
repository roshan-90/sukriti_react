//Core
import React from "react";
//JsStyles
import {
    whiteSurface,
    cabinDetailsStyle,
} from "../../../jsStyles/Style"
import NoDataComponent from '../../../components/NoDataComponent'
import DataList from "../../../components/list/DataList"


export default function UpiPayment(props) {
    return (

        // <UsageProfileList data={props.usageProfile} />

        <div style={{ ...whiteSurface, width: '100%', background: "white", marginTop: '20px', padding: "10px 10px 10px 10px" }}>

            <div style={{ ...cabinDetailsStyle.componentTitle }} >
                UPI Payment
            </div>

            <div style={{ ...whiteSurface, width: '100%' }} >
                <ComponentSelector upiPaymentList={props.upiPaymentList} />

            </div>

        </div>

    );
};

function ComponentSelector(props) {
    console.log('_resetProfile', props.upiPaymentList.length)
    if (props.upiPaymentList.length == 0)
        return (<NoDataComponent />)


    else return (<DataList data={props.upiPaymentList} />);
}