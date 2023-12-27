import React from "react";
import GaugeChart from 'react-gauge-chart'
import {
    whiteSurface,
    cabinDetailsStyle,
} from "../../../jsStyles/Style"

export default function CabinStatus(props) {
    console.log('_aqiLumen', props.cabinStatus)
    if (props.cabinStatus === undefined || (props.uiResult.methane === "false" && props.uiResult.carbon_monooxide === "false" && props.uiResult.ammonia === "false" && props.uiResult.luminous === "false")) {
        return null
    } return (
        <div className="col-md-12" style={{ ...whiteSurface, background: 'white' }}>
            <div style={{ ...cabinDetailsStyle.componentTitle }} >
                Cabin Status
            </div>
            <div className="row" style={{ justifyContent: "space-evenly" }}>
                {
                    props.uiResult.methane === "true" &&
                    (
                        <div className="col-md-3">
                            {/* // <div className="col-md-3" style={{ width: "80%", margin: "auto" }}> */}
                            <div style={{ ...whiteSurface, background: "white" }}>
                                <div style={{}}>
                                    <GaugeChart id="gauge-chart1" hideText={true} percent={props.cabinStatus.data.concentrationCH4} />
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeValue, display: "flex", justifyContent: "center" }}>{props.cabinStatus.data.concentrationCH4} PPM</div>
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeTitle, display: "flex", justifyContent: "center" }}>Methane Concentration</div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    props.uiResult.carbon_monooxide === "true" &&
                    (
                        <div className="col-md-3">
                            <div style={{ ...whiteSurface, background: "white", marginTop: "10px" }}>
                                <div style={{}}>
                                    <GaugeChart id="gauge-chart1" hideText={true} percent={props.cabinStatus.data.concentrationCO} />
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeValue, display: "flex", justifyContent: "center" }}>{props.cabinStatus.data.concentrationCO} PPM</div>
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeTitle, display: "flex", justifyContent: "center" }}>Carbon Monoxide Concentration</div>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    props.uiResult.ammonia === "true" &&
                    (
                        <div className="col-md-3">
                            <div style={{ ...whiteSurface, background: "white", marginTop: "10px" }}>
                                <div style={{}}>
                                    <GaugeChart id="gauge-chart1" hideText={true} percent={props.cabinStatus.data.concentrationNH3} />
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeValue, display: "flex", justifyContent: "center" }}>{props.cabinStatus.data.concentrationNH3} PPM</div>
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeTitle, display: "flex", justifyContent: "center" }}>Ammonia Concentration</div>
                                </div>
                            </div>
                        </div >
                    )
                }
                {
                    props.uiResult.luminous === "true" &&
                    (
                        <div className="col-md-3">
                            <div style={{ ...whiteSurface, background: "white", marginTop: "10px" }}>
                                <div style={{}}>
                                    <GaugeChart id="gauge-chart1" hideText={true} percent={props.cabinStatus.data.concentrationLuminosityStatus} />
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeValue, display: "flex", justifyContent: "center" }}>{props.cabinStatus.data.concentrationLuminosityStatus} Lumen</div>
                                    <div style={{ ...cabinDetailsStyle.cabinStatus.gaugeTitle, display: "flex", justifyContent: "center" }}>Luminous Intensity</div>
                                </div>
                            </div>
                        </div >
                    )
                }
            </div >
        </div >

    );

};