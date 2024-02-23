import React, { useState, useEffect, useRef } from "react";
import { Button } from "reactstrap";
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
import html2pdf from "html2pdf.js";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import LinearProgress from "@mui/material/LinearProgress";

const PdfGenerate = ({
  StartDate,
  EndDate,
  usageStats,
  collectionStats,
  upiStats,
  feedbackStats,
  bwtStats,
  onClick,
}) => {
  const dispatch = useDispatch();
  const { getLocalStorageItem } = useOnlineStatus();
  let dashboard_data = getLocalStorageItem("dashboard_15");
  const [reportData, setReportData] = useState([]);
  const reportParms = { complex: "REGISTRY_OFFICE_MSCL", duration: "15" };
  const [hasdata, setHasdata] = useState(0);
  const navigate = useNavigate();
  const [loadingPdf, setLoadingPdf] = useState(false);

  let summaryPayload = {};
  console.log("check report generated", {
    StartDate,
    EndDate,
    usageStats,
    collectionStats,
    upiStats,
    feedbackStats,
    bwtStats,
  });
  const generatePDF = () => {
    setLoadingPdf(true);
    const input = document.getElementById("pdf-generate-content");

    //     const cssStyles = `
    //     <style>
    //       thead tr {
    //         border-color: inherit;
    //         border-style: solid;
    //         border-width: 4px; /* Adjust the border width as needed */
    //       }
    //     </style>
    // `;
    //     // Combine CSS styles with HTML content
    //     const htmlContent = cssStyles + input.innerHTML;
    // Define options for html2pdf
    const options = {
      margin: 5,
      filename: "SmartTolilet.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "pt", format: "a4", orientation: "landscape" },
    };

    // Convert HTML content to PDF
    html2pdf()
      .set(options)
      .from(input)
      .toPdf()
      .get("pdf")
      .then(function (pdf) {
        const totalPages = pdf.internal.getNumberOfPages();
        const pageHeight = pdf.internal.pageSize.height;

        // Iterate over each page
        for (let i = 1; i <= totalPages; i++) {
          // Go to current page
          pdf.setPage(i);

          // Calculate height of content on the current page
          const pageContentHeight = pdf.internal.getPageInfo(i).height;

          if (pageContentHeight > pageHeight) {
            // If content height exceeds page height, split the content
            const remainingContentHeight = pageContentHeight - pageHeight;
            let startY = 0;
            let contentOffset = 0;

            // Iterate over content sections
            while (contentOffset < remainingContentHeight) {
              // Insert page break
              pdf.addPage();
              i++; // Increment page number

              // Move content to new page
              pdf.setPage(i);
              pdf.fromHTML(input, 0, -startY); // Add content to new page

              // Calculate remaining content height and adjust startY
              contentOffset += pageHeight;
              startY += pageHeight;
            }
          }
        }

        // Save the PDF
        // dispatch(stopLoading()); // Dispatch the stopLoading action
        pdf.save();
        setTimeout(() => {
          setLoadingPdf(false);
          onClick();
        }, 4000);
      });
  };

  const format_data = (data) => {
    var originalDate = new Date(data);

    // Extract year, month, and day
    var year = originalDate.getFullYear();
    var month = originalDate.getMonth() + 1; // Months are zero-based, so we add 1
    var day = originalDate.getDate();

    // Format month and day to have leading zeros if necessary
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    // Formatted date
    let formattedDate = year + "-" + month + "-" + day;
    return formattedDate;
  };

  const filter_date = (data) => {
    // Define start and end dates
    const startDateString = format_data(StartDate); // Example start date string
    const endDateString = format_data(EndDate); // Example end date string

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
    if (feedback_summary[0].value !== 0) {
      feedback_summary[0].value = parseInt(
        Number(feedback_summary[0].value / totalCount).toFixed(0)
      );
    }
    if (feedback_summary[1].value !== 0) {
      feedback_summary[1].value = parseInt(
        Number(feedback_summary[1].value / totalCount).toFixed(0)
      );
    }
    if (feedback_summary[2].value !== 0) {
      feedback_summary[2].value = parseInt(
        Number(feedback_summary[2].value / totalCount).toFixed(0)
      );
    }
    if (feedback_summary[3].value !== 0) {
      feedback_summary[3].value = parseInt(
        Number(feedback_summary[3].value / totalCount).toFixed(0)
      );
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

  const filter_complex = (all_report_data, name) => {
    // console.log("all_report_data :-->", all_report_data);
    let shouldContinue = true;
    // console.log("name :--> ", name);
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
            // console.log("object data", obj);
            filter_date(obj);
            // dispatch(setReportData(obj));
            // Update the flag to stop further iterations
            shouldContinue = false;
            break; // Exit the inner loop
          }
        }
      }
      // console.log("shouldContinue:-->", reportParms.complex);
      // Exit the outer loop if shouldContinue is false
      if (!shouldContinue) {
        break; // Exit the outer loop if the name is found
      }
    }
  };

  let array = JSON.parse(localStorage.getItem("array_data"));
  // let array = ["REGISTRY_OFFICE_MSCL"];
  console.log("test props data");
  useEffect(() => {
    let value = localStorage.getItem("report_dashboard");
    console.log("check dashboard data", JSON.parse(value));
    array.forEach((name) => {
      filter_complex(JSON.parse(value), name);
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

    const startDateString = format_data(StartDate); // Example start date string
    const endDateString = format_data(EndDate); // Example end date string

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
      feedback_summary[0].value = parseInt(
        Number(feedback_summary[0].value / totalCount).toFixed(0)
      );
    }
    if (feedback_summary[1].value !== 0) {
      feedback_summary[1].value = parseInt(
        Number(feedback_summary[1].value / totalCount).toFixed(0)
      );
    }
    if (feedback_summary[2].value !== 0) {
      feedback_summary[2].value = parseInt(
        Number(feedback_summary[2].value / totalCount).toFixed(0)
      );
    }
    if (feedback_summary[3].value !== 0) {
      feedback_summary[3].value = parseInt(
        Number(feedback_summary[3].value / totalCount).toFixed(0)
      );
    }
    console.log("data?.data.dataSummary :->2", dataSummary);
    // Object.assign(data?.data.dataSummary, {
    //   collection: dataSummary.collection,
    //   feedback: dataSummary.feedback,
    //   upiCollection: dataSummary.upiCollection,
    //   usage: dataSummary.usage,
    // });
    // console.log("piechart", usage_summary);
    // Object.assign(data?.data.pieChartData, {
    //   collection: collection_summary,
    //   feedback: feedback_summary,
    //   upiCollection: upiCollection_summary,
    //   usage: usage_summary,
    // });
  };

  const StatsItem = (props) => {
    let pageBreakClass;
    if (props.className) {
      pageBreakClass = props.className.includes("page-break")
        ? "page-break"
        : "";
    } else {
      pageBreakClass = "";
    }
    return (
      <div
        className={`stats-item ${pageBreakClass}`}
        style={{
          marginTop: "20px",
          pageBreakAfter: pageBreakClass ? "always" : "auto",
        }}
      >
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
                <div
                  style={{
                    width: "90%",
                    height: "100%",
                    margin: "auto",
                    fontSize: "12px",
                  }}
                >
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
                fontSize: "12px",
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
      feedback: "5.0",
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
    return (
      <>
        {loadingPdf == false && (
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
              fontSize: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column", // Stack tables vertically
              }}
              id="pdf-generate-content"
            >
              <div style={{ marginBottom: "20px" }}>
                <div
                  className="row pdf-section"
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
                  className="table table-bordered pdf-section"
                >
                  <thead>
                    <tr></tr>
                    <tr>
                      <th scope="col">Cabin</th>
                      {usageStats && <th scope="col">Usage</th>}
                      {collectionStats && <th scope="col">Collection</th>}
                      {upiStats && <th scope="col">UPI</th>}
                      {feedbackStats && <th scope="col">Feedback</th>}
                      {bwtStats && <th scope="col">Recycled</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">MWC</th>
                      {usageStats && (
                        <td>{summaryPayload?.pieChartData?.usage[0].value}</td>
                      )}
                      {collectionStats && (
                        <td>
                          {summaryPayload?.pieChartData?.collection[0].value}
                        </td>
                      )}
                      {upiStats && (
                        <td>
                          {summaryPayload?.pieChartData?.upiCollection[0].value}
                        </td>
                      )}
                      {feedbackStats && (
                        <td>
                          {Number(
                            summaryPayload?.pieChartData?.feedback[0].value
                          ).toFixed(1)}
                        </td>
                      )}
                      {bwtStats && <td>NA</td>}
                    </tr>
                    <tr>
                      <th scope="row">FWC</th>
                      {usageStats && (
                        <td>{summaryPayload?.pieChartData?.usage[1].value}</td>
                      )}
                      {collectionStats && (
                        <td>
                          {summaryPayload?.pieChartData?.collection[1].value}
                        </td>
                      )}
                      {upiStats && (
                        <td>
                          {summaryPayload?.pieChartData?.upiCollection[1].value}
                        </td>
                      )}
                      {feedbackStats && (
                        <td>
                          {Number(
                            summaryPayload?.pieChartData?.feedback[1].value
                          ).toFixed(1)}
                        </td>
                      )}
                      {bwtStats && <td>NA</td>}
                    </tr>
                    <tr>
                      <th scope="row">PWC</th>
                      {usageStats && (
                        <td>{summaryPayload?.pieChartData?.usage[2].value}</td>
                      )}
                      {collectionStats && (
                        <td>
                          {summaryPayload?.pieChartData?.collection[2].value}
                        </td>
                      )}
                      {upiStats && (
                        <td>
                          {summaryPayload?.pieChartData?.upiCollection[2].value}
                        </td>
                      )}
                      {feedbackStats && (
                        <td>
                          {Number(
                            summaryPayload?.pieChartData?.feedback[2].value
                          ).toFixed(1)}
                        </td>
                      )}
                      {bwtStats && <td>NA</td>}
                    </tr>
                    <tr>
                      <th scope="row">MUR</th>
                      {usageStats && (
                        <td>{summaryPayload?.pieChartData?.usage[3].value}</td>
                      )}
                      {collectionStats && (
                        <td>
                          {summaryPayload?.pieChartData?.collection[3].value}
                        </td>
                      )}
                      {upiStats && (
                        <td>
                          {summaryPayload?.pieChartData?.upiCollection[3].value}
                        </td>
                      )}
                      {feedbackStats && (
                        <td>
                          {Number(
                            summaryPayload?.pieChartData?.feedback[3].value
                          ).toFixed(1)}
                        </td>
                      )}
                      {bwtStats && <td>NA</td>}
                    </tr>
                    <tr>
                      <th scope="row">BWT</th>
                      {usageStats && <td>0</td>}
                      {collectionStats && <td>0</td>}
                      {upiStats && <td>0</td>}
                      {feedbackStats && <td>0.0</td>}
                      {bwtStats && <td>0</td>}
                    </tr>
                    <tr></tr>
                  </tbody>
                </table>
                <table
                  style={{ width: "95%", height: "95%", margin: "30px" }}
                  className="pdf-section page-break"
                >
                  <tbody>
                    <tr>
                      <td style={{ width: "80%" }}>
                        <div style={{ width: "100" }}>
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
                            {usageStats && (
                              <StatsItem
                                className="page-break"
                                name="Usage Stats"
                                total={summaryPayload?.dataSummary?.usage}
                                data={summaryPayload?.dashboardChartData?.usage}
                                pieChartData={
                                  summaryPayload?.pieChartData?.usage
                                }
                              />
                            )}
                            {collectionStats && (
                              <StatsItem
                                name="Collection Stats"
                                total={summaryPayload?.dataSummary?.collection}
                                data={
                                  summaryPayload?.dashboardChartData?.collection
                                }
                                pieChartData={
                                  summaryPayload?.pieChartData?.collection
                                }
                              />
                            )}
                            {upiStats && (
                              <StatsItem
                                className="page-break"
                                name="UPI Stats"
                                total={
                                  summaryPayload?.dataSummary?.upiCollection
                                }
                                data={
                                  summaryPayload?.dashboardChartData
                                    ?.upiCollection
                                }
                                pieChartData={
                                  summaryPayload?.pieChartData?.upiCollection
                                }
                              />
                            )}
                            {bwtStats && (
                              <BWTStatsItem
                                name="Recycled Water"
                                total={
                                  summaryPayload?.bwtdataSummary?.waterRecycled
                                }
                                data={
                                  summaryPayload?.bwtdashboardChartData
                                    ?.waterRecycled
                                }
                                pieChartData={
                                  summaryPayload?.bwtpieChartData.usage
                                }
                              />
                            )}
                            {feedbackStats && (
                              <StatsItem
                                className="page-break"
                                name="Feedback Stats"
                                total={summaryPayload?.dataSummary?.feedback}
                                data={
                                  summaryPayload?.dashboardChartData?.feedback
                                }
                                pieChartData={
                                  summaryPayload?.pieChartData?.feedback
                                }
                              />
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div>
                  <table
                    style={{
                      width: "95%",
                      height: "100%",
                      padding: "0px",
                      marginLeft: "37px",
                      fontSize: "13px",
                    }}
                    className="table table-bordered"
                  >
                    <thead>
                      <tr></tr>
                      <tr>
                        <th colSpan="1" scope="colgroup"></th>
                        {usageStats && (
                          <th colSpan="5" scope="colgroup">
                            Usage
                          </th>
                        )}
                        {collectionStats && (
                          <th colSpan="5" scope="colgroup">
                            Collection
                          </th>
                        )}
                        {upiStats && (
                          <th colSpan="5" scope="colgroup">
                            Upi
                          </th>
                        )}
                        {feedbackStats && (
                          <th colSpan="5" scope="colgroup">
                            Feedback
                          </th>
                        )}
                        {bwtStats && (
                          <th colSpan="1" scope="colgroup">
                            Recycled
                          </th>
                        )}
                      </tr>
                      <tr></tr>
                      <tr>
                        <th scope="col">Date</th>
                        {usageStats && <th scope="col">All</th>}
                        {usageStats && <th scope="col">MWC</th>}
                        {usageStats && <th scope="col">FWC</th>}
                        {usageStats && <th scope="col">PWC</th>}
                        {usageStats && <th scope="col">MUR</th>}
                        {collectionStats && <th scope="col">All</th>}
                        {collectionStats && <th scope="col">MWC</th>}
                        {collectionStats && <th scope="col">FWC</th>}
                        {collectionStats && <th scope="col">PWC</th>}
                        {collectionStats && <th scope="col">MUR</th>}
                        {upiStats && <th scope="col">All</th>}
                        {upiStats && <th scope="col">MWC</th>}
                        {upiStats && <th scope="col">FWC</th>}
                        {upiStats && <th scope="col">PWC</th>}
                        {upiStats && <th scope="col">MUR</th>}
                        {feedbackStats && <th scope="col">All</th>}
                        {feedbackStats && <th scope="col">MWC</th>}
                        {feedbackStats && <th scope="col">FWC</th>}
                        {feedbackStats && <th scope="col">PWC</th>}
                        {feedbackStats && <th scope="col">MUR</th>}
                        {bwtStats && <th scope="col">BWT</th>}
                      </tr>
                      <tr></tr>
                    </thead>
                    <tbody>
                      {summaryPayload?.dashboardChartData.usage.map(
                        (usage, index) => {
                          const rowCount = index + 1; // Adding 1 to start the count from 1
                          const shouldBreakPage =
                            rowCount % 15 === 0 && rowCount !== 0; // Break page after every 15 rows

                          return (
                            <React.Fragment key={index}>
                              <tr key={index}>
                                <td style={{ "font-weight": "bold" }}>
                                  {usage.date}
                                </td>
                                {usageStats && <td>{usage.all}</td>}
                                {usageStats && <td>{usage.mwc}</td>}
                                {usageStats && <td>{usage.fwc}</td>}
                                {usageStats && <td>{usage.pwc}</td>}
                                {usageStats && <td>{usage.mur}</td>}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index].all
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index].mwc
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index].fwc
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index].pwc
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index].mur
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index].all
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index].mwc
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index].fwc
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index].pwc
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index].mur
                                    }
                                  </td>
                                )}
                                {feedbackStats && (
                                  <td>
                                    {Number(
                                      summaryPayload?.dashboardChartData
                                        .feedback[index].all
                                    ).toFixed(1)}
                                  </td>
                                )}
                                {feedbackStats && (
                                  <td>
                                    {Number(
                                      summaryPayload?.dashboardChartData
                                        .feedback[index].mwc
                                    ).toFixed(1)}
                                  </td>
                                )}
                                {feedbackStats && (
                                  <td>
                                    {Number(
                                      summaryPayload?.dashboardChartData
                                        .feedback[index].fwc
                                    ).toFixed(1)}
                                  </td>
                                )}
                                {feedbackStats && (
                                  <td>
                                    {Number(
                                      summaryPayload?.dashboardChartData
                                        .feedback[index].pwc
                                    ).toFixed(1)}
                                  </td>
                                )}
                                {feedbackStats && (
                                  <td>
                                    {Number(
                                      summaryPayload?.dashboardChartData
                                        .feedback[index].mur
                                    ).toFixed(1)}
                                  </td>
                                )}
                                {bwtStats && <td>NA</td>}
                              </tr>
                              {shouldBreakPage && (
                                <tr
                                  className="page-break"
                                  style={{
                                    marginBottom: "10px",
                                    pageBreakAfter: "always",
                                  }}
                                ></tr>
                              )}
                              {index ===
                                summaryPayload.dashboardChartData.usage.length -
                                  1 && (
                                <tr
                                  className="page-break"
                                  style={{
                                    marginBottom: "10px",
                                    pageBreakAfter: "always",
                                  }}
                                ></tr>
                              )}
                            </React.Fragment>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {reportData.map((data, index) => (
                <div
                  key={index}
                  style={{ marginBottom: "20px" }}
                  className="pdf-section"
                >
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
                      <tr></tr>
                      <tr>
                        <th scope="col">Cabin</th>
                        {usageStats && <th scope="col">Usage</th>}
                        {collectionStats && <th scope="col">Collection</th>}
                        {upiStats && <th scope="col">UPI</th>}
                        {feedbackStats && <th scope="col">Feedback</th>}
                        {bwtStats && <th scope="col">Recycled</th>}
                      </tr>
                    </thead>
                    <tbody>
                      <tr></tr>
                      <tr>
                        <th scope="row">MWC</th>
                        {usageStats && (
                          <td>{data?.data?.pieChartData?.usage[0].value}</td>
                        )}
                        {collectionStats && (
                          <td>
                            {data?.data?.pieChartData?.collection[0].value}
                          </td>
                        )}
                        {upiStats && (
                          <td>
                            {data?.data?.pieChartData?.upiCollection[0].value}
                          </td>
                        )}
                        {feedbackStats && (
                          <td>
                            {Number(
                              data?.data?.pieChartData?.feedback[0].value
                            ).toFixed(1)}
                          </td>
                        )}
                        {bwtStats && <td>NA</td>}
                      </tr>
                      <tr>
                        <th scope="row">FWC</th>
                        {usageStats && (
                          <td>{data?.data?.pieChartData?.usage[1].value}</td>
                        )}
                        {collectionStats && (
                          <td>
                            {data?.data?.pieChartData?.collection[1].value}
                          </td>
                        )}
                        {upiStats && (
                          <td>
                            {data?.data?.pieChartData?.upiCollection[1].value}
                          </td>
                        )}
                        {feedbackStats && (
                          <td>
                            {Number(
                              data?.data?.pieChartData?.feedback[1].value
                            ).toFixed(1)}
                          </td>
                        )}
                        {bwtStats && <td>NA</td>}
                      </tr>
                      <tr>
                        <th scope="row">PWC</th>
                        {usageStats && (
                          <td>{data?.data?.pieChartData?.usage[2].value}</td>
                        )}
                        {collectionStats && (
                          <td>
                            {data?.data?.pieChartData?.collection[2].value}
                          </td>
                        )}
                        {upiStats && (
                          <td>
                            {data?.data?.pieChartData?.upiCollection[2].value}
                          </td>
                        )}
                        {feedbackStats && (
                          <td>
                            {Number(
                              data?.data?.pieChartData?.feedback[2].value
                            ).toFixed(1)}
                          </td>
                        )}
                        {bwtStats && <td>NA</td>}
                      </tr>
                      <tr>
                        <th scope="row">MUR</th>
                        {usageStats && (
                          <td>{data?.data?.pieChartData?.usage[3].value}</td>
                        )}
                        {collectionStats && (
                          <td>
                            {data?.data?.pieChartData?.collection[3].value}
                          </td>
                        )}
                        {upiStats && (
                          <td>
                            {data?.data?.pieChartData?.upiCollection[3].value}
                          </td>
                        )}
                        {feedbackStats && (
                          <td>
                            {Number(
                              data?.data?.pieChartData?.feedback[3].value
                            ).toFixed(1)}
                          </td>
                        )}
                        {bwtStats && <td>NA</td>}
                      </tr>
                      <tr>
                        <th scope="row">BWT</th>
                        {usageStats && <td>0</td>}
                        {collectionStats && <td>0</td>}
                        {upiStats && <td>0</td>}
                        {feedbackStats && <td>0.0</td>}
                        {bwtStats && <td>0</td>}
                      </tr>
                      <tr></tr>
                    </tbody>
                  </table>
                  <table
                    style={{ width: "95%", height: "95%", margin: "30px" }}
                  >
                    <tbody>
                      <tr>
                        <td style={{ width: "80%" }}>
                          <div style={{ width: "100" }}>
                            {/* <Stats
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
                          /> */}
                            {usageStats && (
                              <StatsItem
                                className="page-break"
                                name="Usage Stats"
                                total={data?.data?.dataSummary?.usage}
                                data={data?.data?.dashboardChartData?.usage}
                                pieChartData={data?.data?.pieChartData?.usage}
                              />
                            )}
                            {collectionStats && (
                              <StatsItem
                                name="Collection Stats"
                                total={data?.data?.dataSummary?.collection}
                                data={
                                  data?.data?.dashboardChartData?.collection
                                }
                                pieChartData={
                                  data?.data?.pieChartData?.collection
                                }
                              />
                            )}
                            {upiStats && (
                              <StatsItem
                                className="page-break"
                                name="UPI Stats"
                                total={data?.data?.dataSummary?.upiCollection}
                                data={
                                  data?.data?.dashboardChartData?.upiCollection
                                }
                                pieChartData={
                                  data?.data?.pieChartData?.upiCollection
                                }
                              />
                            )}
                            {bwtStats && (
                              <BWTStatsItem
                                name="Recycled Water"
                                total={
                                  data?.data?.bwtdataSummary?.waterRecycled
                                }
                                data={
                                  data?.data?.bwtdashboardChartData
                                    ?.waterRecycled
                                }
                                pieChartData={data?.data?.bwtpieChartData.usage}
                              />
                            )}
                            {feedbackStats && (
                              <StatsItem
                                className="page-break"
                                name="Feedback Stats"
                                total={data?.data?.dataSummary?.feedback}
                                data={data?.data?.dashboardChartData?.feedback}
                                pieChartData={
                                  data?.data?.pieChartData?.feedback
                                }
                              />
                            )}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div>
                    <table
                      style={{
                        width: "100%",
                        height: "100%",
                        padding: "0px",
                        fontSize: "13px",
                      }}
                      className="table table-bordered"
                    >
                      <thead>
                        <tr></tr>
                        <tr>
                          <th colSpan="1" scope="colgroup"></th>
                          {usageStats && (
                            <th colSpan="5" scope="colgroup">
                              Usage
                            </th>
                          )}
                          {collectionStats && (
                            <th colSpan="5" scope="colgroup">
                              Collection
                            </th>
                          )}
                          {upiStats && (
                            <th colSpan="5" scope="colgroup">
                              Upi
                            </th>
                          )}
                          {feedbackStats && (
                            <th colSpan="5" scope="colgroup">
                              Feedback
                            </th>
                          )}
                          {bwtStats && (
                            <th colSpan="1" scope="colgroup">
                              Recycled
                            </th>
                          )}
                        </tr>
                        <tr></tr>
                        <tr>
                          <th scope="col">Date</th>
                          {usageStats && <th scope="col">All</th>}
                          {usageStats && <th scope="col">MWC</th>}
                          {usageStats && <th scope="col">FWC</th>}
                          {usageStats && <th scope="col">PWC</th>}
                          {usageStats && <th scope="col">MUR</th>}
                          {collectionStats && <th scope="col">All</th>}
                          {collectionStats && <th scope="col">MWC</th>}
                          {collectionStats && <th scope="col">FWC</th>}
                          {collectionStats && <th scope="col">PWC</th>}
                          {collectionStats && <th scope="col">MUR</th>}
                          {upiStats && <th scope="col">All</th>}
                          {upiStats && <th scope="col">MWC</th>}
                          {upiStats && <th scope="col">FWC</th>}
                          {upiStats && <th scope="col">PWC</th>}
                          {upiStats && <th scope="col">MUR</th>}
                          {feedbackStats && <th scope="col">All</th>}
                          {feedbackStats && <th scope="col">MWC</th>}
                          {feedbackStats && <th scope="col">FWC</th>}
                          {feedbackStats && <th scope="col">PWC</th>}
                          {feedbackStats && <th scope="col">MUR</th>}
                          {bwtStats && <th scope="col">BWT</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {data?.data?.dashboardChartData.usage.map(
                          (usage, index) => {
                            const rowCount = index + 1; // Adding 1 to start the count from 1
                            const shouldBreakPage =
                              rowCount % 15 === 0 && rowCount !== 0; // Break page after every 15 rows

                            return (
                              <React.Fragment key={index}>
                                <tr key={index}>
                                  <td style={{ "font-weight": "bold" }}>
                                    {usage.date}
                                  </td>
                                  {usageStats && <td>{usage.all}</td>}
                                  {usageStats && <td>{usage.mwc}</td>}
                                  {usageStats && <td>{usage.fwc}</td>}
                                  {usageStats && <td>{usage.pwc}</td>}
                                  {usageStats && <td>{usage.mur}</td>}
                                  {collectionStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .collection[index].all
                                      }
                                    </td>
                                  )}
                                  {collectionStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .collection[index].mwc
                                      }
                                    </td>
                                  )}
                                  {collectionStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .collection[index].fwc
                                      }
                                    </td>
                                  )}
                                  {collectionStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .collection[index].pwc
                                      }
                                    </td>
                                  )}
                                  {collectionStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .collection[index].mur
                                      }
                                    </td>
                                  )}
                                  {upiStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .upiCollection[index].all
                                      }
                                    </td>
                                  )}
                                  {upiStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .upiCollection[index].mwc
                                      }
                                    </td>
                                  )}
                                  {upiStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .upiCollection[index].fwc
                                      }
                                    </td>
                                  )}
                                  {upiStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .upiCollection[index].pwc
                                      }
                                    </td>
                                  )}
                                  {upiStats && (
                                    <td>
                                      {
                                        data?.data?.dashboardChartData
                                          .upiCollection[index].mur
                                      }
                                    </td>
                                  )}
                                  {feedbackStats && (
                                    <td>
                                      {typeof data?.data?.dashboardChartData
                                        .feedback[index].all === "number"
                                        ? data.data.dashboardChartData.feedback[
                                            index
                                          ].all.toFixed(1)
                                        : Number(
                                            data.data.dashboardChartData
                                              .feedback[index].all
                                          ).toFixed(1)}
                                    </td>
                                  )}
                                  {feedbackStats && (
                                    <td>
                                      {typeof data?.data?.dashboardChartData
                                        .feedback[index].mwc === "number"
                                        ? data.data.dashboardChartData.feedback[
                                            index
                                          ].mwc.toFixed(1)
                                        : Number(
                                            data.data.dashboardChartData
                                              .feedback[index].mwc
                                          ).toFixed(1)}
                                    </td>
                                  )}
                                  {feedbackStats && (
                                    <td>
                                      {typeof data?.data?.dashboardChartData
                                        .feedback[index].fwc === "number"
                                        ? data.data.dashboardChartData.feedback[
                                            index
                                          ].fwc.toFixed(1)
                                        : Number(
                                            data.data.dashboardChartData
                                              .feedback[index].fwc
                                          ).toFixed(1)}
                                    </td>
                                  )}
                                  {feedbackStats && (
                                    <td>
                                      {typeof data?.data?.dashboardChartData
                                        .feedback[index].pwc === "number"
                                        ? data.data.dashboardChartData.feedback[
                                            index
                                          ].pwc.toFixed(1)
                                        : Number(
                                            data.data.dashboardChartData
                                              .feedback[index].pwc
                                          ).toFixed(1)}
                                    </td>
                                  )}
                                  {feedbackStats && (
                                    <td>
                                      {typeof data?.data?.dashboardChartData
                                        .feedback[index].mur === "number"
                                        ? data.data.dashboardChartData.feedback[
                                            index
                                          ].mur.toFixed(1)
                                        : Number(
                                            data.data.dashboardChartData
                                              .feedback[index].mur
                                          ).toFixed(1)}
                                    </td>
                                  )}
                                  {bwtStats && <td>NA</td>}
                                </tr>
                                {shouldBreakPage && (
                                  <tr
                                    className="page-break"
                                    style={{
                                      marginBottom: "10px",
                                      pageBreakAfter: "always",
                                    }}
                                  ></tr>
                                )}
                                {index ===
                                  summaryPayload.dashboardChartData.usage
                                    .length -
                                    1 && (
                                  <tr
                                    className="page-break"
                                    style={{
                                      marginBottom: "10px",
                                      pageBreakAfter: "always",
                                    }}
                                  ></tr>
                                )}
                              </React.Fragment>
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
        )}
        <Button
          style={{ margin: "auto", marginTop: "12px" }}
          color="primary"
          className="px-4"
          onClick={generatePDF}
        >
          {loadingPdf ? "Downloading..." : "Generate Offline PDF"}
          {loadingPdf && (
            <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
              <LinearProgress color="secondary" />
            </Stack>
          )}
        </Button>
      </>
    );
  }
};

export default PdfGenerate;
