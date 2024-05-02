import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./features/authenticationSlice";
import "bootstrap/dist/css/bootstrap.min.css";
import adminstrationReducer from "./features/adminstrationSlice";
import dashboardReducer from "./features/dashboardSlice";
import loadingReducer from "./features/loadingSlice";
import complexStoreReducer from "./features/complesStoreSlice";
import iccc_dataReducer from "./features/iccc-dashboard-reducer";
import historyReducer from "./features/historySlice";
import incidenceReducer from "./features/incidenceSlice";
import reportReducer from "./features/reportSlice";
import extraReducer from "./features/extraSlice";
import vendorSlice from "./features/vendorSlice";
import androidManagementSlice from "./features/androidManagementSlice";

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("/service-worker.js")
//     .then((registration) => {
//       console.log("Service Worker registered with scope:", registration.scope);
//     })
//     .catch((error) => {
//       console.error("Service Worker registration failed:", error);
//     });
// }

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    authentication: authenticationReducer,
    dashboard: dashboardReducer,
    adminstration: adminstrationReducer,
    clientData: iccc_dataReducer,
    historyStore: historyReducer,
    complexStore: complexStoreReducer,
    incidenece: incidenceReducer,
    report: reportReducer,
    extra: extraReducer,
    vendor: vendorSlice,
    androidManagement: androidManagementSlice
  },
});
const loading = () => (
  <div className="animated fadeIn pt-1 text-center">Loading...</div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.Suspense fallback={loading()}>
      <App />
    </React.Suspense>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
