// App.js
import React, { Suspense, useEffect, lazy, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginComponent from "./components/LoginComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  setLoggedIn,
  setUsername,
  setUser,
  selectUser,
  setTriggerFunction
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
const EnrollDevice = lazy(() => import("./ui/android_management/EnrollDevice"));

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
const UserProfile = lazy(() => import("./ui/profile/UserProfile"))

const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { handleOfflineState, setLocalStorageItem, getLocalStorageItem } =
    useOnlineStatus();
  const authentication = useSelector(selectUser);
  const [offlinecount, setOfflineCount] = useState(0);
  const [refreshcount, setRefreshCount] = useState(0);
  const user = localStorage.getItem("user");
  const [checkstatus, setCheckStatus] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      const userFromLocalStorage = JSON.parse(localStorage.getItem("data"));
      const userDetails = JSON.parse(localStorage.getItem("userDetails"));

      if (userFromLocalStorage) {
        setCheckStatus(1);
        dispatch(setUsername(user));
        dispatch(setLoggedIn(userFromLocalStorage));
        dispatch(setUser(userDetails));
      } 
    } else {
      if(isAuthenticated){
        setCheckStatus(1);
      }
    }
  }, [isAuthenticated, dispatch]);
  const loading = () => (
    <div className="animated fadeIn pt-1 text-center">Loading...</div>
  );

  useEffect(() => {
    function onlineHandler() {
      console.log("Online");
      setIsOnline(true);
      console.log('s4s4s4');
      dispatch(setTriggerFunction(true));
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

  // useEffect(() => {
  //   console.log("beforeunload");
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     localStorage.setItem("lastVisitedPage", window.location.pathname);
  //     window.location.href = `${window.location.origin}/index.html`;
  //     console.log("check href", window.location.href);
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
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

  // const lastVisitedPage = localStorage.getItem("lastVisitedPage");
  // console.log('lastVisitedPage',lastVisitedPage);
 
  if(user) {
    if(checkstatus == 0) {
      return loading();
    }
  }

  // if (isAuthenticated) {
    return (
      <React.Suspense fallback={loading()}>
        <div
          className="app"
          style={{
            backgroundColor: "#e4e5e6",
          }}
        >
          <Router>
          
          {user ? (
          <>
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
                      element={<AdministrationHome authentication={authentication} />}
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
                      exact={false}
                      name={"Android Management"}
                      element={<AndroidManagement />}
                    />
                    <Route
                      path={"/android_management/enroll_device"}
                      exact={true}
                      name={"Enroll Device"}
                      element={<EnrollDevice />}
                    />
                    <Route
                      path={"/user-profile"}
                      exact={true}
                      name={"User Profile"}
                      element={<UserProfile />}
                    />
                    <Route path="/*" element={<Navigate to="/dashboard" />} />
                  </Routes>
                </Container>
              </main>
            </div>
            <Suspense fallback={loading()}>
              <DefaultFooter />
            </Suspense>
            </>
            ) : (<Routes>
          <Route path="/login" element={<LoginComponent />} />
          <Route path="/*" element={<Navigate to="/login" />} />
          <Route path="/activation_user" element={<ConfigureUser />} />
        </Routes>)
        }
          </Router>
        </div>
      </React.Suspense>
    );
  // }

  // if (lastVisitedPage) {
  //   return (
  //     <Router>
  //       <Routes>
  //       <Route path="/login" element={<LoginComponent />} />
  //       {lastVisitedPage ? <Route path="/" element={<Navigate to="/android_management" replace />} /> : null}
  //       </Routes>
  //     </Router>
  //   );
  // }
  
  // return (
  //   <React.Suspense fallback={loading()}>
  //     <Router>
  //       <Routes>
  //         <Route path="/login" element={<LoginComponent />} />
  //         <Route path="/*" element={<Navigate to="/login" />} />
  //         <Route path="/activation_user" element={<ConfigureUser />} />
  //       </Routes>
  //     </Router>
  //   </React.Suspense>
  // );

  // let size = function (bytes) {
  //   if (bytes === 0) {
  //     return "0.00 B";
  //   }
    
  //   let e = Math.floor(Math.log(bytes) / Math.log(1024));
  //   return (bytes / Math.pow(1024, e)).toFixed(2) +
  //     ' ' + ' KMGTP'.charAt(e) + 'B';
  // }
  
  // let bytes = 2887577600;
  
  // console.log(bytes + " bytes = " + size(bytes));
  
};

export default App;
