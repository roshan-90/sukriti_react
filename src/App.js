// App.js
import React, { Suspense, useEffect } from "react";
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
} from "./features/authenticationSlice";
import AppBar from "./components/AppBar";
import { Container } from "reactstrap";
import DefaultFooter from "./components/DefaultFooter";
import Home from "./ui/dashboard/Home";
import AdministrationHome from "./ui/administration/AdministrationHome";
import MemberDetails from "./ui/administration/MemberDetailsHome";

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      // const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
      const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
      const user = localStorage.getItem("user");
      if (userFromLocalStorage) {
        dispatch(setUsername(user));
        dispatch(setLoggedIn(userFromLocalStorage));
      }
      console.log("sdsd");
    }
  }, [isAuthenticated, dispatch]);
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  if (isAuthenticated) {
    return (
      <React.Suspense fallback={loading()}>
        <div
          className="app"
          style={{
            backgroundColor: "#e4e5e6",
          }}
        >
          <Router>
            <AppBar style={{ width: "100%" }} />
            <div className="app-body">
              <main className="main">
                <Container fluid>
                  <Routes>
                    <Route
                      path={"/dashboard"}
                      name={"Dashboard"}
                      exact={true}
                      element={<Home />}
                    />
                    <Route
                      path={"/administration"}
                      exact={true}
                      name={"Administration"}
                      element={<AdministrationHome />}
                    />
                    <Route
                      path={"/administration/memberDetails/:id"}
                      exact={true}
                      name={"Member Details"}
                      element={<MemberDetails />}
                    />
                    <Route path="/*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </Container>
              </main>
            </div>
            <Suspense fallback={loading()}>
              <DefaultFooter />
            </Suspense>
          </Router>
        </div>
      </React.Suspense>
    );
  }

  return (
    <React.Suspense fallback={loading()}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};

export default App;
