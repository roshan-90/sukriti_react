// App.js
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import DashboardComponent from "./components/DashboardComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  setLoggedIn,
  setUsername,
} from "./features/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useEffect(() => {
    // const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
    const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
    const user = localStorage.getItem("user");
    if (userFromLocalStorage) {
      dispatch(setLoggedIn(userFromLocalStorage));
      dispatch(setUsername(user));
    }
  }, []);

  if (isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/dashboard" element={<DashboardComponent />} />
          <Route path="/*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
