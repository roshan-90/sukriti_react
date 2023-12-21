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

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    authentication: authenticationReducer,
    dashboard: dashboardReducer,
    adminstration: adminstrationReducer,
  },
});
const loading = () => (
  <div className="animated fadeIn pt-1 text-center">Loading...</div>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <React.StrictMode off>
      <React.Suspense fallback={loading()}>
        <App />
      </React.Suspense>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
