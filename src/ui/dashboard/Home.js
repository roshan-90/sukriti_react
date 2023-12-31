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

const Home = () => {
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
    localStorage.removeItem("lastVisitedPage");
  }, [navigate]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      fetchDashboardData(15);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    // Return null if not authenticated to prevent rendering the component
    return null;
  }

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
    } catch (err) {
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("fetchDashboardData Error:->", err);
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("fetchAndInitClientList Error", err);
          },
        });
      }
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
      let text = err.message.includes("expired");
      if (text) {
        setDialogData({
          title: "Error",
          message: err.message,
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.log("fetchDashboardData Error:->", err);
            window.location.reload();
            dispatch(clearUser());
          },
        });
      } else {
        setDialogData({
          title: "Error",
          message: "SomeThing Went Wrong",
          onClickAction: () => {
            // Handle the action when the user clicks OK
            console.error("fetchAndInitClientList Error", err);
            window.location.reload();
            dispatch(clearUser());
          },
        });
      }
    }
  };

  const setDurationSelection = async (duration) => {
    console.log("duration", duration);
    reportParms.duration = duration;
    await fetchDashboardData();
  };

  // Check if dashboard_data and its required properties exist
  if (!dashboard_data?.data) {
    return null;
  }
  console.log("dashboard_data", dashboard_data?.data);

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
