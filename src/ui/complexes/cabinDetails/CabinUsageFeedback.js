import React from "react";
import {
    usageAndFeedbackStyle,
} from "../../../jsStyles/Style"
import UsageIcon from '../../../assets/img/icons/eco_home.png'
import FeedbackIcon from '../../../assets/img/icons/ic_quick_access_active.png'

export default function CabinUsageFeedback(props) {

    var totalUsage = 0
    var totalFeedback = 0

    console.log('_usageAndFeedback-2', props.usageAndFeedback)
    if (props.usageAndFeedback === undefined) {
        return null
    } else if (props.usageAndFeedback !== -1 || props.usageAndFeedback == -1) {
        totalUsage = props.usageAndFeedback.TotalUsage;
        totalFeedback = props.usageAndFeedback.AverageFeedback;
        return (
            <div className="col-md-12" style={{ marginBottom: '20px' }}>
                {
                    (props.uiResult.total_usage === "true" && props.uiResult.average_feedback === "true") ?
                        (
                            <div className='row'>
                                <div className="col-md-6" >
                                    <Usage totalUsage={totalUsage} />
                                </div>
                                <div className="col-md-6" >
                                    <Feedback totalFeedback={totalFeedback} />
                                </div>
                            </div>

                        ) : (
                            <div className='row'>
                                {
                                    props.uiResult.total_usage === "true" &&
                                    (
                                        <div className="col-md-12" >
                                            <Usage totalUsage={totalUsage} />
                                        </div>
                                    )
                                }
                                {
                                    props.uiResult.average_feedback === "true" &&
                                    (
                                        <div className="col-md-12" >
                                            <Feedback totalFeedback={totalFeedback} />
                                        </div>
                                    )
                                }
                            </div>
                        )
                }
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
                        alt="UsageIcon"
                        style={{
                            width: "80px",
                            height: "80px",
                        }} />
                </div>

                <div style={{ ...usageAndFeedbackStyle.name }}>Total Usage</div>

            </div>

            <div style={{ width: '70%', display: 'flex', justifyContent: 'right' }}>
                <div style={{ ...usageAndFeedbackStyle.value }}>{props.totalUsage}</div>
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
                        alt="FeedbackIcon"
                        style={{
                            width: "80px",
                            height: "80px",
                        }} />
                </div>

                <div style={{ ...usageAndFeedbackStyle.name }}>Feedback</div>
            </div>

            <div style={{ width: '75%', display: 'flex', justifyContent: 'right' }}>
                <div style={{ ...usageAndFeedbackStyle.value }}>{props.totalFeedback}</div>
            </div>
        </div>


    )
}


