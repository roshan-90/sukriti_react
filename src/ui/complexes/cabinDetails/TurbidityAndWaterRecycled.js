//Core
import React from "react";
import {
    usageAndFeedbackStyle,
} from "../../../jsStyles/Style"
import UsageIcon from '../../../assets/img/icons/eco_home.png'
import FeedbackIcon from '../../../assets/img/icons/ic_quick_access_active.png'

export default function TurbidityAndWaterRecycled(props) {

    var turbidity = 0
    var WaterRecycled = 0

    console.log('_usageAndFeedback-1', props)
    console.log('_usageAndFeedback-2', props.turbidityAndWaterRecycled)
    if (props.turbidityAndWaterRecycled === undefined) {
        return null
    } else if (props.turbidityAndWaterRecycled !== -1) {
        turbidity = props.turbidityAndWaterRecycled.turbidity;
        WaterRecycled = props.turbidityAndWaterRecycled.WaterRecycled;
        return (

            <div className="col-md-12" style={{ marginBottom: '20px' }}>
                {
                    props.uiResult.turbidity_value === "true" ? (
                        <div className='row'>
                            <div className="col-md-6" >
                                <Usage turbidity={turbidity} />
                            </div>
                            <div className="col-md-6" >
                                <Feedback WaterRecycled={WaterRecycled} />
                            </div>
                        </div>
                    ) : (
                        <div className="col-md-12" >
                            <Feedback WaterRecycled={WaterRecycled} />
                        </div>
                    )

                }
                {/* {
                    (props.uiResult.turbidity_value === "true" && props.uiResult.recycled === "true") ?
                        (
                            <div className='row'>
                                <div className="col-md-6" >
                                    <Usage turbidity={turbidity} />
                                </div>
                                <div className="col-md-6" >
                                    <Feedback WaterRecycled={WaterRecycled} />
                                </div>
                            </div>

                        ) : (
                            <div className='row'>
                                {
                                    props.uiResult.turbidity_value === "true" &&
                                    (
                                        <div className="col-md-12" >
                                            <Usage turbidity={turbidity} />
                                        </div>
                                    )
                                }
                                {
                                    props.uiResult.recycled === "true" &&
                                    (
                                        <div className="col-md-12" >
                                            <Feedback WaterRecycled={WaterRecycled} />
                                        </div>
                                    )
                                }
                            </div>
                        )
                } */}
            </div>
        );
    }
};

function Loader() {
    var style = {
        border: '16px solid #eee',
        borderTop: '16px solid #3ae',
        borderRadius: '50%',
        width: '1cm',
        height: '1cm',
        animation: 'spin 2s linear infinite',
    }
    return (
        <div style={style}>
            <style>{`
            @keyframes spin {
                 0% { transform: rotate(0deg); }
                 100% { transform: rotate(360deg); }
            }
        `}</style>
        </div>
    )
}

function Usage(props) {
    var style = {
        ...usageAndFeedbackStyle.bottomRightCurvedSurface,
        animation: 'usage 10s linear infinite'
    }
    return (
        <div style={style}>
            <style>{`
            @keyframes usage {

                 0% {
                    background: #5DC0A6;
                  }
                  25% {
                    background: #7AFFDC;
                  }
                  50% {
                    background: #5DC0A6;
                  }
                  75% {
                    background: #7AFFDC;
                  }
                  100% {
                    background: #5DC0A6;
                  }
            }
        `}</style>

            <div style={{ display: 'block' }}>

                <div style={{ ...usageAndFeedbackStyle.circleSurface, margin: 'auto', width: '90px', height: '90px' }}>
                    <img
                        src={UsageIcon}
                        style={{
                            width: "80px",
                            height: "80px",
                        }} />
                </div>

                <div style={{ ...usageAndFeedbackStyle.name }}>Turbidity</div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'right' }}>
                <div style={{ ...usageAndFeedbackStyle.value }}>{props.turbidity} <span style={{ fontSize: "18px" }}>NTU</span></div>
            </div>
        </div>


    )
}

function Feedback(props) {
    var style = {
        ...usageAndFeedbackStyle.topLeftCurvedSurface,
        animation: 'feedback 10s linear infinite',
    }
    return (
        <div style={style}>
            <style>{`
            @keyframes feedback {

                 0% {
                    background: #7AFFDC;
                  }
                  25% {
                    background: #5DC0A6;
                  }
                  50% {
                    background: #7AFFDC;
                  }
                  75% {
                    background: #5DC0A6;
                  }
                  100% {
                    background: #7AFFDC;
                  }
            }
        `}</style>

            <div style={{ display: 'block' }}>

                <div style={{ ...usageAndFeedbackStyle.circleSurface, margin: 'auto', width: '90px', height: '90px' }}>
                    <img
                        src={FeedbackIcon}
                        style={{
                            width: "80px",
                            height: "80px",
                        }} />
                </div>

                <div style={{ ...usageAndFeedbackStyle.name }}>WaterRecycled</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'right' }}>
                <div style={{ ...usageAndFeedbackStyle.value }}>{props.WaterRecycled} <span style={{ fontSize: "18px" }}>Ltr</span></div>
            </div>
        </div>
    )
}


