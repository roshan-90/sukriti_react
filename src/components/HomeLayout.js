import React, { Suspense, useEffect, useState } from "react";
import AppBar from "../components/AppBar";
import { Container } from "reactstrap";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import DashboardComponent from "../components/DashboardComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  setLoggedIn,
  setUsername,
} from "../features/authenticationSlice";
import { useNavigate } from "react-router-dom";

const HomeLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );
  //   if (!isAuthenticated) {
  //     // const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
  //     const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
  //     const user = localStorage.getItem("user");
  //     if (userFromLocalStorage) {
  //       dispatch(setUsername(user));
  //       dispatch(setLoggedIn(userFromLocalStorage));
  //     }
  //   }

    if (isAuthenticated) {
      return null; // Render loading or authentication screen
    }

  //   console.log("home", isAuthenticated);
  return (
    <div>
      <AppBar style={{ width: "100%" }} />
      <div className="app-body">
        <main className="main">
          <Container fluid>
            <Routes>
              <Route path="/dashboard" element={<DashboardComponent />} />
            </Routes>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default HomeLayout;
