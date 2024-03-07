// App.js
import React, { Suspense, useEffect, lazy, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
// import DashboardComponent from "./components/DashboardComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  setLoggedIn,
  setUsername,
  setUser,
  selectUser,
} from "./features/authenticationSlice";
import AppBar from "./components/AppBar";
import { Container } from "reactstrap";
import DefaultFooter from "./components/DefaultFooter";
import Home from "./ui/dashboard/Home";
import AdministrationHome from "./ui/administration/AdministrationHome";
import MemberDetails from "./ui/administration/MemberDetailsHome";
import ConfigureUser from "./components/ConfigureUser";
import useOnlineStatus from "./services/useOnlineStatus";

const DefineMemberAccess = lazy(() =>
  import("./ui/administration/DefineMemberAccess")
);
const AddTeamMember = lazy(() => import("./ui/administration/AddTeamMember"));
const GrantPermissions = lazy(() =>
  import("./ui/administration/GrantPermissions")
);
const ComplexNavigation = lazy(() =>
  import("./ui/complexes/ComplexNavigation")
);
const ComplexDetails = lazy(() => import("./ui/complexes/ComplexDetails"));
const IncidenceTicket = lazy(() => import("./ui/incidence/IncidenceHome"));
const ReportsHome = lazy(() => import("./ui/reports/ReportsHome"));
const VendorHome = lazy(() => import("./ui/vendor/VendorHome"));
const VendorDetails = lazy(() => import("./ui/vendor/VendorDetailsHome"));
const UpdateVendorMember = lazy(() => import("./ui/vendor/UpdateVendorMember"));
const AddVendorMember = lazy(() => import("./ui/vendor/AddVendorMember"));
const CreateNewTicket = lazy(() => import("./ui/incidence/CreateNewTicket"));
const IncidenceTicketDetails = lazy(() =>
  import("./ui/incidence/IncidenceTicketDetails")
);
const AndroidManagement = lazy(() =>
  import("./ui/android_management/AndroidDetails")
);

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { handleOfflineState, setLocalStorageItem, getLocalStorageItem } =
    useOnlineStatus();
  const authentication = useSelector(selectUser);
  const [offlinecount, setOfflineCount] = useState(0);
  const [refreshcount, setRefreshCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      // const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
      const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
      const user = localStorage.getItem("user");
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));

      if (userFromLocalStorage) {
        dispatch(setUsername(user));
        dispatch(setLoggedIn(userFromLocalStorage));
        dispatch(setUser(userDetails));
      }
      console.log("sdsd");
    }
  }, [isAuthenticated, dispatch]);
  console.log("sdsd2");
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  useEffect(() => {
    function onlineHandler() {
      console.log("Online");
      setIsOnline(true);
    }

    const offlineHandler = () => {
      console.log("Offline", authentication);
      setIsOnline(false);
      setOfflineCount(1);
    };

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, [isOnline]); // Add isOnline as a dependency

  useEffect(() => {
    console.log("beforeunload");
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      localStorage.setItem("lastVisitedPage", window.location.pathname);
      window.location.href = `${window.location.origin}/index.html`;
      console.log("check href", window.location.href);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // useEffect(() => {
  //   console.log("reload --> 1");

  //   const handleLoad = () => {
  //     // Function to be called after page reload
  //     console.log("Page has completed reloading", authentication);
  //     setRefreshCount(1);

  //     // You can call your function here
  //     // yourFunction();
  //   };

  //   window.addEventListener("load", handleLoad);

  //   return () => {
  //     window.removeEventListener("load", handleLoad);
  //   };
  // }, []);

  console.log("isOnline", isOnline);
  console.log("user--->", authentication);
  console.log("count", offlinecount);

  if (isOnline == false && offlinecount == 1) {
    console.log("function work");
    handleOfflineState(isOnline, authentication);
    setOfflineCount(0);
  }

  // if (isOnline == false && refreshcount == 1) {
  //   console.log("after page refresh", authentication);
  // }

  // setLocalStorageItem("myKey", JSON.parse(localStorage.getItem("userDetails")));
  // // Get decoded item from localStorage
  // const retrievedData = getLocalStorageItem("myKey");

  // console.log("retrievedData", retrievedData);
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
            <AppBar style={{ width: "100%" }} isOnline={isOnline} />
            <div className="app-body">
              <main className="main">
                <Container fluid>
                  <Routes>
                    <Route
                      path={"/dashboard"}
                      name={"Dashboard"}
                      exact={true}
                      element={<Home isOnline={isOnline} />}
                    />
                    <Route
                      path="/complex/complexTree"
                      exact={true}
                      name={"Complex Tree"}
                      element={<ComplexNavigation />}
                    />
                    <Route
                      path="/complex/details"
                      exact={true}
                      name={"Complex Details"}
                      element={<ComplexDetails />}
                    />
                    <Route
                      path="/reports"
                      exact={true}
                      name={"Reports"}
                      element={<ReportsHome isOnline={isOnline} />}
                    />
                    <Route
                      path={"/incidence/tickets"}
                      exact={true}
                      name={"Incidence"}
                      element={<IncidenceTicket />}
                    />
                    <Route
                      path={"/incidence/raiseNewTicket"}
                      exact={true}
                      name={"Icidence"}
                      element={<CreateNewTicket />}
                    />
                    <Route
                      path={"/Incidence/TicketDetails/:id_name"}
                      exact={true}
                      name={"Ticket Details"}
                      element={<IncidenceTicketDetails />}
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
                    <Route
                      path={"/administration/addTeamMember"}
                      exact={true}
                      name={"Add Team Member"}
                      element={<AddTeamMember />}
                    />
                    <Route
                      path={"/administration/grantPermissions"}
                      exact={true}
                      name={"Grant Permissions"}
                      element={<GrantPermissions />}
                    />
                    <Route
                      path={"/administration/defineAccess/:id"}
                      exact={true}
                      name={"Define Access"}
                      element={<DefineMemberAccess />}
                    />
                    <Route
                      path={"/vendor"}
                      exact={true}
                      name={"Vendor"}
                      element={<VendorHome />}
                    />
                    <Route
                      path={"/vendor/addVendorMember"}
                      exact={true}
                      name={"Add Vendor Member"}
                      element={<AddVendorMember />}
                    />
                    <Route
                      path={"/vendor/vendorDetails/:id"}
                      exact={true}
                      name={"Vendor Details"}
                      element={<VendorDetails />}
                    />
                    <Route
                      path={"/vendor/updateVendor/:id"}
                      exact={true}
                      name={"Update Vendor Member"}
                      element={<UpdateVendorMember />}
                    />
                    <Route
                      path={"/android_management"}
                      exact={true}
                      name={"Android Management"}
                      element={<AndroidManagement />}
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
          <Route path="/activation_user" element={<ConfigureUser />} />
        </Routes>
      </Router>
    </React.Suspense>
  );
};

export default App;
