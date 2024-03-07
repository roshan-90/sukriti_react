// // DashboardComponent.js
// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   selectUser,
//   selectIsAuthenticated,
// } from "../features/authenticationSlice";
// import { useNavigate } from "react-router-dom";
// import {
//   executeFetchDashboardLambda,
//   executelistClientsLambda,
// } from "../awsClients/administrationLambdas";
// import { setClientList } from "../features/adminstrationSlice";
// import { setDashboardData } from "../features/dashboardSlice";
// import CircularProgress from "@mui/material/CircularProgress";
// import { startLoading, stopLoading } from "../features/loadingSlice";

// const DashboardComponent = () => {
//   const dispatch = useDispatch();
//   const user = useSelector(selectUser);
//   const isAuthenticated = useSelector(selectIsAuthenticated);
//   const isLoading = useSelector((state) => state.loading.isLoading);
//   const navigate = useNavigate();
//   console.log("user", user);
//   const reportParms = { complex: "all", duration: "15" };

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate("/login");
//     } else {
//       fetchDashboardData(15);
//     }
//   }, [isAuthenticated, navigate]);

//   if (!isAuthenticated) {
//     // Return null if not authenticated to prevent rendering the component
//     return null;
//   }

//   const fetchDashboardData = async (duration) => {
//     try {
//       dispatch(startLoading()); // Dispatch the startLoading action
//       await fetchAndInitClientList();
//       var result = await executeFetchDashboardLambda(
//         user?.username,
//         reportParms.duration,
//         reportParms.complex,
//         user?.credentials
//       );
//       dispatch(setDashboardData(result));
//       console.log("fetchDashboardData", result);
//     } catch (err) {
//       console.log("fetchDashboardData Error:->", err);
//     } finally {
//       dispatch(stopLoading()); // Dispatch the stopLoading action
//     }
//   };

//   const fetchAndInitClientList = async () => {
//     try {
//       var result = await executelistClientsLambda(user?.credentials);
//       console.log("fetchAndInitClientList", result);
//       dispatch(setClientList(result.clientList));
//     } catch (error) {
//       console.error("fetchAndInitClientList Error", error);
//     }
//   };

//   const setDurationSelection = async (duration) => {
//     console.log("duration", duration);
//     reportParms.duration = duration;
//     await fetchDashboardData();
//   };

//   return (
//     <div>
//       {isLoading && (
//         <div className="loader-container">
//           <CircularProgress
//             className="loader"
//             style={{ color: "rgb(93 192 166)" }} // Set the color using the style prop
//           />
//         </div>
//       )}
//       {/* Show CircularProgress when loading is true */}
//       <h1>Welcome, {user?.username}!</h1>
//     </div>
//   );
// };

// export default DashboardComponent;
