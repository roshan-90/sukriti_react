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
import { selectIsAuthenticated, setUser } from "./features/authSlice";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  console.log("isAuthenticated", isAuthenticated);
  useEffect(() => {
    // const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
    const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
    console.log("sd", userFromLocalStorage);
    if (userFromLocalStorage) {
      dispatch(setUser(userFromLocalStorage));
    }
  }, [dispatch]);

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
