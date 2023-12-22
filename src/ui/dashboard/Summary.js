import React, { useRef } from "react";
import { whiteSurface } from "../../jsStyles/Style";
import { NoAxisLineChart } from "./component/Charts";

const tempData = [
  {
    name: "Page A",
    all: 5000,
  },
  {
    name: "Page B",
    all: 2210,
  },
  {
    name: "Page C",
    all: 2290,
  },
  {
    name: "Page D",
    all: 2000,
  },
  {
    name: "Page E",
    all: 2181,
  },
  {
    name: "Page F",
    all: 2500,
  },
  {
    name: "Page G",
    all: 0,
  },
];

const Summary = (props) => {
  const complexComposition = useRef();
  const messageDialog = useRef();

  // Check if props and its required properties exist
  if (!props) {
    return null;
  }

  console.log("Summary", props);

  const Item = (itemProps) => {
    return (
      <div
        className="row"
        style={{
          ...whiteSurface,
          background: "white",
          width: "100%",
          padding: "10px",
          display: "flexbox",
          alignItems: "center",
        }}
      >
        <div className="col-md-4">
          <div className="col-md-12">
            <div className="row">{itemProps.name}</div>
            <div className="row">{itemProps.value}</div>
          </div>
        </div>
        <div className="col-md-8">
          <div className="col-md-12">
            <NoAxisLineChart data={itemProps.data} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animated fadeIn">
      <div className="row" style={{ justifyContent: "space-between" }}>
        {props.uiResult?.data?.total_usage === "true" && (
          <div className="col-md-4">
            <Item
              name="Total Usage"
              value={props.dataSummary.usage}
              data={props.chartData.usage}
            />
          </div>
        )}
        {props.uiResult?.data?.average_feedback === "true" && (
          <div className="col-md-4">
            <Item
              name="Average Feedback"
              value={props.dataSummary.feedback}
              data={props.chartData.feedback}
            />
          </div>
        )}
        {props.uiResult?.data?.water_saved === "true" && (
          <div className="col-md-4">
            {props.bwtDataSummary !== undefined ? (
              <Item
                name="Water Saved"
                value={props.bwtDataSummary.waterRecycled}
                data={props.bwtChartData.waterRecycled}
              />
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
