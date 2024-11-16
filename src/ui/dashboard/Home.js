// DashboardComponent.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
  setLoadingPdf
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
  console.log("user", user);
  const reportParms = { complex: "all", duration: "15" };
  const [dialogData, setDialogData] = useState(null);
  const [selectView, setSelectView] = useState('')
  const actionOptions = ["15 Days", "30 Days", "45 Days", "60 Days", "90 Days"];
  const actionValues = [15, 30, 45, 60, 90];
  const viewOptions = ["Summary View", "Recycle View"];

  useEffect(() => {
    // const lastVisitedPage = localStorage.getItem("lastVisitedPage");
    // if (lastVisitedPage) {
    //   navigate(lastVisitedPage);
    // }
    if (isOnline == false) {
      handleOnlineState();
    }
    // localStorage.removeItem("lastVisitedPage");
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      let getuser =  localStorage.getItem('set_user');  
      let dashboard_15 = getLocalStorageItem("dashboard_15");
      // console.log('getuser',getuser);
      // console.log('user?.username', getuser !== user?.username);   
      // console.log('condition change :-> 2',dashboard_15 == undefined);
      // console.log('condition change : -> 3',(getuser !== null && getuser !== user?.username ));
      // console.log('dashboard_15',dashboard_15);
      if((getuser !== null && getuser !== user?.username ) || dashboard_15 == undefined){
        console.log('1:-->')
        fetchDashboardData(15);
        localStorage.setItem("settrigger", "1");
      } else {
        console.log('2:-->')
        dispatch(setDashboardData(dashboard_15));
        dispatch(stopLoading()); // Dispatch the stopLoading action
      }
      localStorage.setItem("selection_key", "15 Days");
      if(getuser){
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
    console.log("hour check", name);
    let hours = new Date().getHours();

    if(hours > 10) {
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

  const setDurationSelection = async (duration) => {
    console.log("duration", duration);
    reportParms.duration = duration;
    // if (isOnline == false) {
      console.log("reportParms.duration", typeof reportParms.duration);
      console.log("reportParms.duration", reportParms.duration);
      switch (true) {
        case duration === 15:
          let dashboard_15 = getLocalStorageItem("dashboard_15");
          console.log("this is reportParms is 15 is selected", dashboard_15);
          if(dashboard_15 == undefined || dashboard_15 == null) {
            
          } else {
            dispatch(setDashboardData(dashboard_15));
          }
          break;
        case duration === 30:
          let dashboard_30 = getLocalStorageItem("dashboard_30");
          console.log("this is reportparms is 30 selected", dashboard_30);
          if(dashboard_30 == undefined || dashboard_30 == null) {
            
          } else {
            dispatch(setDashboardData(dashboard_30));
          }
          break;
        case duration === 45:
          let dashboard_45 = getLocalStorageItem("dashboard_45");
          console.log("this is reportParms is 45 selected", dashboard_45);
          if(dashboard_45 == undefined || dashboard_45 == null) {
            
          } else {
            dispatch(setDashboardData(dashboard_45));
          }
          break;
        case duration === 60:
          let dashboard_60 = getLocalStorageItem("dashboard_60");
          console.log("this is reportparms is 60 selected", dashboard_60);
          if(dashboard_60 == undefined || dashboard_60 == null) {
            
          } else {
            dispatch(setDashboardData(dashboard_60));
          }
          break;
        case duration === 90:
          let dashboard_90 = getLocalStorageItem("dashboard_90");
          console.log("this is reportparms is 90 selected", dashboard_90);
          if(dashboard_90 == undefined || dashboard_90 == null) {
            
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
  console.log("dashboard_data", dashboard_data?.data);

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
      console.log("bwt summary", data);
      for (let i = 0; i < data.length; i++) {
        console.log("checking bwt summary", data[i]);
        if (data[i].all !== 0) {
          databwtsummary.all += Number(data[i].all);
          databwtsummary.bwt += Number(data[i].bwt);
        }
      }
    };

    const summaryFunction = (key, data) => {
      console.log("summaryFunction :-->", data);
      for (let i = 0; i < data.length; i++) {
        if (data[i].all !== 0) {
          if (key in dataSummary) {
            if (key === "feedback") {
              console.log("check key feedback :-->", key);
              console.log("total feedback", data.length);
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
              console.log("check key :-->", key);
              console.log("check vlaue of key :-->", data[i].all);
              dataSummary[key] += Number(data[i].all);
              if (key === "usage") {
                if (data[i].fwc !== 0) {
                  console.log("ussage summary-->fwc", data[i].fwc);
                  usage_summary[1].value += Number(data[i].fwc);
                }
                if (data[i].mur !== 0) {
                  console.log("ussage summary-->mur", data[i].mur);
                  usage_summary[3].value += Number(data[i].mur);
                }
                if (data[i].mwc !== 0) {
                  console.log("ussage summary-->mwc", data[i].mwc);
                  usage_summary[0].value += Number(data[i].mwc);
                }
                if (data[i].pwc !== 0) {
                  console.log("ussage summary-->pwc", data[i].pwc);
                  usage_summary[2].value += Number(data[i].pwc);
                }
                console.log("usage_summary", usage_summary);
                console.log("usage_summary--1", usage_summary[0].name);
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
          console.log("i :-->", data[i].all);
          console.log("value :->", key in dataSummary);
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
      console.log("key", key);
      console.log("filteredData", filteredData[key]);
      summaryFunction(key, filteredData[key]);
    });
    // Update data.dashboardChartData with filteredData
    Object.assign(data.dashboardChartData, filteredData);
    dataSummary.feedback = (dataSummary.feedback / totalCount).toFixed(1);
    Object.assign(data.dataSummary, dataSummary);
    Object.assign(data.pieChartData, {
      collection: collection_summary,
      feedback: feedback_summary,
      upiCollection: upiCollection_summary,
      usage: usage_summary,
    });
    filteredData = {};
    console.log("dashboard convert 30", data);
    // dispatch(setReportData(data));

    console.log("data.dashboardChartData :-->", data);
    console.log("data.dashboard summary", dataSummary);
    console.log("data totalCount", totalCount);

    filteredData = filterDataByDateRange(
      data.bwtdashboardChartData?.waterRecycled,
      startDateString,
      endDateString
    );
    console.log("filteredData 22:-> ", filteredData);

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

    console.log("filter data -->", data);
    setLocalStorageItem(`dashboard_${duration}`, JSON.stringify(data));
    // dispatch(setDashboardData(data));
  };

  const fetch_dashboard = async () => {
    console.log(" after fetch_dashboard");
    let dashboard_90 = getLocalStorageItem("dashboard_90");
    let array = [60,45,30,15];
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

  const handleUpdate = (configName, configValue) => {
    console.log("_updateCommand", configName, configValue);
    const index = actionOptions.indexOf(configValue);
    setDurationSelection(actionValues[index]);
  };

  const handleUpdateView = (data) => {
    console.log('handleUpdateView', data);
    setSelectView(data);
  }

  console.log('selectView', selectView);

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
        <div style={{display: "flex" , justifyContent: "center"}}>
          <h3>Welcome, {user?.user?.name}&nbsp;&nbsp;</h3>
          <div style={{ width: "20%", float: "right" }}>
            <DropDownLabel
              label={"Duration"}
              handleUpdate={handleUpdate}
              options={actionOptions}
            />
          </div>
          <div style={{ width: "30%", float: "right" }}>
            <DropDownLabel
              label={"view selector"}
              handleUpdate={handleUpdateView}
              options={viewOptions}
            />
          </div>
      </div>
      <br />
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
      
      {dashboard_data?.data ? (
        <div>
            <h3>Dashboard Summary view</h3>
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
            dashboardUpiChartData={dashboard_data.data?.dashboardUpiChartData}
            pieChartUpiData={dashboard_data.data?.pieChartUpiData}
            dataSummary={dashboard_data.data?.dataSummary}
            uiResult={dashboard_data.data?.uiResult?.data}
          />
          <ActiveTickets data={dashboard_data?.data?.activeTickets} />
          <HealthStatus data={dashboard_data?.data?.faultyComplexes} />
          <LiveStatus data={dashboard_data?.data?.connectionStatus} />
          <WaterLevelStatus data={dashboard_data?.data?.lowWaterComplexes} />
          <QuickConfig uiResult={dashboard_data?.data?.uiResult?.data} />
        </div>
      ) : (
        <div>No data available</div>
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
