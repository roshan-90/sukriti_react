import React, { useRef } from "react";
import { colorTheme, statsStyle } from "../../jsStyles/Style";
import { whiteSurface } from "../../jsStyles/Style";
import {
  HalfPieChart,
  FullLineChart,
  BWTHalfPieChart,
  BWTFullLineChart,
} from "../dashboard/component/ReportChart";
import { DropDownLabel } from "../../components/DisplayLabels";

const Stats = (props) => {
  const actionOptions = ["15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];
  const actionValues = [15, 30, 45, 60, 90];
  const cabinDetailsRef = useRef("cabinDetailsData");
  const complexCompositionRef = useRef();
  const messageDialogRef = useRef();

  const createChartData = () => {};

  const handleUpdate = (configName, configValue) => {
    console.log("_updateCommand", configName, configValue);
    const index = actionOptions.indexOf(configValue);
    props.setDurationSelection(actionValues[index]);
  };

  return (
    <div
      style={{
        ...whiteSurface,
        background: "white",
        marginTop: "20px",
        width: "100%",
        height: "100%",
        padding: "10px",
        paddingBottom: "20px",
        display: "flexbox",
        alignItems: "center",
      }}
    >
      {props.isDuration == undefined && props.isDuration !== false && (
        <div style={{ width: "30%", float: "right" }}>
          <DropDownLabel
            label={"Duration"}
            handleUpdate={handleUpdate}
            options={actionOptions}
          />
        </div>
      )}

      <StatsItem
        name="Usage Stats"
        total={props.dataSummary?.usage}
        data={props.chartData?.usage}
        pieChartData={props.pieChartData?.usage}
      />

      {/* UI */}
      {props.uiResult?.collection_stats === "true" && (
        <>
          <StatsItem
            name="Collection Stats"
            total={props.dataSummary?.collection}
            data={props.chartData?.collection}
            pieChartData={props.pieChartData?.collection}
          />
          <StatsItem
            name="UPI Stats"
            total={props.dataSummary?.upiCollection}
            data={props.chartData?.upiCollection}
            pieChartData={props.pieChartData?.upiCollection}
          />
        </>
      )}
      {props.uiResult?.bwt_stats === "true" &&
      props.bwtDataSummary !== undefined ? (
        <BWTStatsItem
          name="Recycled Water"
          total={props.bwtDataSummary?.waterRecycled}
          data={props.bwtChartData?.waterRecycled}
          pieChartData={props.bwtPieChartData?.usage}
        />
      ) : null}
      <StatsItem
        name="Feedback Stats"
        total={props.dataSummary?.feedback}
        data={props.chartData?.feedback}
        pieChartData={props.pieChartData?.feedback}
      />
    </div>
  );
};

const StatsItem = (props) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <div
        className="row"
        style={{
          ...statsStyle.elementTitle,
          width: "98%",
          margin: "auto",
          padding: "10px",
          background: colorTheme.primary,
        }}
      >
        {props.name}
      </div>

      <div className="row" style={{ width: "100%", margin: "auto" }}>
        <div className="col-md-4">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "180px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "90%", height: "100%", margin: "auto" }}>
                <HalfPieChart data={props.pieChartData} />
              </div>
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-30px",
              }}
            >
              {props.total}
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props.name}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <FullLineChart data={props.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

const BWTStatsItem = (props) => {
  return (
    <div style={{ marginTop: "20px" }}>
      <div
        className="row"
        style={{
          ...statsStyle.elementTitle,
          width: "98%",
          margin: "auto",
          padding: "10px",
          background: colorTheme.primary,
        }}
      >
        {props.name}
      </div>

      <div className="row" style={{ width: "100%", margin: "auto" }}>
        <div className="col-md-4">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <div
              style={{
                height: "180px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ width: "90%", height: "100%", margin: "auto" }}>
                <BWTHalfPieChart data={props.pieChartData} />
              </div>
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "-30px",
              }}
            >
              {props.total}
            </div>

            <div
              style={{
                ...statsStyle.pieLabel,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {props.name}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div
            className="col-md-12"
            style={{
              ...whiteSurface,
              background: "white",
              width: "100%",
              height: "220px",
              padding: "10px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
            <BWTFullLineChart data={props.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
