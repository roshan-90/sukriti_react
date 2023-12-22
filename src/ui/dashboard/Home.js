// DashboardComponent.js
import React, { useEffect } from "react";
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

const Home = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dashboard_data = useSelector(dashboard);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const navigate = useNavigate();
  console.log("user", user);
  const reportParms = { complex: "all", duration: "15" };

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
      console.log("fetchDashboardData Error:->", err);
    } finally {
      dispatch(stopLoading()); // Dispatch the stopLoading action
    }
  };

  const fetchAndInitClientList = async () => {
    try {
      var result = await executelistClientsLambda(user?.credentials);
      console.log("fetchAndInitClientList", result);
      dispatch(setClientList(result.clientList));
    } catch (error) {
      console.error("fetchAndInitClientList Error", error);
    }
  };

  const setDurationSelection = async (duration) => {
    console.log("duration", duration);
    reportParms.duration = duration;
    await fetchDashboardData();
  };

  console.log("dashboard_data", dashboard_data?.data);

  // Check if dashboard_data and its required properties exist
  if (!dashboard_data?.data) {
    return null;
  }

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
        </div>
      ) : (
        <div>No data available</div>
      )}
    </>
  );
};

export default Home;
