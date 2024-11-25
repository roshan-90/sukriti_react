// DashboardComponent.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  setLoadingPdf,
} from "../../features/authenticationSlice";
import { useNavigate } from "react-router-dom";
import {
  executeFetchDashboardLambda,
  executelistClientsLambda,
} from "../../awsClients/administrationLambdas";
import { setClientList } from "../../features/adminstrationSlice";
import { setDashboardData, dashboard } from "../../features/dashboardSlice";
import CircularProgress from "@mui/material/CircularProgress";
import { startLoading, stopLoading } from "../../features/loadingSlice";
import Summary from "./Summary";
import Stats from "./Stats";
import ActiveTickets from "./ActiveTickets";
import HealthStatus from "./HealthStatus";
import MessageDialog from "../../dialogs/MessageDialog"; // Adjust the path based on your project structure
import WaterLevelStatus from "./WaterLevelStatus";
import QuickConfig from "./QuickConfig";
import LiveStatus from "./LiveStatus";
import { clearUser } from "../../features/authenticationSlice";
import useOnlineStatus from "../../services/useOnlineStatus";
// import { DropDownLabel } from "../../components/DisplayLabels";
import { updateIncidenceSelectedCabin } from "../../features/incidenceSlice";
import { whiteSurface } from "../../jsStyles/Style";
import { cabinDetailsStyle } from "../../jsStyles/Style";
import Dropdown from "../../components/DropDown";
import Select from "react-select"; // Importing react-select
import DashboardCarousel from "./DashboardCarousel";

const Home = ({ isOnline }) => {
  const {
    handleOnlineState,
    setLocalStorageItem,
    getLocalStorageItem,
    setCookie,
    getCookie,
  } = useOnlineStatus();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dashboard_data = useSelector(dashboard);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const navigate = useNavigate();
  const reportParms = { complex: "all", duration: "15" };
  const [dialogData, setDialogData] = useState(null);
  const [recycleViewData, setRecycleViewData] = useState(null);
  const [selectView, setSelectView] = useState({
    label: "Summary View",
    value: "Summary View",
  });
  const actionOptions = ["15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];
  const actionValues = [15, 30, 45, 60, 90];
  const viewOptions = [
    { label: "Summary View", value: "Summary View" },
    { label: "Recycle View", value: "Recycle View" },
  ];
  const parentFrequency = [
    { label: "20 Sec", value: 20000 },
    { label: "40 Sec", value: 40000 },
    { label: "1 Min", value: 60000 },
    { label: "1 Min 20 Sec", value: 80000 },
    { label: "1 Min 40 Sec", value: 100000 },
    { label: "2 Min", value: 120000 },
  ];
  const [selectParentFrequency, setSelectParentFrequency] = useState({
    label: "20 Sec",
    value: 20000,
  });

  const childFrequency = [
    { label: "5 Sec", value: 5000 },
    { label: "10 Sec", value: 10000 },
    { label: "15 Sec", value: 15000 },
    { label: "20 Sec", value: 20000 },
  ];
  const [selectChildFrequency, setSelectChildFrequency] = useState({
    label: "5 Sec",
    value: 5000,
  });

  useEffect(() => {
    if (isOnline == false) {
      handleOnlineState();
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      let getuser = localStorage.getItem("set_user");
      let dashboard_15 = getLocalStorageItem("dashboard_15");
      let value = JSON.parse(localStorage.getItem("report_dashboard"));
      // setRecycleViewData(value);
      if (
        (getuser !== null && getuser !== user?.username) ||
        dashboard_15 == undefined
      ) {
        console.log("1:-->");
        fetchDashboardData(15);
        localStorage.setItem("settrigger", "1");
      } else {
        console.log("2:-->");
        dispatch(setDashboardData(dashboard_15));
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }
      localStorage.setItem("selection_key", "15 Days");
      if (getuser) {
        localStorage.removeItem("set_user");
      }
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    // Return null if not authenticated to prevent rendering the component
    return null;
  }

  const handleError = (err, Custommessage, onclick = null) => {
    console.log("error -->", err);
    let text = err.message.includes("expired");
    if (text) {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    } else {
      setDialogData({
        title: "Error",
        message: err.message,
        onClickAction: () => {
          // Handle the action when the user clicks OK
          console.log(`${Custommessage} -->`, err);
        },
      });
    }
  };

  // Function to check if it's been 24 hours since the last function call
  const checkAndUpdateFunction = async (name) => {
    let hours = new Date().getHours();

    if (hours > 10) {
      var lastRunTime = getCookie(`lastRunTime${name}`);
      var currentTime = new Date().getTime();
      if (
        !lastRunTime ||
        currentTime - parseInt(lastRunTime) >= name * 60 * 60 * 1000
      ) {
        let result_90 = await executeFetchDashboardLambda(
          user?.username,
          "90",
          reportParms.complex,
          user?.credentials
        );
        console.log("result_90", result_90);
        setLocalStorageItem("dashboard_90", JSON.stringify(result_90));
        if (isOnline == true) {
          fetch_dashboard();
        }
        // Update the last run time
        setCookie(`lastRunTime${name}`, currentTime.toString(), name); // Expires in 24 hours
      }
    }
  };

  const fetchDashboardData = async (duration) => {
    try {
      dispatch(setLoadingPdf(true));
      dispatch(startLoading()); // Dispatch the startLoading action
      await fetchAndInitClientList();
      var result = await executeFetchDashboardLambda(
        user?.username,
        reportParms.duration,
        reportParms.complex,
        user?.credentials
      );
      dispatch(setDashboardData(result));
      console.log("fetchDashboardData", result);
      console.log("reportparms.duration is -->", reportParms.duration);
      if (reportParms.duration == "15") {
        setLocalStorageItem("dashboard_15", JSON.stringify(result));
      }
      dispatch(stopLoading()); // Dispatch the stopLoading action
      await checkAndUpdateFunction(24);
      let result_90 = await executeFetchDashboardLambda(
        user?.username,
        "90",
        reportParms.complex,
        user?.credentials
      );
      console.log("result_90", result_90);
      setLocalStorageItem("dashboard_90", JSON.stringify(result_90));
      if (isOnline == true) {
        fetch_dashboard();
      }
      dispatch(setLoadingPdf(false));
    } catch (err) {
      handleError(err, "fetchDashboardData");
      dispatch(setLoadingPdf(false));
      dispatch(stopLoading()); // Dispatch the stopLoading action
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const fetchAndInitClientList = async () => {
    try {
      var result = await executelistClientsLambda(user?.credentials);
      console.log("fetchAndInitClientList", result);
      dispatch(setClientList(result.clientList));
    } catch (err) {
      handleError(err, "fetchAndInitClientList");
    } finally {
      // dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const filter_complex = (all_report_data, duration) => {
    // setRecycleViewData(null);
    let array_data = [];
    for (let i = 0; i < all_report_data.length; i++) {
      const response = all_report_data[i];
      for (let j = 0; j < response.length; j++) {
        const obj = response[j];
        filter_date(obj, duration, array_data);
      }
    }

    // setRecycleViewData([array_data]);
  };

  const setDurationSelection = async (duration) => {
    console.log("duration", duration);
    reportParms.duration = duration;
    // if (isOnline == false) {
    let value = localStorage.getItem("report_dashboard");
    switch (true) {
      case duration === 15:
        let dashboard_15 = getLocalStorageItem("dashboard_15");
        // filter_complex(JSON.parse(value), 15);
        if (dashboard_15 == undefined || dashboard_15 == null) {
        } else {
          dispatch(setDashboardData(dashboard_15));
        }
        break;
      case duration === 30:
        let dashboard_30 = getLocalStorageItem("dashboard_30");
        // filter_complex(JSON.parse(value), 30);
        if (dashboard_30 == undefined || dashboard_30 == null) {
        } else {
          dispatch(setDashboardData(dashboard_30));
        }
        break;
      case duration === 45:
        let dashboard_45 = getLocalStorageItem("dashboard_45");
        // filter_complex(JSON.parse(value), 45);
        if (dashboard_45 == undefined || dashboard_45 == null) {
        } else {
          dispatch(setDashboardData(dashboard_45));
        }
        break;
      case duration === 60:
        let dashboard_60 = getLocalStorageItem("dashboard_60");
        // filter_complex(JSON.parse(value), 60);
        if (dashboard_60 == undefined || dashboard_60 == null) {
        } else {
          dispatch(setDashboardData(dashboard_60));
        }
        break;
      case duration === 90:
        let dashboard_90 = getLocalStorageItem("dashboard_90");
        // filter_complex(JSON.parse(value), 90);
        if (dashboard_90 == undefined || dashboard_90 == null) {
        } else {
          dispatch(setDashboardData(dashboard_90));
        }
        break;
      default:
        console.log("default switch working");
    }
    // } else {
    //   await fetchDashboardData();
    // }
  };

  // Check if dashboard_data and its required properties exist
  if (!dashboard_data?.data) {
    return null;
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

  let bwtdata_summary = {
    waterRecycled: 0,
  };

  const filter_date = (data, duration) => {
    // Define start and end dates
    const startDateString = "2023-12-10"; // Example start date string
    const endDateString = "2024-01-30"; // Example end date string

    // Function to filter data based on date range
    function filterDataByDateRange(data, startDateString, endDateString) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - duration); // Set start date to 15 days ago
      const endDate = new Date(); // End date is today
      // const startDate = new Date(startDateString);
      // const endDate = new Date(endDateString);
      return data.filter((entry) => {
        const [day, month, year] = entry.date.split("/");
        const entryDate = new Date(`${year}-${month}-${day}`);
        return entryDate >= startDate && entryDate <= endDate;
      });
    }

    // Create a new object to store filtered data for all keys
    let filteredData = {};
    const dataSummary = {
      collection: 0,
      feedback: 0,
      upiCollection: 0,
      usage: 0,
    };

    const databwtsummary = {
      all: 0,
      bwt: 0,
    };

    const bwtSummary = (data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          databwtsummary.all += Number(data[i].all);
          databwtsummary.bwt += Number(data[i].bwt);
        }
      }
    };

    const summaryFunction = (key, data) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          if (key in dataSummary) {
            if (key === "feedback") {
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
              dataSummary[key] += Number(data[i].all);
              if (key === "usage") {
                if (data[i].fwc !== 0) {
                  usage_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  usage_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  usage_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  usage_summary[2].value += Number(data[i].pwc);
                }
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
      summaryFunction(key, filteredData[key]);
    });
    // Update data.dashboardChartData with filteredData
    Object.assign(data.dashboardChartData, filteredData);
    dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(1);
    dataSummary.feedback =
      dataSummary.feedback == "NaN" ? 0 : dataSummary.feedback;
    Object.assign(data.dataSummary, dataSummary);
    Object.assign(data.pieChartData, {
      collection: collection_summary,
      feedback: feedback_summary,
      upiCollection: upiCollection_summary,
      usage: usage_summary,
    });
    filteredData = {};
    filteredData = filterDataByDateRange(
      data.bwtdashboardChartData?.waterRecycled,
      startDateString,
      endDateString
    );

    Object.assign(data.bwtdashboardChartData, { waterRecycled: filteredData });
    bwtSummary(filteredData);
    Object.assign(data.bwtdataSummary, { waterRecycled: databwtsummary?.all });

    Object.assign(data.bwtpieChartData, {
      usage: [
        {
          name: "BWT",
          value: databwtsummary?.bwt,
        },
      ],
    });
    setLocalStorageItem(`dashboard_${duration}`, JSON.stringify(data));

    // array_data.push(data);
  };

  const fetch_dashboard = async () => {
    let dashboard_90 = getLocalStorageItem("dashboard_90");
    console.log(" after fetch_dashboard",dashboard_90);
    let array = [60, 45, 30, 15];
    array.forEach((duration) => {
      filter_date(dashboard_90, duration);
    });
    // let result_30 = await executeFetchDashboardLambda(
    //   user?.username,
    //   "30",
    //   reportParms.complex,
    //   user?.credentials
    // );
    // setLocalStorageItem("dashboard_30", JSON.stringify(result_30));
    // console.log("result_30", result_30);
    // let result_45 = await executeFetchDashboardLambda(
    //   user?.username,
    //   "45",
    //   reportParms.complex,
    //   user?.credentials
    // );
    // console.log("result_45", result_45);
    // setLocalStorageItem("dashboard_45", JSON.stringify(result_45));
    // let result_60 = await executeFetchDashboardLambda(
    //   user?.username,
    //   "60",
    //   reportParms.complex,
    //   user?.credentials
    // );
    // console.log("result_60", result_60);
    // setLocalStorageItem("dashboard_60", JSON.stringify(result_60));
    // let result_90 = await executeFetchDashboardLambda(
    //   user?.username,
    //   "90",
    //   reportParms.complex,
    //   user?.credentials
    // );
    // console.log("result_90", result_90);
    // setLocalStorageItem("dashboard_90", JSON.stringify(result_90));
  };

  // const handleUpdate = (configName, configValue) => {
  //   dispatch(stopLoading()); // Dispatch the stopLoading action
  //   console.log("_updateCommand", configName, configValue);
  //   const index = actionOptions.indexOf(configValue);
  //   setDurationSelection(actionValues[index]);
  //   if(dashboard_data.selectionView?.value !== "Summary View") {
  //     setTimeout(() => {
  //       dispatch(stopLoading()); // Dispatch the stopLoading action
  //     }, 7000);
  //   }
  // };

  const handleUpdateView = (data) => {
    console.log("handleUpdateView", data);
    setSelectView(data);
  };

  const handleUpdateParentFrequency = (data) => {
    console.log("handleUpdateParentFrequency", data);
    setSelectParentFrequency(data);
  };

  const handleUpdateChildFrequency = (data) => {
    console.log("handleUpdateChildFrequency", data);
    setSelectParentFrequency(data);
  };

  

  console.log("recycleViewData", recycleViewData);
 
  return (
    <>
      {isLoading && (
        <div className="loader-container">
          <CircularProgress
            className="loader"
            style={{ color: "rgb(93 192 166)" }}
          />
        </div>
      )}
      <MessageDialog data={dialogData} />
      <br />
      {/* <div  class="container" style={{ width: "22%", marginLeft: "79%"}}>
            <div class="row" > 
              <div class="col" style={{  marginLeft: "60px", padding: "0px" , width: "auto"}}>
                {"Duration".trim()}
              </div>
            <div class="col">
              <Dropdown
                options={actionOptions}
                onSelection={(index, value) => {
                  handleUpdate("Duration", value);
                }}
              />
            </div>
            </div>
          </div> */}
          <div
            className="row"
            style={{
              boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
              transition: "0.3s",
              margin: "0px",
              borderRadius: "5px",
              padding: "0px",

              background: "white",
              width: "100%",
              padding: "0px",
              display: "flexbox",
              alignItems: "center",
            }}
          >
        {dashboard_data.selectionView?.value == "Summary View" ? (
          <>
            {dashboard_data?.data ? (
              <div>
                <Summary
                  chartData={dashboard_data.data.dashboardChartData}
                  bwtChartData={dashboard_data.data.bwtdashboardChartData}
                  dataSummary={dashboard_data.data.dataSummary}
                  bwtDataSummary={dashboard_data.data.bwtdataSummary}
                  uiResult={dashboard_data.data.uiResult}
                />
                <Stats
                  setDurationSelection={setDurationSelection}
                  chartData={dashboard_data.data?.dashboardChartData}
                  pieChartData={dashboard_data.data?.pieChartData}
                  bwtChartData={dashboard_data.data?.bwtdashboardChartData}
                  bwtPieChartData={dashboard_data.data?.bwtpieChartData}
                  bwtDataSummary={dashboard_data.data?.bwtdataSummary}
                  dashboardUpiChartData={
                    dashboard_data.data?.dashboardUpiChartData
                  }
                  pieChartUpiData={dashboard_data.data?.pieChartUpiData}
                  dataSummary={dashboard_data.data?.dataSummary}
                  uiResult={dashboard_data.data?.uiResult?.data}
                />
                <ActiveTickets data={dashboard_data?.data?.activeTickets} />
                <HealthStatus data={dashboard_data?.data?.faultyComplexes} />
                <LiveStatus data={dashboard_data?.data?.connectionStatus} />
                <WaterLevelStatus
                  data={dashboard_data?.data?.lowWaterComplexes}
                />
                <QuickConfig uiResult={dashboard_data?.data?.uiResult?.data} />
              </div>
            ) : (
              <div>No data available</div>
            )}
          </>
        ) : (
          <>
            {dashboard_data?.data ? (
              <div className="carousel">
                <DashboardCarousel
                  dashboardData={dashboard_data?.RecycleViewData}
                  parentFrequency={dashboard_data?.selectParentFrequency}
                />
                <br />
                <br />
              </div>
            ) : (
              <div>No data available</div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export function DropDownLabel(props) {
  const [paymentMode, setPaymentMode] = useState(0);

  return (
    <div
      className="row"
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0",
        margin: "0px 0px 30px 0px",
      }}
    >
      <div
        className="col-md-2"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          padding: "0",
        }}
      >
        <div
          style={{
            ...cabinDetailsStyle.cabinHealth.itemTitle,
            textAlign: "end",
          }}
        >
          {props.label}
        </div>
      </div>

      <div
        className="col-md-1"
        style={{
          marginLeft: "12px",
        }}
      ></div>
      <div
        className="col-md-6"
        style={{
          marginLeft: "8px",
        }}
      >
        <Dropdown
          options={props.options}
          onSelection={(index, value) => {
            setPaymentMode(value);
            props.handleUpdate(props.label, value);
          }}
        />
      </div>
    </div>
  );
}

export default Home;
