// useOnlineStatus.js
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDashboardData,
  setDashboardConfig,
} from "../features/dashboardSlice";
import {
  setTeamList,
  setClientList,
  setData,
} from "../features/adminstrationSlice";
import { savePayload } from "../features/iccc-dashboard-reducer";
import { fullComplexStore } from "../features/complesStoreSlice";
import { setTicketList } from "../features/incidenceSlice";
import { setReportData } from "../features/reportSlice";
import { setComplexData } from "../features/extraSlice";
import {
  setTeamList as vendorsetTeamList,
  setVendorList,
} from "../features/vendorSlice";
import { setAccessTree } from "../features/authenticationSlice";

const useOnlineStatus = () => {
  const dispatch = useDispatch();
  const authentication = useSelector((state) => state.authentication);
  const dashboard = useSelector((State) => State.dashboard);
  const adminstration = useSelector((state) => state.adminstration);
  const clientData = useSelector((state) => state.clientData);
  const historyStore = useSelector((state) => state.historyStore);
  const complexStore = useSelector((state) => state.complexStore);
  const incidenece = useSelector((state) => state.incidenece);
  const report = useSelector((state) => state.report);
  const extra = useSelector((state) => state.extra);
  const vendor = useSelector((state) => state.vendor);

  const handleOfflineState = (check) => {
    try {
      if (!check) {
        console.log("handleOffline state", check);
        console.log("authentication data", authentication);
        console.log("dashboard ", dashboard);

        localStorage.setItem("authentication", JSON.stringify(authentication));
        localStorage.setItem("dashboard", JSON.stringify(dashboard));
        localStorage.setItem("adminstration", JSON.stringify(adminstration));
        localStorage.setItem("clientData", JSON.stringify(clientData));
        localStorage.setItem("historyStore", JSON.stringify(historyStore));
        localStorage.setItem("complexStore", JSON.stringify(complexStore));
        localStorage.setItem("incidenece", JSON.stringify(incidenece));
        localStorage.setItem("report", JSON.stringify(report));
        localStorage.setItem("extra", JSON.stringify(extra));
        localStorage.setItem("vendor", JSON.stringify(vendor));
      }
    } catch (error) {
      console.error("Error storing data in local storage:", error);
    }
  };

  const handleOnlineState = () => {
    console.log("handleOnline state");
    console.log("authentication data", authentication);
    const authentication_data = JSON.parse(
      localStorage.getItem("authentication")
    );
    const dashboard_data = JSON.parse(localStorage.getItem("dashboard"));
    const administration_data = JSON.parse(
      localStorage.getItem("adminstration")
    );
    const client_data = JSON.parse(localStorage.getItem("clientData"));
    const historyStore = JSON.parse(localStorage.getItem("historyStore"));
    const complexstore_data = JSON.parse(localStorage.getItem("complexStore"));
    const incidence_data = JSON.parse(localStorage.getItem("incidenece"));
    const report_data = JSON.parse(localStorage.getItem("report"));
    const extra_data = JSON.parse(localStorage.getItem("extra"));
    const vendor_data = JSON.parse(localStorage.getItem("vendor"));
    console.log("dashboard ", dashboard_data);
    console.log("administration_data", administration_data);
    console.log("client_Data", client_data);
    console.log("historystore_Data", historyStore);
    console.log("complexStore data", complexstore_data);
    console.log("incidenece_data", incidence_data);
    console.log("report_data", report_data);
    console.log("extra_data", extra_data);
    console.log("vendor_data", vendor_data);
    dispatch(setAccessTree(authentication_data?.accessTree));
    dispatch(setDashboardData(dashboard_data?.data));
    dispatch(
      setDashboardConfig({ dashboardConfig: dashboard_data?.configData })
    );
    dispatch(setTeamList(administration_data?.teamList));
    dispatch(setClientList(administration_data?.clientList));
    dispatch(setData(administration_data?.data));
    console.log("complexstore_data in online status", complexstore_data);
    // dispatch(savePayload(client_data?.complexes));
    dispatch(fullComplexStore(complexstore_data));
    dispatch(setTicketList({ ticketList: incidence_data?.ticketList }));
    dispatch(setReportData(report_data?.data));
    dispatch(setComplexData({ complexData: extra_data?.data }));
    dispatch(vendorsetTeamList({ teamList: vendor_data?.teamList }));
    dispatch(setVendorList({ vendorList: vendor_data?.vendorList }));
  };

  useEffect(() => {}, [
    // authentication,
    dashboard,
    adminstration,
    clientData,
    historyStore,
    complexStore,
    incidenece,
    report,
    extra,
    vendor,
  ]);

  // useEffect(() => {
  //   const online = navigator.onLine;
  //   if (online) {
  //     handleOnlineState(true);
  //   } else {
  //     handleOfflineState(false);
  //   }
  // }, [authentication]); // Add dependencies as needed

  return { handleOfflineState, handleOnlineState };
};

export default useOnlineStatus;
