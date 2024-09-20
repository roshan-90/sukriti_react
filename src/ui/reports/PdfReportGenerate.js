import React, { useState, useEffect, useRef, useMemo } from "react";
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
import ReportCover from './ReportCover';

const PdfGenerate = ({
  StartDate,
  EndDate ,
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
  const [summaryUssagePayload, setSummaryUssagePayload] = useState(null);
  const [datasummaryPayload, setDataSummaryPayload] = useState(null);
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
    let currentTimestamp = Date.now();
    const input = document.getElementById("pdf-generate-content");
    const options = {
      margin: 5,
      filename: `SmartTolilet_${currentTimestamp}.pdf`,
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
        pdf.save(options.filename);  // Ensure the filename is set here
        setTimeout(() => {
          setLoadingPdf(false);
          onClick();
        }, 4000);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        setLoadingPdf(false); // Stop loading if there's an error
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

  const filter_complex = async (all_report_data, name) => {
    // console.log("all_report_data :-->", all_report_data);
    let shouldContinue = true;
    // console.log("name :--> ", name);
    for (let i = 0; i < all_report_data.length; i++) {
      const response = all_report_data[i];
      for (let j = 0; j < response.length; j++) {
        const obj = response[j];
        // console.log("obj :->", obj);
        // Check if the object has the property 'complexName'
        if (shouldContinue && obj.hasOwnProperty("complexName")) {
          // Print or store the name
          if (obj.complexName === name) {
            console.log(obj.complexName);
            console.log("object data", obj);
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

  const filterComplexData = async (value, array) => {
    for (const name of array) {
      await filter_complex(JSON.parse(value), name);
    }
  };
  

  useEffect(() => {
      let value = localStorage.getItem("report_dashboard");
      console.log("check dashboard data", JSON.parse(value));
      let array = JSON.parse(localStorage.getItem("array_data"));
        // let array = ["REGISTRY_OFFICE_MSCL"];
      console.log('checking array value', array);
      filterComplexData(value, array);
    // array.forEach((name) => {
    //   filter_complex(JSON.parse(value), name);
    // });
    setHasdata(1);
  }, []);
  
  console.log("test props data");
  console.log('reportData check value', reportData);

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
                fontSize: "12px",
              }}
            >
              <BWTFullLineChart data={props.data} />
            </div>
          </div>
        </div>
      </div>
    );
  };


// reportData.forEach(async (data) => {
//   await createSummaryFunction(data);
// });

  // Execute the async operation and log the final summary_dashboard
  
  // (async () => {
  //   await processReportData(reportData);
  //   console.log('starting first only');
  // })();
  console.log('starting second  only');

  const OfflineSummaryComponent = (summaryUssagePayload) => {
    console.log('datasummaryPayload checked :->', datasummaryPayload);
    summaryPayload.bwtAvalibility = reportData[0].data.bwtAvalibility;
    summaryPayload.bwtdashboardChartData =
      reportData[0].data.bwtdashboardChartData;
    summaryPayload.bwtdataSummary = reportData[0].data.bwtdataSummary;
    summaryPayload.complexName = "Data Report for all complex";
    summaryPayload.bwtpieChartData = reportData[0].data.bwtpieChartData;
    summaryPayload.dashboardChartData = summaryUssagePayload.summaryUssagePayload;
    summaryPayload.dataSummary = {
      collection: datasummaryPayload.dataSummary.collection,
      feedback: "5.0",
      upiCollection: datasummaryPayload.dataSummary.upiCollection,
      usage: datasummaryPayload.dataSummary.usage,
    };
    let feedback_summary_update = datasummaryPayload.feedback_summary.map((item) => {
      console.log('item',item);
       return {
          ...item, // Spread the current object
          value: item.value > 5 ? 5 : item.value // Update value based on condition
      };
  })

  console.log('feedback_summary_update', feedback_summary_update);
    summaryPayload.pieChartData = {
      usage: datasummaryPayload.usage_summary,
      feedback: feedback_summary_update,
      collection: datasummaryPayload.collection_summary,
      upiCollection: datasummaryPayload.upiCollection_summary,
    };

    console.log("after summaryPayload test", summaryPayload);
    console.log('summaryUssagePayload :->', summaryUssagePayload.summaryUssagePayload);
    return (
      <>
          <div>
                  <ReportCover StartDate={StartDate} EndDate={EndDate} />
                  <br/>
              </div>

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
                        // <td>
                        //   {Number(
                        //     summaryPayload?.pieChartData?.feedback[0].value
                        //   ).toFixed(1)}
                        // </td>
                        <td>
                          {'5.0'}
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
                                className={((usageStats == true && upiStats == false && bwtStats == false && feedbackStats == false && collectionStats == true) ||  (usageStats == false && collectionStats == true && upiStats == true && feedbackStats == true &&bwtStats == false))  ? "page-break" : ""}
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
                                className={((usageStats == true && collectionStats == true ) || (usageStats == false && collectionStats == false ) || (usageStats == false && collectionStats == true && bwtStats == false && feedbackStats == false )|| (usageStats == true && collectionStats == false && bwtStats == false && feedbackStats == false && upiStats == true ) ) ? "page-break" : ""}
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
                            {/* {((usageStats == true && collectionStats == true ) || (usageStats == false && collectionStats == false )) && <div  className="page-break" ></div> } */}
                            {bwtStats && (
                              <BWTStatsItem
                                className= {((usageStats == true && collectionStats == true && upiStats == true ) || (usageStats == false && collectionStats == false && upiStats == false && feedbackStats == false ) || (usageStats == false && collectionStats == false && upiStats == false && feedbackStats == true ) || (usageStats == true && collectionStats == false && upiStats == false && feedbackStats == false && bwtStats == true )) ? "page-break" : ""}
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
                            {/* {((usageStats == true && collectionStats == true && upiStats == true ) || (usageStats == false && collectionStats == false && upiStats == false )) && <div  className="page-break" ></div> } */}
                            {feedbackStats && (
                              <StatsItem
                                className= {((usageStats == true && collectionStats == true && upiStats == true && bwtStats == true ) || (usageStats == false && collectionStats == false && upiStats == false && bwtStats == false) || (usageStats == false && collectionStats == true && upiStats == true && bwtStats == false) || (usageStats == false && collectionStats == false && upiStats == false && bwtStats == true ) || (usageStats == true && collectionStats == false && upiStats == false && bwtStats == false && feedbackStats == true ) || (usageStats == false && collectionStats == false && upiStats == true && bwtStats == true && feedbackStats == true ) || (usageStats == true && collectionStats == true && upiStats == true && bwtStats == false && feedbackStats == true )) ? "page-break" : ""}
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
                      {summaryPayload.dashboardChartData.usage.map(
                        (usage, index) => {
                          const rowCount = index + 1; // Adding 1 to start the count from 1
                          const shouldBreakPage =
                            rowCount % 15 === 0 && rowCount !== 0; // Break page after every 15 rows

                          return (
                            <React.Fragment key={index}>
                              <tr key={index}>
                                <td style={{ "fontWeight": "bold" }}>
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
                                        .collection[index]?.all ?? 0
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index]?.mwc ?? 0
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index]?.fwc ?? 0
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index]?.pwc ?? 0
                                    }
                                  </td>
                                )}
                                {collectionStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .collection[index]?.mur ?? 0
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index]?.all ?? 0
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index]?.mwc ?? 0
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index]?.fwc ?? 0
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index]?.pwc ?? 0
                                    }
                                  </td>
                                )}
                                {upiStats && (
                                  <td>
                                    {
                                      summaryPayload?.dashboardChartData
                                        .upiCollection[index]?.mur ?? 0
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
      </>
    );
  };

  const memoizedSummaryComponent = useMemo(() => {
    if(summaryUssagePayload) {
      console.log('summaryUssagePayload jj',summaryUssagePayload)
      return <OfflineSummaryComponent summaryUssagePayload={summaryUssagePayload} datasummaryPayload={datasummaryPayload}/>;
    }
  }, [summaryUssagePayload,datasummaryPayload]);

  const OfflineReportComponent = () => {
    // Separate variables for each key
      let usage = [];
      let feedback = [];
      let collection = [];
      let upiCollection = [];

      const filterDashboadData = async (data, key, summaryVariable) => {
        for (let i = 0; i < data.length; i++) {
          let currentItem = data[i];

          // console.log(`Processing item in ${key}:`, currentItem);

          // Find the object with the same date
          let existingItemIndex = summaryVariable.findIndex(
            (item) => item.date === currentItem.date
          );

          let existingItem = summaryVariable[existingItemIndex];

          if (key === "feedback") {
            if (existingItem) {
              // console.log("Feedback item already exists, skipping.");
            } else {
              // console.log("Pushing new feedback data:", currentItem);
              summaryVariable.push(currentItem);
            }
          } else {
            if (existingItem) {
              // console.log("Existing item found, updating:", existingItem);

              summaryVariable[existingItemIndex] = {
                ...existingItem,
                all: Number(existingItem.all) + Number(currentItem.all),
                mwc: Number(existingItem.mwc) + Number(currentItem.mwc),
                fwc: Number(existingItem.fwc) + Number(currentItem.fwc),
                pwc: Number(existingItem.pwc) + Number(currentItem.pwc),
                mur: Number(existingItem.mur) + Number(currentItem.mur),
              };

              // console.log("Updated item:", summaryVariable[existingItemIndex]);
            } else {
              // console.log("No existing item found, pushing new data:", currentItem);

              summaryVariable.push({
                ...currentItem,
                all: Number(currentItem.all),
                mwc: Number(currentItem.mwc),
                fwc: Number(currentItem.fwc),
                pwc: Number(currentItem.pwc),
                mur: Number(currentItem.mur),
              });
            }
          }

          // Log updated summary after each iteration
          // console.log(`Updated ${key} summary:`, summaryVariable);
        }
      };

      // Process report data using separate variables
      const processReportData = async (reportData) => {
        for (const data of reportData) {
          await createSummaryDashboardStructure(data);
        }
      };

      const createSummaryDashboardStructure = async (data) => {
        for (const key of Object.keys(data?.data?.dashboardChartData)) {
          let summaryVariable;

          // Map the key to the correct summary variable
          switch (key) {
            case "usage":
              summaryVariable = usage;
              break;
            case "feedback":
              summaryVariable = feedback;
              break;
            case "collection":
              summaryVariable = collection;
              break;
            case "upiCollection":
              summaryVariable = upiCollection;
              break;
            default:
              summaryVariable = [];
              break;
          }

          await filterDashboadData(data?.data?.dashboardChartData[key], key, summaryVariable);
          // console.log(`Check after processing ${key}:`, summaryVariable);
        }
      };

        // summary dashboardchart data function start 
    (async () => {
      await processReportData(reportData);
      console.log("Final usage summary:", usage);
      console.log("Final feedback summary:", feedback);
      console.log("Final collection summary:", collection);
      console.log("Final upiCollection summary:", upiCollection);
      setSummaryUssagePayload({usage:usage,feedback:reportData[0].data.dashboardChartData.feedback, collection:collection, upiCollection:upiCollection })
      console.log('Data processing completed');
      console.log('summaryUssagePayload',summaryUssagePayload);
    })();
    
    // summary dashboardchart data function end 

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
        // filteredData[key] = filterByDateRange(
        //   data.data.dashboardChartData[key],
        //   startDateString,
        //   endDateString
        // );
  
        // console.log("createSummaryFunction filteredData", filteredData[key]);
        summaryFunction(key, data?.data?.dashboardChartData[key]);
        // await filterDashboadData(data?.data?.dashboardChartData[key], key);
      });
  
      // console.log("summaryPayload", summaryPayload);
      // Object.assign(data?.data?.dashboardChartData, filteredData);
      console.log("feedback_summary", feedback_summary);
      console.log('dataSummary check',dataSummary);
      console.log('feedback check', dataSummary.feedback);
      console.log('dataSummary.count',totalCount);
      dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(0);
      console.log('after dataSummary',dataSummary);
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
    };

    const CreateSummaryData = async (reportData) => {
      for (const data of reportData) {
        await createSummaryFunction(data);
      }
    };

    (async () => {
      await CreateSummaryData(reportData);
      console.log('starting first only');
      console.log('dataSummary check again', dataSummary);
      setDataSummaryPayload({dataSummary:dataSummary,usage_summary:usage_summary,feedback_summary:feedback_summary, upiCollection_summary:upiCollection_summary, collection_summary:collection_summary })
      console.log('usage_summary check again', usage_summary);
      console.log('feedback_summary check again', feedback_summary);
    })();

    console.log("summaryPayload test", summaryPayload);
    return (
      <>
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
                        {/* <tr>
                          <th scope="row">BWT</th>
                          {usageStats && <td>0</td>}
                          {collectionStats && <td>0</td>}
                          {upiStats && <td>0</td>}
                          {feedbackStats && <td>0.0</td>}
                          {bwtStats && <td>0</td>}
                        </tr> */}
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
                                {/* {usageStats && <div  className="page-break" ></div> } */}
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
                                  className={((usageStats == true && upiStats == false && bwtStats == false && feedbackStats == false && collectionStats == true) ||  (usageStats == false && collectionStats == true && upiStats == true && feedbackStats == true &&bwtStats == false)) ? "page-break" : ""}
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
                              {/* {usageStats != true && <div  className="page-break" ></div> } */}

                              {upiStats && (
                                <StatsItem
                                  className={((usageStats == true && collectionStats == true ) || (usageStats == false && collectionStats == false ) || (usageStats == false && collectionStats == true && bwtStats == false && feedbackStats == false ) ||(usageStats == true && collectionStats == false && bwtStats == false && feedbackStats == false && upiStats == true )) ? "page-break" : ""}
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
                                  className= {((usageStats == true && collectionStats == true && upiStats == true ) || (usageStats == false && collectionStats == false && upiStats == false && feedbackStats == false ) || (usageStats == false && collectionStats == false && upiStats == false && feedbackStats == true ) || (usageStats == true && collectionStats == false && upiStats == false && feedbackStats == false && bwtStats == true )) ? "page-break" : ""}
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
                                  className= {((usageStats == true && collectionStats == true && upiStats == true && bwtStats == true ) || (usageStats == false && collectionStats == false && upiStats == false && bwtStats == false) || (usageStats == false && collectionStats == true && upiStats == true && bwtStats == false) || (usageStats == false && collectionStats == false && upiStats == false && bwtStats == true ) || (usageStats == true && collectionStats == false && upiStats == false && bwtStats == false && feedbackStats == true ) || (usageStats == false && collectionStats == false && upiStats == true && bwtStats == true && feedbackStats == true ) || (usageStats == true && collectionStats == true && upiStats == true && bwtStats == false && feedbackStats == true )) ? "page-break" : ""}
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
                                    <td style={{ "fontWeight": "bold" }}>
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
                                    data?.data?.dashboardChartData?.usage
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
      </>
    );
  };


  const memoizedComponent = useMemo(() => {
    console.log("hasdata memoized data checked:-> ", hasdata);
    console.log("reportData again", reportData);
    if(reportData.length > 0) {
      return <OfflineReportComponent />;
    }
  }, [reportData]);
  
  if (hasdata) {
    console.log("hasdata", hasdata);
    console.log("reportData", reportData);
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
                {memoizedSummaryComponent}
                {memoizedComponent}
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
