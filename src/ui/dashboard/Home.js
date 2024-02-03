// DashboardComponent.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectUser,
  selectIsAuthenticated,
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

const Home = ({ isOnline }) => {
  const { handleOnlineState, setLocalStorageItem, getLocalStorageItem } =
    useOnlineStatus();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dashboard_data = useSelector(dashboard);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const navigate = useNavigate();
  console.log("user", user);
  const reportParms = { complex: "all", duration: "15" };
  const [dialogData, setDialogData] = useState(null);

  useEffect(() => {
    const lastVisitedPage = localStorage.getItem("lastVisitedPage");
    if (lastVisitedPage) {
      navigate(lastVisitedPage);
    }
    if (isOnline == false) {
      handleOnlineState();
    }
    localStorage.removeItem("lastVisitedPage");
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchDashboardData(15);
      localStorage.setItem("selection_key", "15 Days");
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

  const fetchDashboardData = async (duration) => {
    try {
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
    } catch (err) {
      handleError(err, "fetchDashboardData");
    } finally {
      if (isOnline == true) {
        fetch_dashboard();
      }
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
    if (isOnline == false) {
      console.log("reportParms.duration", typeof reportParms.duration);
      console.log("reportParms.duration === 15", reportParms.duration === 15);
      switch (true) {
        case duration === 15:
          let dashboard_15 = getLocalStorageItem("dashboard_15");
          console.log("this is reportParms is 15 is selected", dashboard_15);
          dispatch(setDashboardData(dashboard_15));
          break;
        case duration === 30:
          let dashboard_30 = getLocalStorageItem("dashboard_30");
          console.log("this is reportparms is 30 selected", dashboard_30);
          dispatch(setDashboardData(dashboard_30));
          break;
        case duration === 45:
          let dashboard_45 = getLocalStorageItem("dashboard_45");
          console.log("this is reportParms is 45 selected", dashboard_45);
          dispatch(setDashboardData(dashboard_45));
          break;
        case duration === 60:
          let dashboard_60 = getLocalStorageItem("dashboard_60");
          console.log("this is reportparms is 60 selected", dashboard_60);
          dispatch(setDashboardData(dashboard_60));
          break;
        case duration === 90:
          let dashboard_90 = getLocalStorageItem("dashboard_90");
          console.log("this is reportparms is 90 selected", dashboard_90);
          dispatch(setDashboardData(dashboard_90));
          break;
        default:
          console.log("default switch working");
      }
    } else {
      await fetchDashboardData();
    }
  };

  // Check if dashboard_data and its required properties exist
  if (!dashboard_data?.data) {
    return null;
  }
  console.log("dashboard_data", dashboard_data?.data);

  const fetch_dashboard = async () => {
    let result_30 = await executeFetchDashboardLambda(
      user?.username,
      "30",
      reportParms.complex,
      user?.credentials
    );
    setLocalStorageItem("dashboard_30", JSON.stringify(result_30));
    console.log("result_30", result_30);
    let result_45 = await executeFetchDashboardLambda(
      user?.username,
      "45",
      reportParms.complex,
      user?.credentials
    );
    console.log("result_45", result_45);
    setLocalStorageItem("dashboard_45", JSON.stringify(result_45));
    let result_60 = await executeFetchDashboardLambda(
      user?.username,
      "60",
      reportParms.complex,
      user?.credentials
    );
    console.log("result_60", result_60);
    setLocalStorageItem("dashboard_60", JSON.stringify(result_60));
    let result_90 = await executeFetchDashboardLambda(
      user?.username,
      "90",
      reportParms.complex,
      user?.credentials
    );
    console.log("result_90", result_90);
    setLocalStorageItem("dashboard_90", JSON.stringify(result_90));
  };

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
      {dashboard_data?.data ? (
        <div>
          <h1>Welcome, {user?.username}!</h1>
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
    </>
  );
};

export default Home;
