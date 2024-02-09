import React, { useState, useEffect, useRef } from "react";
import { colorTheme, statsStyle } from "../../jsStyles/Style";
import { whiteSurface } from "../../jsStyles/Style";
import {
  HalfPieChart,
  FullLineChart,
  BWTHalfPieChart,
  BWTFullLineChart,
} from "../dashboard/component/ReportChart";
import { useDispatch, useSelector } from "react-redux";
import useOnlineStatus from "../../services/useOnlineStatus";
import Stats from "./Stats";

const PdfGenerate = () => {
  const dispatch = useDispatch();
  const { getLocalStorageItem } = useOnlineStatus();
  let dashboard_data = getLocalStorageItem("dashboard_15");
  const [reportData, setReportData] = useState([]);
  const reportParms = { complex: "REGISTRY_OFFICE_MSCL", duration: "15" };
  const [hasdata, setHasdata] = useState(0);

  let summaryPayload = {};

  const filter_date = (data, duration) => {
    // Define start and end dates
    const startDateString = "2023-12-10"; // Example start date string
    const endDateString = "2024-01-30"; // Example end date string

    // Function to filter data based on date range
    function filterDataByDateRange(data, startDateString, endDateString) {
      // const startDate = new Date();
      // startDate.setDate(startDate.getDate() - duration); // Set start date to 15 days ago
      // const endDate = new Date(); // End date is today
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      return data.filter((entry) => {
        const [day, month, year] = entry.date.split("/");
        const entryDate = new Date(`${year}-${month}-${day}`);
        return entryDate >= startDate && entryDate <= endDate;
      });
    }

    let totalCount = 0;

    let usage_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    let collection_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    let upiCollection_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    let feedback_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    // Create a new object to store filtered data for all keys
    const filteredData = {};
    const dataSummary = {
      collection: 0,
      feedback: 0,
      upiCollection: 0,
      usage: 0,
    };

    const summaryFunction = (key, data) => {
      // console.log("summaryFunction :-->", data);
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          if (key in dataSummary) {
            if (key === "feedback") {
              // console.log("check key feedback :-->", key);
              // console.log("total feedback", data.length);
              totalCount = data.length;
              dataSummary[key] += Number(data[i].all);
              if (data[i].fwc !== 0) {
                feedback_summary[1].value += Number(data[i].fwc);
              }
              if (data[i].mur !== 0) {
                feedback_summary[3].value += Number(data[i].mur);
              }
              if (data[i].mwc !== 0) {
                feedback_summary[0].value += Number(data[i].mwc);
              }
              if (data[i].pwc !== 0) {
                feedback_summary[2].value += Number(data[i].pwc);
              }
            } else {
              // console.log("check key :-->", key);
              // console.log("check vlaue of key :-->", data[i].all);
              dataSummary[key] += Number(data[i].all);
              if (key === "usage") {
                if (data[i].fwc !== 0) {
                  // console.log("ussage summary-->fwc", data[i].fwc);
                  usage_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  // console.log("ussage summary-->mur", data[i].mur);
                  usage_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  // console.log("ussage summary-->mwc", data[i].mwc);
                  usage_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  // console.log("ussage summary-->pwc", data[i].pwc);
                  usage_summary[2].value += Number(data[i].pwc);
                }
                // console.log("usage_summary", usage_summary);
                // console.log("usage_summary--1", usage_summary[0].name);
              } else if (key === "upiCollection") {
                if (data[i].fwc !== 0) {
                  upiCollection_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  upiCollection_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  upiCollection_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  upiCollection_summary[2].value += Number(data[i].pwc);
                }
              } else if (key === "collection") {
                if (data[i].fwc !== 0) {
                  collection_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  collection_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  collection_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  collection_summary[2].value += Number(data[i].pwc);
                }
              }
            }
          }
          // console.log("i :-->", data[i].all);
          // console.log("value :->", key in dataSummary);
        }
      }
    };
    // Loop through each key in data.dashboardChartData
    Object.keys(data.dashboardChartData).forEach((key) => {
      // Filter data based on date range for each key
      filteredData[key] = filterDataByDateRange(
        data.dashboardChartData[key],
        startDateString,
        endDateString
      );
      // console.log("key", key);
      // console.log("filteredData", filteredData[key]);
      summaryFunction(key, filteredData[key]);
    });

    // Update data.dashboardChartData with filteredData
    Object.assign(data.dashboardChartData, filteredData);
    dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(1);
    // console.log("feedback_summary", feedback_summary);
    if (feedback_summary[0].value !== 0) {
      feedback_summary[0].value = Number(
        feedback_summary[0].value / totalCount
      ).toFixed(0);
    }
    if (feedback_summary[1].value !== 0) {
      feedback_summary[1].value = Number(
        feedback_summary[1].value / totalCount
      ).toFixed(0);
    }
    if (feedback_summary[2].value !== 0) {
      feedback_summary[2].value = Number(
        feedback_summary[2].value / totalCount
      ).toFixed(0);
    }
    if (feedback_summary[3].value !== 0) {
      feedback_summary[3].value = Number(
        feedback_summary[3].value / totalCount
      ).toFixed(0);
    }
    // console.log("feedback summary :->2", feedback_summary);
    Object.assign(data.dataSummary, dataSummary);
    Object.assign(data.pieChartData, {
      collection: collection_summary,
      feedback: feedback_summary,
      upiCollection: upiCollection_summary,
      usage: usage_summary,
    });
    setReportData((prevReportData) => [...prevReportData, { data }]);
    // console.log("data.dashboardChartData :-->", data);
    // console.log("data.dashboard summary", dataSummary);
    // console.log("data totalCount", totalCount);
  };

  const filter_complex = (all_report_data, name, duration) => {
    let shouldContinue = true;
    console.log("name :--> ", name);
    console.log("all_report_data :-->", all_report_data);
    for (let i = 0; i < all_report_data.length; i++) {
      const response = all_report_data[i];
      for (let j = 0; j < response.length; j++) {
        const obj = response[j];
        console.log("obj :->", obj);
        // Check if the object has the property 'complexName'
        if (shouldContinue && obj.hasOwnProperty("complexName")) {
          // Print or store the name
          if (obj.complexName === name) {
            console.log(obj.complexName);
            filter_date(obj, duration);
            // dispatch(setReportData(obj));
            // Update the flag to stop further iterations
            shouldContinue = false;
            break; // Exit the inner loop
          }
        }
      }
      console.log("shouldContinue:-->", reportParms.complex);
      // Exit the outer loop if shouldContinue is false
      if (!shouldContinue) {
        break; // Exit the outer loop if the name is found
      }
    }
  };

  let array = ["REGISTRY_OFFICE_MSCL", "TOWNHALL_MSCL", "MUKTIDHAM_MSCL"];
  useEffect(() => {
    let value = localStorage.getItem("report_dashboard");
    array.forEach((name) => {
      filter_complex(JSON.parse(value), name, 90);
    });
    setHasdata(1);
  }, []);

  let totalCount = 0;
  let usage_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let collection_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let upiCollection_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let feedback_summary = [
    { name: "MWC", value: 0 },
    { name: "FWC", value: 0 },
    { name: "PWC", value: 0 },
    { name: "MUR", value: 0 },
  ];
  let dataSummary = {
    collection: 0,
    feedback: 0,
    upiCollection: 0,
    usage: 0,
  };
  const filterDashboadData = (data, key) => {
    for (let i = 0; i < data.length; i++) {
      // console.log(" filter dashboard data", data[i]);
      // console.log("key--->", key);
      // console.log(
      //   "filter dashboard data 22",
      //   summaryPayload.dashboardChartData[key]
      // );
      // Find the object with the same date
      let existingItem = summaryPayload.dashboardChartData[key].find(
        (item) => item.date === data[i].date
      );

      if (key == "feedback") {
        // If the date is present, update its 'all' value
        if (existingItem) {
          existingItem.all += Number(data[i].all);
          existingItem.mwc += Number(data[i].mwc);
          existingItem.fwc += Number(data[i].fwc);
          existingItem.pwc += Number(data[i].pwc);
          existingItem.mur += Number(data[i].mur);
        } else {
          // If the date is not present, push the new object
          summaryPayload.dashboardChartData[key].push(data[i]);
        }
      } else {
        // If the date is present, update its 'all' value
        if (existingItem) {
          existingItem.all += Number(data[i].all);
          existingItem.mwc += Number(data[i].mwc);
          existingItem.fwc += Number(data[i].fwc);
          existingItem.pwc += Number(data[i].pwc);
          existingItem.mur += Number(data[i].mur);
        } else {
          // If the date is not present, push the new object
          summaryPayload.dashboardChartData[key].push(data[i]);
        }
      }
    }
  };

  const createSummaryFunction = async (data) => {
    const summaryFunction = (key, data) => {
      // console.log("summaryFunction11 :-->", data);
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          if (key in dataSummary) {
            if (key === "feedback") {
              // console.log("check key feedback :-->", key);
              // console.log("total feedback", data.length);
              totalCount = data.length;
              dataSummary[key] += Number(data[i].all);
              if (data[i].fwc !== 0) {
                feedback_summary[1].value += Number(data[i].fwc);
              }
              if (data[i].mur !== 0) {
                feedback_summary[3].value += Number(data[i].mur);
              }
              if (data[i].mwc !== 0) {
                feedback_summary[0].value += Number(data[i].mwc);
              }
              if (data[i].pwc !== 0) {
                feedback_summary[2].value += Number(data[i].pwc);
              }
            } else {
              // console.log("check key :-->", key);
              // console.log("check vlaue of key :-->", data[i].all);
              dataSummary[key] += Number(data[i].all);
              if (key === "usage") {
                if (data[i].fwc !== 0) {
                  // console.log("ussage summary-->fwc", data[i].fwc);
                  usage_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  // console.log("ussage summary-->mur", data[i].mur);
                  usage_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  // console.log("ussage summary-->mwc", data[i].mwc);
                  usage_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  // console.log("ussage summary-->pwc", data[i].pwc);
                  usage_summary[2].value += Number(data[i].pwc);
                }
                // console.log("usage_summary", usage_summary);
                // console.log("usage_summary--1", usage_summary[0].name);
              } else if (key === "upiCollection") {
                if (data[i].fwc !== 0) {
                  upiCollection_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  upiCollection_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  upiCollection_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  upiCollection_summary[2].value += Number(data[i].pwc);
                }
              } else if (key === "collection") {
                if (data[i].fwc !== 0) {
                  collection_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  collection_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  collection_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  collection_summary[2].value += Number(data[i].pwc);
                }
              }
            }
          }
          // console.log("i :-->", data[i].all);
          // console.log("value :->", key in dataSummary);
        }
      }
    };

    // Define start and end dates
    const startDateString = "2023-12-10"; // Example start date string
    const endDateString = "2024-01-30"; // Example end date string

    // Function to filter data based on date range
    const filterByDateRange = (data, startDateString, endDateString) => {
      const startDate = new Date(startDateString);
      const endDate = new Date(endDateString);
      return data.filter((entry) => {
        const [day, month, year] = entry.date.split("/");
        const entryDate = new Date(`${year}-${month}-${day}`);
        return entryDate >= startDate && entryDate <= endDate;
      });
    };

    const filteredData = {};
    // console.log("create new", data.data);
    Object.keys(data?.data?.dashboardChartData).forEach((key) => {
      // Filter data based on date range for each key
      // console.log("createSummaryFunction key", key);
      filteredData[key] = filterByDateRange(
        data.data.dashboardChartData[key],
        startDateString,
        endDateString
      );

      // console.log("createSummaryFunction filteredData", filteredData[key]);
      filterDashboadData(filteredData[key], key);
      summaryFunction(key, filteredData[key]);
    });

    // console.log("summaryPayload", summaryPayload);
    Object.assign(data?.data?.dashboardChartData, filteredData);
    dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(1);
    console.log("feedback_summary", feedback_summary);
    if (feedback_summary[0].value !== 0) {
      feedback_summary[0].value = Number(
        feedback_summary[0].value / totalCount
      ).toFixed(0);
    }
    if (feedback_summary[1].value !== 0) {
      feedback_summary[1].value = Number(
        feedback_summary[1].value / totalCount
      ).toFixed(0);
    }
    if (feedback_summary[2].value !== 0) {
      feedback_summary[2].value = Number(
        feedback_summary[2].value / totalCount
      ).toFixed(0);
    }
    if (feedback_summary[3].value !== 0) {
      feedback_summary[3].value = Number(
        feedback_summary[3].value / totalCount
      ).toFixed(0);
    }
    console.log("data?.data.dataSummary :->2", dataSummary);
    // Object.assign(data?.data.dataSummary, {
    //   collection: dataSummary.collection,
    //   feedback: dataSummary.feedback,
    //   upiCollection: dataSummary.upiCollection,
    //   usage: dataSummary.usage,
    // });
    console.log("piechart", usage_summary);
    // Object.assign(data?.data.pieChartData, {
    //   collection: collection_summary,
    //   feedback: feedback_summary,
    //   upiCollection: upiCollection_summary,
    //   usage: usage_summary,
    // });
  };

  if (hasdata) {
    console.log("hasdata", hasdata);
    console.log("reportData", reportData);
    summaryPayload.bwtAvalibility = reportData[0].data.bwtAvalibility;
    summaryPayload.bwtdashboardChartData =
      reportData[0].data.bwtdashboardChartData;
    summaryPayload.bwtdataSummary = reportData[0].data.bwtdataSummary;
    summaryPayload.complexName = "Data Report for all complex";
    summaryPayload.bwtpieChartData = reportData[0].data.bwtpieChartData;
    summaryPayload.dashboardChartData = {
      usage: [],
      feedback: [],
      collection: [],
      upiCollection: [],
    };

    reportData.forEach(async (data) => {
      await createSummaryFunction(data);
    });
    console.log("data?.data.dataSummary :->23", dataSummary);
    summaryPayload.dataSummary = {
      collection: dataSummary.collection,
      feedback: dataSummary.feedback,
      upiCollection: dataSummary.upiCollection,
      usage: dataSummary.usage,
    };
    summaryPayload.pieChartData = {
      usage: usage_summary,
      feedback: feedback_summary,
      collection: collection_summary,
      upiCollection: upiCollection_summary,
    };

    dataSummary = {
      collection: 0,
      feedback: 0,
      upiCollection: 0,
      usage: 0,
    };
    usage_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    collection_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    upiCollection_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    feedback_summary = [
      { name: "MWC", value: 0 },
      { name: "FWC", value: 0 },
      { name: "PWC", value: 0 },
      { name: "MUR", value: 0 },
    ];
    console.log("summaryPayload test", summaryPayload);
    // Assuming you want to render each item in the reportData array horizontally
    setHasdata(0);
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
          overflowX: "auto", // Enable horizontal scrolling
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Stack tables vertically
          }}
        >
          <div style={{ marginBottom: "20px" }}>
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
              {`Summary :  ${summaryPayload?.complexName}`}
            </div>
            <table
              style={{ width: "95%", height: "95%", margin: "30px" }}
              className="table table-bordered"
            >
              <thead>
                <tr>
                  <th scope="col">Cabin</th>
                  <th scope="col">Usage</th>
                  <th scope="col">Collection</th>
                  <th scope="col">UPI</th>
                  <th scope="col">Feedback</th>
                  <th scope="col">Recycled</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">MWC</th>
                  <td>{summaryPayload?.pieChartData?.usage[0].value}</td>
                  <td>{summaryPayload?.pieChartData?.collection[0].value}</td>
                  <td>
                    {summaryPayload?.pieChartData?.upiCollection[0].value}
                  </td>
                  <td>{summaryPayload?.pieChartData?.feedback[0].value}</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <th scope="row">FWC</th>
                  <td>{summaryPayload?.pieChartData?.usage[1].value}</td>
                  <td>{summaryPayload?.pieChartData?.collection[1].value}</td>
                  <td>
                    {summaryPayload?.pieChartData?.upiCollection[1].value}
                  </td>
                  <td>{summaryPayload?.pieChartData?.feedback[1].value}</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <th scope="row">PWC</th>
                  <td>{summaryPayload?.pieChartData?.usage[2].value}</td>
                  <td>{summaryPayload?.pieChartData?.collection[2].value}</td>
                  <td>
                    {summaryPayload?.pieChartData?.upiCollection[2].value}
                  </td>
                  <td>{summaryPayload?.pieChartData?.feedback[2].value}</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <th scope="row">MUR</th>
                  <td>{summaryPayload?.pieChartData?.usage[3].value}</td>
                  <td>{summaryPayload?.pieChartData?.collection[3].value}</td>
                  <td>
                    {summaryPayload?.pieChartData?.upiCollection[3].value}
                  </td>
                  <td>{summaryPayload?.pieChartData?.feedback[3].value}</td>
                  <td>NA</td>
                </tr>
                <tr>
                  <th scope="row">BWT</th>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                  <td>0</td>
                </tr>
              </tbody>
            </table>
            <table style={{ width: "95%", height: "95%", margin: "30px" }}>
              <tbody>
                <tr>
                  <td style={{ width: "80%" }}>
                    <div style={{ width: "100" }}>
                      <Stats
                        isDuration={false}
                        chartData={summaryPayload?.dashboardChartData}
                        pieChartData={summaryPayload?.pieChartData}
                        dataSummary={summaryPayload?.dataSummary}
                        bwtChartData={summaryPayload?.bwtdashboardChartData}
                        bwtPieChartData={summaryPayload?.bwtpieChartData}
                        bwtDataSummary={summaryPayload?.bwtdataSummary}
                        // dashboardUpiChartData={
                        //   summaryPayload?.dashboardUpiChartData
                        // }
                        // pieChartUpiData={summaryPayload?.pieChartUpiData}
                        uiResult={dashboard_data?.uiResult?.data}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <table
                style={{ width: "100%", height: "100%", padding: "0px" }}
                className="table table-bordered"
              >
                <thead>
                  <tr>
                    <th colSpan="1" scope="colgroup"></th>
                    <th colSpan="5" scope="colgroup">
                      Usage
                    </th>
                    <th colSpan="5" scope="colgroup">
                      Collection
                    </th>
                    <th colSpan="5" scope="colgroup">
                      Upi
                    </th>
                    <th colSpan="5" scope="colgroup">
                      Feedback
                    </th>
                    <th colSpan="1" scope="colgroup">
                      Recycled
                    </th>
                  </tr>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">All</th>
                    <th scope="col">MWC</th>
                    <th scope="col">FWC</th>
                    <th scope="col">PWC</th>
                    <th scope="col">MUR</th>
                    <th scope="col">All</th>
                    <th scope="col">MWC</th>
                    <th scope="col">FWC</th>
                    <th scope="col">PWC</th>
                    <th scope="col">MUR</th>
                    <th scope="col">All</th>
                    <th scope="col">MWC</th>
                    <th scope="col">FWC</th>
                    <th scope="col">PWC</th>
                    <th scope="col">MUR</th>
                    <th scope="col">All</th>
                    <th scope="col">MWC</th>
                    <th scope="col">FWC</th>
                    <th scope="col">PWC</th>
                    <th scope="col">MUR</th>
                    <th scope="col">BWT</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryPayload?.dashboardChartData.usage.map(
                    (usage, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ "font-weight": "bold" }}>
                            {usage.date}
                          </td>
                          <td>{usage.all}</td>
                          <td>{usage.mwc}</td>
                          <td>{usage.fwc}</td>
                          <td>{usage.pwc}</td>
                          <td>{usage.mur}</td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.collection[
                                index
                              ].all
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.collection[
                                index
                              ].mwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.collection[
                                index
                              ].fwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.collection[
                                index
                              ].pwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.collection[
                                index
                              ].mur
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.upiCollection[
                                index
                              ].all
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.upiCollection[
                                index
                              ].mwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.upiCollection[
                                index
                              ].fwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.upiCollection[
                                index
                              ].pwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.upiCollection[
                                index
                              ].mur
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.feedback[index]
                                .all
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.feedback[index]
                                .mwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.feedback[index]
                                .fwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.feedback[index]
                                .pwc
                            }
                          </td>
                          <td>
                            {
                              summaryPayload?.dashboardChartData.feedback[index]
                                .mur
                            }
                          </td>
                          <td>NA</td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {reportData.map((data, index) => (
            <div key={index} style={{ marginBottom: "20px" }}>
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
                {`Data Report for complex : ${data?.data?.complexName}`}
              </div>
              <table
                style={{ width: "95%", height: "95%", margin: "30px" }}
                className="table table-bordered"
                key={index}
              >
                <thead>
                  <tr>
                    <th scope="col">Cabin</th>
                    <th scope="col">Usage</th>
                    <th scope="col">Collection</th>
                    <th scope="col">UPI</th>
                    <th scope="col">Feedback</th>
                    <th scope="col">Recycled</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">MWC</th>
                    <td>{data?.data?.pieChartData?.usage[0].value}</td>
                    <td>{data?.data?.pieChartData?.collection[0].value}</td>
                    <td>{data?.data?.pieChartData?.upiCollection[0].value}</td>
                    <td>{data?.data?.pieChartData?.feedback[0].value}</td>
                    <td>NA</td>
                  </tr>
                  <tr>
                    <th scope="row">FWC</th>
                    <td>{data?.data?.pieChartData?.usage[1].value}</td>
                    <td>{data?.data?.pieChartData?.collection[1].value}</td>
                    <td>{data?.data?.pieChartData?.upiCollection[1].value}</td>
                    <td>{data?.data?.pieChartData?.feedback[1].value}</td>
                    <td>NA</td>
                  </tr>
                  <tr>
                    <th scope="row">PWC</th>
                    <td>{data?.data?.pieChartData?.usage[2].value}</td>
                    <td>{data?.data?.pieChartData?.collection[2].value}</td>
                    <td>{data?.data?.pieChartData?.upiCollection[2].value}</td>
                    <td>{data?.data?.pieChartData?.feedback[2].value}</td>
                    <td>NA</td>
                  </tr>
                  <tr>
                    <th scope="row">MUR</th>
                    <td>{data?.data?.pieChartData?.usage[3].value}</td>
                    <td>{data?.data?.pieChartData?.collection[3].value}</td>
                    <td>{data?.data?.pieChartData?.upiCollection[3].value}</td>
                    <td>{data?.data?.pieChartData?.feedback[3].value}</td>
                    <td>NA</td>
                  </tr>
                  <tr>
                    <th scope="row">BWT</th>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "95%", height: "95%", margin: "30px" }}>
                <tbody>
                  <tr>
                    <td style={{ width: "80%" }}>
                      <div style={{ width: "100" }}>
                        <Stats
                          isDuration={false}
                          chartData={data?.data?.dashboardChartData}
                          pieChartData={data?.data?.pieChartData}
                          dataSummary={data?.data?.dataSummary}
                          bwtChartData={data?.data?.bwtdashboardChartData}
                          bwtPieChartData={data?.data?.bwtpieChartData}
                          bwtDataSummary={data?.data?.bwtdataSummary}
                          dashboardUpiChartData={
                            data?.data?.dashboardUpiChartData
                          }
                          pieChartUpiData={data?.data?.pieChartUpiData}
                          uiResult={dashboard_data?.uiResult?.data}
                        />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div>
                <table
                  style={{ width: "100%", height: "100%", padding: "0px" }}
                  className="table table-bordered"
                >
                  <thead>
                    <tr>
                      <th colSpan="1" scope="colgroup"></th>
                      <th colSpan="5" scope="colgroup">
                        Usage
                      </th>
                      <th colSpan="5" scope="colgroup">
                        Collection
                      </th>
                      <th colSpan="5" scope="colgroup">
                        Upi
                      </th>
                      <th colSpan="5" scope="colgroup">
                        Feedback
                      </th>
                      <th colSpan="1" scope="colgroup">
                        Recycled
                      </th>
                    </tr>
                    <tr>
                      <th scope="col">Date</th>
                      <th scope="col">All</th>
                      <th scope="col">MWC</th>
                      <th scope="col">FWC</th>
                      <th scope="col">PWC</th>
                      <th scope="col">MUR</th>
                      <th scope="col">All</th>
                      <th scope="col">MWC</th>
                      <th scope="col">FWC</th>
                      <th scope="col">PWC</th>
                      <th scope="col">MUR</th>
                      <th scope="col">All</th>
                      <th scope="col">MWC</th>
                      <th scope="col">FWC</th>
                      <th scope="col">PWC</th>
                      <th scope="col">MUR</th>
                      <th scope="col">All</th>
                      <th scope="col">MWC</th>
                      <th scope="col">FWC</th>
                      <th scope="col">PWC</th>
                      <th scope="col">MUR</th>
                      <th scope="col">BWT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.dashboardChartData.usage.map(
                      (usage, index) => {
                        return (
                          <tr key={index}>
                            <td style={{ "font-weight": "bold" }}>
                              {usage.date}
                            </td>
                            <td>{usage.all}</td>
                            <td>{usage.mwc}</td>
                            <td>{usage.fwc}</td>
                            <td>{usage.pwc}</td>
                            <td>{usage.mur}</td>
                            <td>
                              {
                                data?.data?.dashboardChartData.collection[index]
                                  .all
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.collection[index]
                                  .mwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.collection[index]
                                  .fwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.collection[index]
                                  .pwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.collection[index]
                                  .mur
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.upiCollection[
                                  index
                                ].all
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.upiCollection[
                                  index
                                ].mwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.upiCollection[
                                  index
                                ].fwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.upiCollection[
                                  index
                                ].pwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.upiCollection[
                                  index
                                ].mur
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.feedback[index]
                                  .all
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.feedback[index]
                                  .mwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.feedback[index]
                                  .fwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.feedback[index]
                                  .pwc
                              }
                            </td>
                            <td>
                              {
                                data?.data?.dashboardChartData.feedback[index]
                                  .mur
                              }
                            </td>
                            <td>NA</td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
};

export default PdfGenerate;